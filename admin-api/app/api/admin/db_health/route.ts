import { corsHeaders, preflight } from '@/lib/cors';
import { checkAdminAuth } from '@/lib/auth';

export const runtime = 'nodejs';

export function OPTIONS() { return preflight(); }

export async function GET(req: Request) {
  if (!checkAdminAuth(req)) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders() });
  }
  return new Response(JSON.stringify({ ok: true, driver: 'sqlite' }), {
    status: 200,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}