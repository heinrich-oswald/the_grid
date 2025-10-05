
The Grid — Deploy Instructions
-----------------------------
Files:
- index.html
- rules.html
- assets/ (place banner.png and logo.png here)
Preview locally:
1. Unzip and run: python -m http.server 8000
2. Open http://localhost:8000
Deploy to GitHub Pages:
1. Create repo, push files, enable Pages (main branch / root).
===============================
Lovable Cloud (Supabase) Hardened Setup
===============================

Overview
--------
- Use Supabase for storing global admin settings (`grid_admin_settings`) with RLS enabled.
- Expose reads publicly (everyone can read row `id=1`).
- Route writes through an Edge Function that runs with the service role for strict validation.
- Enable realtime channels to propagate changes instantly to all open tabs/devices.

Database Schema
---------------
Run these in the SQL editor:

```sql
create table if not exists public.grid_admin_settings (
  id int primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.grid_admin_settings (id, payload)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.grid_admin_settings enable row level security;
```

RLS Policies
------------
Public read of the single settings row:
```sql
create policy read_settings_public
on public.grid_admin_settings
for select
to public
using (id = 1);
```

Do NOT add write policies for `anon` users. With RLS enabled and no write policies, all client-side writes are denied by default. Writes happen only via Edge Functions with the service role.

Edge Functions
--------------
Create two functions in Supabase: `validate-admin-settings` and `delete-admin-settings`.

validate-admin-settings (Deno):
```ts
// supabase/functions/validate-admin-settings/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function handleRequest(req: Request): Promise<Response> {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const originAllowed = Deno.env.get('GRID_ALLOWED_ORIGIN') || '';

  // Basic origin check (optional)
  const reqOrigin = req.headers.get('origin') || '';
  if (originAllowed && reqOrigin !== originAllowed) {
    return new Response(JSON.stringify({ error: 'origin_not_allowed' }), { status: 403 });
  }

  const supabase = createClient(url, key);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400 });
  }

  // Basic schema validation
  const payload = body as Record<string, unknown>;
  if (typeof payload !== 'object' || payload === null) {
    return new Response(JSON.stringify({ error: 'invalid_payload' }), { status: 400 });
  }

  // Optional: enforce keys/types here
  const { error } = await supabase
    .from('grid_admin_settings')
    .upsert({ id: 1, payload, updated_at: new Date().toISOString() }, { onConflict: 'id' });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

export default { fetch: handleRequest };
```

delete-admin-settings (Deno):
```ts
// supabase/functions/delete-admin-settings/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function handleRequest(_req: Request): Promise<Response> {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(url, key);

  const { error } = await supabase.from('grid_admin_settings').delete().eq('id', 1);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
  // Optionally re-create empty row to keep reads working
  await supabase.from('grid_admin_settings').upsert({ id: 1, payload: {}, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
}

export default { fetch: handleRequest };
```

Env variables (Supabase dashboard → Functions → Settings):
- `SUPABASE_URL`: your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: service role key
- `GRID_ALLOWED_ORIGIN`: optional, set to `http://localhost:8000` or your deployed origin

Frontend Configuration
----------------------
In `assets/config.js`:
```js
window.__GRID_CONFIG__ = {
  BACKEND_PROVIDER: 'lovable',
  LOVABLE_PROJECT_URL: 'https://YOUR-REF.supabase.co',
  LOVABLE_ANON_KEY: 'YOUR-ANON-KEY',
  LOVABLE_USE_EDGE_FUNCTION: true,
  LOVABLE_ENABLE_REALTIME: true
};
```

Realtime Channels
-----------------
The frontend subscribes to `postgres_changes` on `grid_admin_settings` to instantly mirror updates into `localStorage`. Polling is kept as a 60s fallback.

Verification
------------
1) Confirm RLS: client-side writes via anon should fail; reads succeed.
2) Confirm Edge Function writes: saving in Admin pushes via `validate-admin-settings` and updates DB.
3) Confirm realtime: open two browsers and observe instant updates without refresh.
Admin Panel Sync Across Versions
--------------------------------
Goal: Ensure changes made in `admin.html` propagate to ALL site versions (local or deployed) instantly or within fallback polling.

Prerequisites
- All pages include `assets/config.js` and `assets/admin_sync.js`.
- Backend running on `:5000` (`python backend/app.py`) or Supabase configured.

Option A: Flask backend (recommended for LAN/local)
1) In Admin → Connectivity & Config:
   - Set `Backend Provider`: `Flask`.
   - Set `API Host`: the backend host reachable by all clients (e.g. your LAN IP `192.168.1.5` or domain).
   - Set `API Port`: `5000`.
   - Set `Admin Token`: leave blank unless backend enforces `ADMIN_API_TOKEN`.
   - Click `Save Config` (writes overrides to `localStorage`, reloads page).
2) Backend environment:
   - `GRID_ALLOWED_ORIGIN`: set to the origin(s) serving your pages (e.g. `http://localhost:8000` or your domain). This enables CORS for `/api/*`.
   - `ADMIN_API_TOKEN` (optional): when set, clients must supply matching token (the admin panel writes it to `localStorage.admin_api_token`).
3) How sync works (Flask):
   - Admin saves → `PUT /api/admin/settings` persists to SQLite.
   - Backend `broadcast_settings()` pushes updates to `/api/admin/stream` via SSE.
   - Clients (`admin_sync.js`) connect to SSE and write `localStorage.admin_settings`, reducing polling to 60s fallback.
   - Pages read `localStorage.admin_settings` and react to changes.

Option B: Supabase provider (Lovable Cloud) for multi‑deployment realtime
1) In `assets/config.js`:
   - Set `BACKEND_PROVIDER: 'lovable'`.
   - Provide `LOVABLE_PROJECT_URL` and `LOVABLE_ANON_KEY`.
   - Keep `LOVABLE_ENABLE_REALTIME: true`.
   - Optional: `LOVABLE_USE_EDGE_FUNCTION: true` and deploy functions for validated writes.
2) Create table `grid_admin_settings` (id=1 holds JSON payload). See steps earlier in this file.
3) How sync works (Supabase):
   - Admin saves → upsert row id=1.
   - Clients subscribe to `postgres_changes` → receive payload → write `localStorage.admin_settings`.

Verifying Sync
- In `admin.html`, toggle `Timers: Disabled` and save.
- Open `index.html`, `teams.html`, `timebound.html`, `multiplier.html`:
  - Confirm UI reacts to the new settings.
  - DevTools → Network: ensure `GET /api/admin/stream` (SSE) returns 200. If blocked, set `GRID_ALLOWED_ORIGIN` correctly and ensure all clients point to the same `API Host` and `API Port`.
- If deployed across multiple origins, ensure each site’s `localStorage` has matching `GRID_BACKEND_PROVIDER`, `GRID_FLASK_API_HOST`, `GRID_FLASK_API_PORT`, and `admin_api_token` (if used).

Notes
- `assets/admin_sync.js` is already included on all relevant pages and will keep `localStorage.admin_settings` up to date via SSE or realtime, with 30s polling fallback.
- If you see `net::ERR_ABORTED` for `/api/admin/stream`, backend may be unreachable from that origin; fix with host/port overrides and CORS as above.
