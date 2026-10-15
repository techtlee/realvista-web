import { z } from 'zod'

import type { Catalog } from './catalog'

/**
 * The selection JSON (v1) and the lead request around it.
 *
 * A local copy of platform/packages/selection (schema.ts, intake.ts), so the
 * storefront builds with nothing outside this repo. It is used for types and
 * for instant feedback in the browser; the backend validates again and is the
 * authority.
 *
 * One deliberate difference: `domain` and `plan` are optional here, because
 * this page does not ask for them — they are settled in the qualification
 * call. The backend must accept them as optional too (see README).
 *
 * Rules carried over: `schemaVersion` is never reinterpreted, and keys are
 * only ever added, never removed or repurposed.
 */

export const TONES = ['formal', 'friendly', 'neutral'] as const
export const PORTFOLIO_SIZES = ['1-5', '6-20', '20+'] as const

const shape = {
  schemaVersion: z.literal(1),
  capturedAt: z.iso.datetime(),
  theme: z.object({ name: z.string().min(1), variant: z.string().min(1) }),
  modules: z.object({
    blog: z.boolean(),
    services: z.boolean(),
    listingMap: z.boolean(),
    mortgageCalculator: z.boolean(),
    references: z.boolean(),
  }),
  sections: z.object({ home: z.array(z.string().min(1)).min(1) }),
  brand: z.object({
    name: z.string().trim().min(1).max(120),
    tagline: z.string().trim().max(160).optional(),
  }),
  content: z.object({ tone: z.enum(TONES), locale: z.enum(['cs-CZ']) }),
  domain: z
    .object({
      situation: z.enum(['have-access', 'have-no-access', 'none']),
      name: z.string().optional(),
      registrar: z.string().optional(),
      emailOnDomain: z.enum(['yes', 'no', 'unknown']),
    })
    .optional(),
  plan: z
    .object({
      tier: z.enum(['basic', 'standard', 'premium']),
      billingPeriod: z.enum(['monthly', 'yearly']),
    })
    .optional(),
  source: z
    .object({
      page: z.string().max(500).optional(),
      previewedVariants: z.array(z.string()).max(50).optional(),
      utm: z
        .object({
          source: z.string().max(200).optional(),
          medium: z.string().max(200).optional(),
          campaign: z.string().max(200).optional(),
          term: z.string().max(200).optional(),
          content: z.string().max(200).optional(),
        })
        .optional(),
    })
    .optional(),
}

export type SelectionV1 = z.output<z.ZodObject<typeof shape>>

/** The selection as submitted, checked against what is on sale. */
function createSelectionSchema(catalog: Catalog) {
  return z.strictObject(shape).superRefine((s, ctx) => {
    const theme = catalog.find((t) => t.name === s.theme.name)
    if (!theme) {
      ctx.addIssue({ code: 'custom', path: ['theme', 'name'], message: 'Unknown theme.' })
      return
    }
    if (!theme.variants.some((v) => v.value === s.theme.variant)) {
      ctx.addIssue({ code: 'custom', path: ['theme', 'variant'], message: 'Unknown colourway.' })
    }
    const seen = new Set<string>()
    s.sections.home.forEach((id, i) => {
      if (!theme.homeSections.includes(id) || seen.has(id)) {
        ctx.addIssue({ code: 'custom', path: ['sections', 'home', i], message: 'Invalid section.' })
      }
      seen.add(id)
    })
  })
}

/** The whole lead: who is asking, their consent, and what they configured. */
export function createLeadSchema(catalog: Catalog) {
  return z.strictObject({
    contact: z.strictObject({
      name: z.string().trim().min(2).max(120),
      email: z.email().max(254),
      phone: z.string().trim().max(40).optional(),
    }),
    company: z
      .strictObject({
        ico: z
          .string()
          .trim()
          .regex(/^\d{8}$/)
          .optional(),
        name: z.string().trim().max(200).optional(),
      })
      .optional(),
    portfolioSize: z.enum(PORTFOLIO_SIZES).optional(),
    consent: z.strictObject({ given: z.literal(true), text: z.string().trim().min(20).max(4000) }),
    selection: createSelectionSchema(catalog),
    /** Honeypot. Humans never see it; a non-empty value is a bot. */
    website: z.string().max(0).optional(),
  })
}
