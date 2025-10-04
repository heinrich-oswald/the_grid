import os
import json
import queue
from flask import Flask, jsonify, request, Response
from flask import stream_with_context
try:
    from flask_cors import CORS
except Exception:
    CORS = None

from db import SessionLocal, Settings, init_db, engine

app = Flask(__name__)
ALLOWED_ORIGIN = os.getenv('GRID_ALLOWED_ORIGIN', '*')
ADMIN_API_TOKEN = os.getenv('ADMIN_API_TOKEN', '').strip()
if CORS:
    # Use configured origin if provided; otherwise allow all
    cors_origins = ALLOWED_ORIGIN if ALLOWED_ORIGIN else '*'
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

# Fallback CORS headers when flask_cors isn't available

@app.after_request
def add_cors_headers(resp):
    try:
        resp.headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN
        resp.headers['Access-Control-Allow-Methods'] = 'GET,PUT,DELETE,OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    except Exception:
        pass
    return resp


def check_admin_auth(req):
    """Return True if request has valid admin auth OR no token configured."""
    if not ADMIN_API_TOKEN:
        return True
    auth = req.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        token = auth.split(' ', 1)[1].strip()
        if token == ADMIN_API_TOKEN:
            return True
    # Allow query param fallback
    token_qs = req.args.get('token', '')
    if token_qs and token_qs == ADMIN_API_TOKEN:
        return True
    return False


def require_admin(func):
    def wrapper(*args, **kwargs):
        if not check_admin_auth(request):
            return jsonify({"error": "unauthorized"}), 401
        return func(*args, **kwargs)
    # Preserve function name for Flask debug messages
    wrapper.__name__ = getattr(func, '__name__', 'wrapped')
    return wrapper


def init_db_wrapper():
    init_db()


def load_settings():
    try:
        with SessionLocal() as session:
            row = session.get(Settings, 1)
            if not row or not row.json:
                return {}
            return json.loads(row.json)
    except Exception:
        return {}


def save_settings(data: dict):
    with SessionLocal() as session:
        row = session.get(Settings, 1)
        payload = json.dumps(data)
        if not row:
            row = Settings(id=1, json=payload)
            session.add(row)
        else:
            row.json = payload
        session.commit()


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
@require_admin
def get_settings():
    return jsonify(load_settings())


@app.route('/api/admin/settings', methods=['PUT'])
@require_admin
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
@require_admin
def get_event(event_type):
    settings = load_settings()
    ev = (settings.get("events") or {}).get(event_type) or {}
    return jsonify(ev)


@app.route('/api/admin/events/<event_type>', methods=['PUT'])
@require_admin
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
@require_admin
def delete_settings():
    save_settings({})
    # notify listeners
    broadcast_settings()
    return jsonify({"ok": True})


@app.route('/api/admin/stream', methods=['GET'])
@require_admin
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


@app.route('/api/admin/db_health', methods=['GET'])
def db_health():
    """Basic DB connectivity diagnostics."""
    status = {
        "ok": False,
        "driver": getattr(engine.dialect, 'name', 'unknown'),
        "database": getattr(getattr(engine, 'url', None), 'database', None),
        "host": getattr(getattr(engine, 'url', None), 'host', None),
    }
    try:
        # minimal read
        with SessionLocal() as session:
            _ = session.get(Settings, 1)
        status["ok"] = True
    except Exception as e:
        status["error"] = str(e)
    return jsonify(status)

# Generic OPTIONS handler to satisfy preflight requests
@app.route('/api/<path:subpath>', methods=['OPTIONS'])
def options_any(subpath):
    return ('', 204)


if __name__ == '__main__':
    init_db_wrapper()
    app.run(host='0.0.0.0', port=5000)