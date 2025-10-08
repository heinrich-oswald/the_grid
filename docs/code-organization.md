# Code Organization Guide

This repository hosts a static site, an Admin Panel, and one or more Admin API backends. This guide documents the layout, naming conventions, and how to work within the structure without breaking pages.

## Layout Overview

- `index.html`, `teams.html`, `timebound.html`, `multiplier.html` — primary pages.
- `admin.html`, `admin_login.html` — Admin Panel UI and login.
- `assets/` — shared frontend assets:
  - `ui.css` — common styles for Admin/diagnostic pages.
  - `config.js` — defines `window.__GRID_CONFIG__.API_BASE_URL` (override via localStorage).
  - `admin_sync.js` — unified Admin API client (health, settings, events, SSE).
  - Images (`logo.png`, `banner.png`).
- `node-admin-api/` — Node.js Express Admin API (Docker-friendly for Render).
- `backend/` — Python/Flask Admin API (optional for LAN or alt deployment).
- `admin-api/` — Next.js app (future/admin portal experiments).
- Utility scripts and diagnostics at repo root (`check_api_endpoints.ps1`, logo tools, tests).
- `render.yaml` — Render blueprint for Node Admin API service.

## Conventions

- Filenames: use lowercase and hyphens (e.g., `final-image-verification.html`).
- Keep shared JS in `assets/`. Page‑specific JS can remain at root, but prefer moving new shared code into `assets/` and import from there.
- Config lives in `assets/config.js`. At runtime you can override via DevTools:
  - `localStorage.setItem('API_BASE_URL','https://your-admin.onrender.com/api/admin')`
  - `localStorage.setItem('admin_api_token','<TOKEN>')`
- Pages read admin settings from `localStorage.admin_settings`; Admin Panel updates settings via the Admin API.

## Admin API Client

- Use `assets/admin_sync.js` functions:
  - `checkDbHealth()`, `fetchSettings()`, `pushSettings()`
  - `getEventPayload(type)`, `setEventPayload(type, data)`
  - `initSse()` — live updates across all pages via SSE
- Compatibility alias: `window.AdminAPI` maps to the above for legacy handlers.

## Deployment

- Static site: GitHub Pages/Netlify/Vercel; no server required.
- Node Admin API: Render Docker Web Service (`node-admin-api/Dockerfile`), listens on `process.env.PORT`.
- Env vars: `GRID_ALLOWED_ORIGIN`, `ADMIN_API_TOKEN`, `ADMIN_DB_PATH` for Node; Flask service uses similar variables.

## Safely Organizing Code

- When moving JS files referenced by pages, update `<script src="...">` in all affected HTML files.
- Prefer adding new shared utilities to `assets/` instead of root.
- Use the Developer Index page (`dev_index.html`) to quickly navigate and test after changes.