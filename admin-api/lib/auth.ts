export function checkAdminAuth(req: Request): boolean {
  const token = process.env.ADMIN_API_TOKEN || '';
  if (!token) return true;
  const auth = req.headers.get('authorization') || '';
  if (auth.toLowerCase().startsWith('bearer ')) {
    const val = auth.slice(7).trim();
    if (val === token) return true;
  }
  const url = new URL(req.url);
  const qsToken = url.searchParams.get('token') || '';
  if (qsToken && qsToken === token) return true;
  return false;
}