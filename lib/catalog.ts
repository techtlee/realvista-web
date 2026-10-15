import 'server-only'

import type { Catalog } from '@makleri/selection'

/**
 * The themes on sale, from the CMS — which derives them from the theme
 * manifests. Nothing in this repo names a theme or a colourway, so a new
 * theme or colourway reaches the storefront without a deploy here.
 *
 * Returns null rather than throwing: in production ISR keeps serving the last
 * good page, and in development the page renders an honest error state
 * instead of a 500.
 */
export async function getCatalog(): Promise<Catalog | null> {
  const cms = process.env.CMS_URL
  if (!cms) return null

  try {
    const res = await fetch(`${cms}/api/themes`, { next: { revalidate: 300 } })
    if (!res.ok) return null

    const body = (await res.json()) as { themes?: unknown }
    if (!Array.isArray(body.themes) || body.themes.length === 0) return null
    return body.themes as Catalog
  } catch {
    return null
  }
}
