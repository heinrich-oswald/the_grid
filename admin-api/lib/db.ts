import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

const FILE_PATH = process.env.ADMIN_DB_PATH || './admin-settings.json';

function ensureDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(): any {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, 'utf8');
      return raw ? JSON.parse(raw) : {};
    }
  } catch {}
  return {};
}

function writeJson(obj: any) {
  try {
    ensureDirExists(FILE_PATH);
    fs.writeFileSync(FILE_PATH, JSON.stringify(obj || {}, null, 2), 'utf8');
  } catch {}
}

export function getSettings(): any {
  return readJson();
}

export function putSettings(obj: any): any {
  const next = obj || {};
  next.updated_at = Date.now();
  writeJson(next);
  return getSettings();
}

export function clearSettings() {
  try {
    if (fs.existsSync(FILE_PATH)) fs.unlinkSync(FILE_PATH);
  } catch {}
}

export function getEvent(type: string): any {
  const s = getSettings();
  const ev = s.events || {};
  return ev[type] || {};
}

export function putEvent(type: string, payload: any): any {
  const s = getSettings();
  const ev = s.events || {};
  ev[type] = payload || {};
  s.events = ev;
  return putSettings(s);
}

export const emitter = new EventEmitter();
export function broadcast(settings: any) {
  emitter.emit('settings', settings);
}