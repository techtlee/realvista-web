/**
 * Validation issues → the step and field to show them on, in Czech.
 *
 * The same schema runs in the browser and in the CMS, so issues from either
 * side carry the same paths. Zod's own messages are English and generic; the
 * realtor gets these instead.
 */
export const STEP = { theme: 0, sections: 1, brand: 2, submit: 3 } as const
export type StepIndex = (typeof STEP)[keyof typeof STEP]

export type FieldKey =
  | 'contact.name'
  | 'contact.email'
  | 'contact.phone'
  | 'company.ico'
  | 'company.name'
  | 'portfolioSize'
  | 'consent'
  | 'brand.name'
  | 'brand.tagline'
  | 'form'

export interface MappedIssue {
  step: StepIndex
  field: FieldKey
  message: string
}

interface IssueLike {
  path?: readonly PropertyKey[]
}

export function mapIssue(issue: IssueLike): MappedIssue | null {
  const p = (issue.path ?? []).map(String).join('.')

  if (p === 'website') return { step: STEP.submit, field: 'form', message: 'Odeslání se nezdařilo.' }
  if (p.startsWith('contact.name')) return at('submit', 'contact.name', 'Vyplňte jméno a příjmení.')
  if (p.startsWith('contact.email')) return at('submit', 'contact.email', 'Zadejte platný e-mail.')
  if (p.startsWith('contact.phone')) return at('submit', 'contact.phone', 'Telefon je příliš dlouhý.')
  if (p.startsWith('company.ico')) return at('submit', 'company.ico', 'IČO má 8 číslic.')
  if (p.startsWith('company.name')) return at('submit', 'company.name', 'Název firmy je příliš dlouhý.')
  if (p.startsWith('portfolioSize')) return at('submit', 'portfolioSize', 'Vyberte jednu z možností.')
  if (p.startsWith('consent')) return at('submit', 'consent', 'Bez souhlasu vám nemůžeme odpovědět.')
  if (p.startsWith('selection.brand.name')) return at('brand', 'brand.name', 'Vyplňte název kanceláře nebo své jméno.')
  if (p.startsWith('selection.brand.tagline')) return at('brand', 'brand.tagline', 'Slogan může mít nejvýše 160 znaků.')
  if (p.startsWith('selection.theme'))
    return at('theme', 'form', 'Vybraná šablona nebo barva už není v nabídce. Vyberte ji prosím znovu.')
  if (p.startsWith('selection.sections') || p.startsWith('selection.modules'))
    return at('sections', 'form', 'Zkontrolujte prosím sekce webu.')

  return at('submit', 'form', 'Zkontrolujte prosím zadané údaje.')
}

function at(step: keyof typeof STEP, field: FieldKey, message: string): MappedIssue {
  return { step: STEP[step], field, message }
}
