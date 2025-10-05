import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.GRID_ALLOWED_ORIGIN || 'http://localhost:8000';
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || '';
const FILE_PATH = process.env.ADMIN_DB_PATH || './admin-settings.json';

const app = express();
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json());
// Explicit preflight handling for broader compatibility
app.options('*', cors({ origin: ORIGIN, credentials: true }));

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function readJson() {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf8');
      return raw ? JSON.parse(raw) : {};
    }
  } catch {}
  return {};
}
function writeJson(obj) {
  try {
    ensureDirExists(FILE_PATH);
    fs.writeFileSync(FILE_PATH, JSON.stringify(obj || {}, null, 2), 'utf8');
  } catch {}
}

function authed(req) {
  if (!ADMIN_TOKEN) return true;
  const auth = req.headers['authorization'] || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    const tok = auth.slice(7).trim();
    if (tok === ADMIN_TOKEN) return true;
  }
  const tok = (req.query?.token || '').toString();
  return tok === ADMIN_TOKEN;
}

// SSE clients
const clients = new Set();
function broadcast(payload) {
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const res of clients) {
    try { res.write(data); } catch {}
  }
}

app.get('/api/admin/settings', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  res.json(readJson());
});

app.put('/api/admin/settings', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  const obj = req.body || {};
  obj.updated_at = Date.now();
  writeJson(obj);
  broadcast({ settings: obj });
  res.json(obj);
});

app.delete('/api/admin/settings', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  try { if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH); } catch {}
  broadcast({ settings: {} });
  res.json({ ok: true });
});

app.get('/api/admin/events/:type', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  const s = readJson();
  const ev = s.events || {};
  const type = req.params.type;
  res.json(ev[type] || {});
});

app.put('/api/admin/events/:type', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  const s = readJson();
  const ev = s.events || {};
  ev[req.params.type] = req.body || {};
  s.events = ev;
  s.updated_at = Date.now();
  writeJson(s);
  broadcast({ settings: s });
  res.json(ev[req.params.type]);
});

app.get('/api/admin/db_health', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  res.json({ ok: true, driver: 'file' });
});

// Generic unauthenticated health/status endpoints for platform probes
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'admin-api' });
});
app.get('/health', (req, res) => {
  res.json({ ok: true });
});
app.get('/status', (req, res) => {
  res.json({ ok: true });
});
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/admin/stream', (req, res) => {
  if (!authed(req)) return res.status(401).end('Unauthorized');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.flushHeaders?.();
  clients.add(res);
  // Send initial
  res.write(`data: ${JSON.stringify({ settings: readJson() })}\n\n`);
  req.on('close', () => {
    try { clients.delete(res); } catch {}
  });
});

app.listen(PORT, () => {
  console.log(`Admin API listening on http://localhost:${PORT}`);
});