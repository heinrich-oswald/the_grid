import { getSettings, putSettings, clearSettings, broadcast } from '@/lib/db';
import { corsHeaders, preflight } from '@/lib/cors';
import { checkAdminAuth } from '@/lib/auth';

export const runtime = 'nodejs';

export function OPTIONS() {
  return preflight();
}

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  const json = getSettings();
  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

export async function PUT(req: Request) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  const obj = await req.json().catch(() => ({}));
  const updated = putSettings(obj);
  broadcast(updated);
  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

export async function DELETE(req: Request) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  clearSettings();
  broadcast({});
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}