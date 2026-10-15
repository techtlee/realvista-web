import type { Catalog, CatalogTheme } from './catalog'
import { TONES, type SelectionV1 } from './selection'

/**
 * What the realtor is configuring, shaped like the selection JSON from the
 * start — the same keys, the same nesting — so submitting is assembly, not
 * translation. Only the parts the v1 storefront asks about live here; the rest
 * (`schemaVersion`, `capturedAt`, `source`, fixed module defaults) are added in
 * `toSelection`.
 *
 * `domain` and `plan` are deliberately absent: they are settled in the
 * qualification call, not on the landing page.
 */
export interface Draft {
  theme: { name: string; variant: string }
  modules: { blog: boolean; listingMap: boolean; mortgageCalculator: boolean }
  sections: { home: string[] }
  brand: { name: string; tagline: string }
  content: { tone: Tone }
}

export { TONES }
export type Tone = (typeof TONES)[number]

export const TONE_LABELS: Record<Tone, { label: string; example: string }> = {
  formal: {
    label: 'Formální',
    example: 'Zajistíme kompletní servis od ocenění nemovitosti po předání klíčů.',
  },
  friendly: {
    label: 'Přátelský',
    example: 'Postaráme se o všechno — vy si jen vyberete, kdy se stěhujete.',
  },
  neutral: {
    label: 'Věcný',
    example: 'Ocenění, prezentace, prohlídky, právní servis. Vše na jednom místě.',
  },
}

export function initialDraft(theme: CatalogTheme): Draft {
  return {
    theme: { name: theme.name, variant: theme.variants[0]?.value ?? '' },
    modules: { blog: true, listingMap: true, mortgageCalculator: false },
    sections: { home: [...theme.homeSections] },
    brand: { name: '', tagline: '' },
    content: { tone: 'formal' },
  }
}

/**
 * Brings any draft — from a shared link, from localStorage, from an older
 * catalog — back inside what is on sale today. Unknown values fall back to
 * defaults rather than failing, because a stale link should still open.
 */
export function normalizeDraft(raw: unknown, catalog: Catalog): Draft | null {
  if (!raw || typeof raw !== 'object') return null
  const d = raw as Partial<Draft>

  const theme = catalog.find((t) => t.name === d.theme?.name) ?? catalog[0]
  if (!theme) return null
  const base = initialDraft(theme)

  const variant = theme.variants.some((v) => v.value === d.theme?.variant)
    ? (d.theme?.variant as string)
    : base.theme.variant

  const modules = {
    blog: bool(d.modules?.blog, base.modules.blog),
    listingMap: bool(d.modules?.listingMap, base.modules.listingMap),
    mortgageCalculator: bool(d.modules?.mortgageCalculator, base.modules.mortgageCalculator),
  }

  const known = new Set(theme.homeSections)
  const home = Array.isArray(d.sections?.home)
    ? [...new Set(d.sections.home.filter((s): s is string => typeof s === 'string' && known.has(s)))]
    : base.sections.home

  return withBlogConsistency({
    theme: { name: theme.name, variant },
    modules,
    sections: { home: home.length > 0 ? home : base.sections.home },
    brand: {
      name: str(d.brand?.name, 120),
      tagline: str(d.brand?.tagline, 160),
    },
    content: {
      tone: TONES.includes(d.content?.tone as Tone) ? (d.content?.tone as Tone) : base.content.tone,
    },
  })
}

/**
 * The blog module and the blog section are one decision, not two. With the
 * module off, a `blog` section would render a block linking to a page the
 * config disabled.
 */
export function withBlogConsistency(draft: Draft): Draft {
  if (draft.modules.blog) return draft
  const home = draft.sections.home.filter((s) => s !== 'blog')
  return { ...draft, sections: { home: home.length > 0 ? home : draft.sections.home } }
}

export interface SourceFacts {
  page: string
  previewedVariants: string[]
  utm: Partial<Record<'source' | 'medium' | 'campaign' | 'term' | 'content', string>>
}

/** The full selection JSON, as `POST /api/intake` expects it. */
export function toSelection(draft: Draft, source: SourceFacts): SelectionV1 {
  const tagline = draft.brand.tagline.trim()
  const utm = Object.fromEntries(Object.entries(source.utm).filter(([, v]) => v))

  return {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    theme: draft.theme,
    modules: {
      ...draft.modules,
      // Not offered as toggles in v1: every site gets services, nobody gets
      // references until the theme has a references section to show them in.
      services: true,
      references: false,
    },
    sections: { home: draft.sections.home },
    brand: { name: draft.brand.name.trim(), ...(tagline ? { tagline } : {}) },
    content: { tone: draft.content.tone, locale: 'cs-CZ' },
    source: {
      page: source.page.slice(0, 500),
      previewedVariants: [...new Set(source.previewedVariants)].slice(0, 50),
      ...(Object.keys(utm).length > 0 ? { utm } : {}),
    },
    // `domain` and `plan` are omitted on purpose — see the Draft comment.
  }
}

// ── sharing a draft by URL ───────────────────────────────────────────────────

const PARAM = 'k'

export function encodeDraft(draft: Draft): string {
  const bytes = new TextEncoder().encode(JSON.stringify(draft))
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeDraft(value: string): unknown {
  try {
    const b64 = value.replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

export const DRAFT_PARAM = PARAM
export const DRAFT_STORAGE_KEY = 'realvista:konfigurace:v1'

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : ''
}
