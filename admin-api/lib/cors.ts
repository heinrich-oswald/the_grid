const ALLOWED = process.env.GRID_ALLOWED_ORIGIN || 'http://localhost:8000';

export function corsHeaders(extra: Record<string, string> = {}) {
  return {
    'Access-Control-Allow-Origin': ALLOWED,
    'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    ...extra,
  };
}

export function preflight() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}