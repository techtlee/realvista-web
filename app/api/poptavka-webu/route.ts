/**
 * The storefront's submit, forwarded to the CMS.
 *
 * A proxy rather than letting the browser call the CMS directly: the CMS
 * origin stays private, no CORS is needed, and this route is the one place to
 * hang rate limiting and bot protection (Vercel firewall or Turnstile) before
 * the storefront goes public. Validation is not repeated here — the CMS is the
 * authority and returns issues the browser already knows how to map.
 */
const MAX_BODY_BYTES = 32 * 1024

export async function POST(request: Request): Promise<Response> {
  const cms = process.env.CMS_URL
  if (!cms) return Response.json({ error: 'Not configured' }, { status: 503 })

  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: 'Payload too large' }, { status: 413 })
  }

  try {
    const upstream = await fetch(`${cms}/api/intake`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: raw,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    const body = await upstream.text()
    return new Response(body, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    })
  } catch {
    return Response.json({ error: 'Upstream unavailable' }, { status: 502 })
  }
}
