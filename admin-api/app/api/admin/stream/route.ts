import { emitter, getSettings } from '@/lib/db';
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

  const te = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Initial payload
      const initial = { settings: getSettings() };
      controller.enqueue(te.encode(`data: ${JSON.stringify(initial)}\n\n`));

      const handler = (settings: any) => {
        const payload = { settings };
        try {
          controller.enqueue(te.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch {}
      };
      emitter.on('settings', handler);

      const close = () => {
        try { emitter.off('settings', handler); } catch {}
        try { controller.close(); } catch {}
      };
      // @ts-ignore - not typed on Request
      const signal = (req as any)?.signal;
      if (signal && typeof signal.addEventListener === 'function') {
        signal.addEventListener('abort', close);
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...corsHeaders({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }),
    },
  });
}