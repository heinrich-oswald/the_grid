import os
import json
import sqlite3
import queue
from flask import Flask, jsonify, request, Response
from flask import stream_with_context
try:
    from flask_cors import CORS
except Exception:
    CORS = None

DB_PATH = os.path.join(os.path.dirname(__file__), 'admin.db')

app = Flask(__name__)
if CORS:
    CORS(app, resources={r"/api/*": {"origins": "*"}})

# Fallback CORS headers when flask_cors isn't available
ALLOWED_ORIGIN = os.getenv('GRID_ALLOWED_ORIGIN', '*')

@app.after_request
def add_cors_headers(resp):
    try:
        resp.headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN
        resp.headers['Access-Control-Allow-Methods'] = 'GET,PUT,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    except Exception:
        pass
    return resp


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            json TEXT NOT NULL
        )
        """
    )
    # Ensure a single row exists
    cur.execute("SELECT COUNT(*) AS c FROM settings WHERE id = 1")
    row = cur.fetchone()
    if not row or row[0] == 0:
        cur.execute("INSERT INTO settings (id, json) VALUES (1, ?)", (json.dumps({}),))
    conn.commit()
    conn.close()


def load_settings():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT json FROM settings WHERE id = 1")
    row = cur.fetchone()
    conn.close()
    if not row:
        return {}
    try:
        return json.loads(row[0]) if row[0] else {}
    except Exception:
        return {}


def save_settings(data: dict):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE settings SET json = ? WHERE id = 1", (json.dumps(data),))
    conn.commit()
    conn.close()


# === Simple Server-Sent Events broadcaster ===
subscribers = []  # list of queue.Queue()


def broadcast_settings():
    """Push the latest settings to all connected subscribers."""
    data = load_settings()
    msg = {"type": "settings", "settings": data}
    dead = []
    for q in subscribers:
        try:
            q.put_nowait(msg)
        except Exception:
            dead.append(q)
    # clean up any dead queues
    if dead:
        for q in dead:
            try:
                subscribers.remove(q)
            except Exception:
                pass


@app.route('/api/admin/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})


@app.route('/api/admin/settings', methods=['GET'])
def get_settings():
    return jsonify(load_settings())


@app.route('/api/admin/settings', methods=['PUT'])
def put_settings():
    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict):
        return jsonify({"error": "Invalid JSON"}), 400
    # Basic shape normalization
    settings = load_settings()
    for key in ["persist_until", "timer_disabled"]:
        if key in payload:
            settings[key] = payload[key]
    # Events block
    events = settings.get("events", {})
    if isinstance(payload.get("events"), dict):
        # Merge incoming events config
        for ev_type, ev_cfg in payload["events"].items():
            if not isinstance(ev_cfg, dict):
                continue
            cur = events.get(ev_type, {})
            cur.update(ev_cfg)
            events[ev_type] = cur
    settings["events"] = events
    save_settings(settings)
    # notify listeners
    broadcast_settings()
    return jsonify(settings)


@app.route('/api/admin/events/<event_type>', methods=['GET'])
def get_event(event_type):
    settings = load_settings()
    ev = (settings.get("events") or {}).get(event_type) or {}
    return jsonify(ev)


@app.route('/api/admin/events/<event_type>', methods=['PUT'])
def put_event(event_type):
    payload = request.get_json(silent=True) or {}
    if not isinstance(payload, dict):
        return jsonify({"error": "Invalid JSON"}), 400
    settings = load_settings()
    events = settings.get("events", {})
    cur = events.get(event_type, {})
    # Allow known fields; ignore others silently
    allowed = {"disabled", "override_start_ms", "display_mode", "custom_label", "event_over"}
    for k, v in payload.items():
        if k in allowed:
            cur[k] = v
    events[event_type] = cur
    settings["events"] = events
    save_settings(settings)
    # notify listeners
    broadcast_settings()
    return jsonify(cur)


@app.route('/api/admin/settings', methods=['DELETE'])
def delete_settings():
    save_settings({})
    # notify listeners
    broadcast_settings()
    return jsonify({"ok": True})


@app.route('/api/admin/stream', methods=['GET'])
def stream():
    """Server-Sent Events endpoint providing live settings updates."""
    q = queue.Queue()
    subscribers.append(q)

    def event_stream():
        # Send initial snapshot
        init_msg = {"type": "init", "settings": load_settings()}
        yield f"data: {json.dumps(init_msg)}\n\n"
        while True:
            msg = q.get()  # blocks until a new message is available
            try:
                payload = json.dumps(msg)
            except Exception:
                payload = json.dumps({"type": "error", "message": "serialization_error"})
            yield f"data: {payload}\n\n"

    return Response(
        stream_with_context(event_stream()),
        mimetype='text/event-stream',
        headers={'Cache-Control': 'no-cache'}
    )


# Generic OPTIONS handler to satisfy preflight requests
@app.route('/api/<path:subpath>', methods=['OPTIONS'])
def options_any(subpath):
    return ('', 204)


if __name__ == '__main__':
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    init_db()
    app.run(host='0.0.0.0', port=5000)