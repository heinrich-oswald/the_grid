# Architecture Overview

This project consists of a static frontend with an Admin Panel that controls site behavior through a cloud Admin API. Updates propagate instantly via server‑sent events (SSE).

## Components

- Frontend (static HTML/CSS/JS)
  - Pages read `localStorage.admin_settings` for state and visuals.
  - Admin Panel writes to the Admin API and listens for SSE broadcast.
- Admin Panel (`admin.html`)
  - Uses `assets/admin_sync.js` to call the Admin API.
  - Health checks, settings CRUD, per‑event configuration.
- Admin API (Node, `node-admin-api/`)
  - Express server with endpoints: `/api/admin/health`, `/settings`, `/events/:type`, `/stream`.
  - Listens on `process.env.PORT` (Render compatible).
  - Broadcasts updates over SSE.
- Optional Admin API (Flask, `backend/`)
  - Similar endpoints under `/api/admin` for LAN/alt deployments.

## Data Flow

1. Admin Panel calls `/api/admin/settings` (GET/PUT) with `Authorization: Bearer <token>` when set.
2. Admin API persists settings and emits `settings_updated` over `/api/admin/stream` (SSE).
3. All pages connected to the same `API_BASE_URL` receive updates and store in `localStorage.admin_settings`.

## Security & CORS

- Token: `ADMIN_API_TOKEN` required unless explicitly disabled; set via localStorage for client calls.
- CORS: Allow site origin via `GRID_ALLOWED_ORIGIN` env var.

## Deployment Notes

- Render: Docker Web Service with `rootDir: node-admin-api` and `dockerfilePath: node-admin-api/Dockerfile`.
- Static hosting: GitHub Pages/Netlify/Vercel serve the frontend.