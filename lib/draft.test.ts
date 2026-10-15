import { describe, expect, it } from 'vitest'

import { catalog } from './catalog'
import {
  decodeDraft,
  encodeDraft,
  initialDraft,
  normalizeDraft,
  toSelection,
  withBlogConsistency,
  type Draft,
} from './draft'
import { CONSENT_TEXT } from './consent'
import { createLeadSchema } from './selection'

const theme = catalog[0]!
const base = initialDraft(theme)

describe('normalizeDraft', () => {
  it('returns null for nothing usable', () => {
    expect(normalizeDraft(null, catalog)).toBeNull()
    expect(normalizeDraft('nonsense', catalog)).toBeNull()
  })

  it('falls back to defaults for values no longer on sale', () => {
    const d = normalizeDraft(
      { theme: { name: 'retired-theme', variant: 'purple' }, content: { tone: 'shouty' } },
      catalog,
    )!
    expect(d.theme).toEqual(base.theme)
    expect(d.content.tone).toBe('formal')
  })

  it('drops unknown and duplicate sections but keeps the chosen order', () => {
    const d = normalizeDraft({ sections: { home: ['stats', 'hero', 'bogus', 'stats'] } }, catalog)!
    expect(d.sections.home).toEqual(['stats', 'hero'])
  })

  it('never leaves the homepage empty', () => {
    const d = normalizeDraft({ sections: { home: ['bogus'] } }, catalog)!
    expect(d.sections.home).toEqual(theme.homeSections)
  })

  it('trims over-long brand text to the schema limits', () => {
    const d = normalizeDraft({ brand: { name: 'x'.repeat(500), tagline: 'y'.repeat(500) } }, catalog)!
    expect(d.brand.name).toHaveLength(120)
    expect(d.brand.tagline).toHaveLength(160)
  })
})

describe('withBlogConsistency', () => {
  it('removes the blog section when the blog module is off', () => {
    const d = withBlogConsistency({ ...base, modules: { ...base.modules, blog: false } })
    expect(d.sections.home).not.toContain('blog')
  })

  it('leaves sections alone when the blog is on', () => {
    expect(withBlogConsistency(base).sections.home).toEqual(base.sections.home)
  })
})

describe('encodeDraft / decodeDraft', () => {
  it('round-trips Czech text through a URL-safe string', () => {
    const d: Draft = { ...base, brand: { name: 'Říčanská realitní kancelář', tagline: 'Žluťoučký kůň' } }
    const encoded = encodeDraft(d)
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(decodeDraft(encoded)).toEqual(d)
  })

  it('returns null for a damaged link instead of throwing', () => {
    expect(decodeDraft('%%%not-base64')).toBeNull()
  })
})

describe('toSelection', () => {
  const draft: Draft = {
    ...base,
    theme: { name: 'realvista', variant: 'crimson' },
    sections: { home: ['hero', 'stats', 'contact'] },
    brand: { name: '  Novák Reality  ', tagline: '' },
    content: { tone: 'friendly' },
  }
  const selection = toSelection(draft, {
    page: '/',
    previewedVariants: ['indigo', 'crimson', 'crimson'],
    utm: { source: 'seznam', medium: undefined },
  })

  it('produces a lead the backend schema accepts', () => {
    const lead = {
      contact: { name: 'Jan Novák', email: 'jan@novakreality.cz' },
      consent: { given: true, text: CONSENT_TEXT },
      selection,
    }
    const result = createLeadSchema(catalog).safeParse(lead)
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true)
  })

  it('trims the brand, drops an empty tagline and de-duplicates previews', () => {
    expect(selection.brand).toEqual({ name: 'Novák Reality' })
    expect(selection.source?.previewedVariants).toEqual(['indigo', 'crimson'])
    expect(selection.source?.utm).toEqual({ source: 'seznam' })
  })

  it('leaves out domain and plan — the qualification call settles them', () => {
    expect(selection).not.toHaveProperty('domain')
    expect(selection).not.toHaveProperty('plan')
  })
})
