import { getEvent, putEvent, broadcast } from '@/lib/db';
import { corsHeaders, preflight } from '@/lib/cors';
import { checkAdminAuth } from '@/lib/auth';

export const runtime = 'nodejs';

export function OPTIONS() { return preflight(); }

export async function GET(req: Request, { params }: { params: { type: string } }) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  const data = getEvent(params.type);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}

export async function PUT(req: Request, { params }: { params: { type: string } }) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  const obj = await req.json().catch(() => ({}));
  const updated = putEvent(params.type, obj);
  broadcast(updated);
  return new Response(JSON.stringify(updated.events?.[params.type] || {}), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}