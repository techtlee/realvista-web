import type { Draft } from './draft'

/**
 * The contract between the storefront and the preview route (`/nahled` on a
 * REALVISTA site, in platform/apps/site). Both sides must agree on exactly
 * this, so it is spelled out once:
 *
 * URL   /nahled?varianta=<value>&sekce=<id,id,…>&blog=0|1&mapa=0|1&hypoteka=0|1
 *       Renders Home from fixtures. Unknown section ids are dropped.
 *
 * parent → iframe   { type: 'makleri:variant', value }
 *       Sets `data-variant` on <html>. No reload, so a colour change is instant.
 *
 * iframe → parent   { type: 'makleri:ready' }
 *       Posted once the page has hydrated. Until it arrives the storefront
 *       shows its own wireframe, so a missing or slow preview never leaves an
 *       empty frame. Both sides check `event.origin`.
 */
export const PREVIEW_URL = process.env.NEXT_PUBLIC_PREVIEW_URL ?? ''

export const MSG_VARIANT = 'makleri:variant'
export const MSG_READY = 'makleri:ready'

export function previewOrigin(): string | null {
  try {
    return PREVIEW_URL ? new URL(PREVIEW_URL).origin : null
  } catch {
    return null
  }
}

/**
 * Built from the structural choices only. The colourway travels by
 * postMessage, so changing it never changes the src and never reloads.
 * `variant` here is just the one the page first paints with.
 */
export function previewSrc(draft: Pick<Draft, 'modules' | 'sections'>, variant: string): string | null {
  if (!PREVIEW_URL) return null
  const url = new URL('/nahled', PREVIEW_URL)
  url.searchParams.set('varianta', variant)
  url.searchParams.set('sekce', draft.sections.home.join(','))
  url.searchParams.set('blog', draft.modules.blog ? '1' : '0')
  url.searchParams.set('mapa', draft.modules.listingMap ? '1' : '0')
  url.searchParams.set('hypoteka', draft.modules.mortgageCalculator ? '1' : '0')
  return url.toString()
}
