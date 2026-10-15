/**
 * The lead submit, forwarded to our backend (`LEAD_ENDPOINT`, the CRM's
 * intake).
 *
 * A proxy rather than letting the browser post there directly: the backend
 * URL stays private, no CORS is needed, and this route is the one place to
 * hang rate limiting and bot protection before the page is public.
 *
 * With no backend configured, development logs the JSON and reports success
 * so the whole page can be clicked through on its own. Production refuses
 * instead — a deployed page must never tell a realtor their enquiry arrived
 * when it went nowhere.
 */
const MAX_BODY_BYTES = 32 * 1024

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Payload too large' }, { status: 413 })
  }

  const endpoint = process.env.LEAD_ENDPOINT
  if (!endpoint) {
    if (process.env.NODE_ENV === 'production') {
      return Response.json({ error: 'Lead endpoint not configured' }, { status: 503 })
    }
    console.log('[poptavka-webu] LEAD_ENDPOINT not set — lead not sent, logged instead:\n' + pretty(raw))
    return Response.json({ id: 'dev-only', delivered: false }, { status: 201 })
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: raw,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    return Response.json({ error: 'Upstream unavailable' }, { status: 502 })
  }
}

function pretty(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}
