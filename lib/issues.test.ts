import { describe, expect, it } from 'vitest'

import { mapIssue, STEP } from './issues'

describe('mapIssue', () => {
  it.each([
    [['contact', 'email'], STEP.submit, 'contact.email'],
    [['consent'], STEP.submit, 'consent'],
    [['company', 'ico'], STEP.submit, 'company.ico'],
    [['selection', 'brand', 'name'], STEP.brand, 'brand.name'],
    [['selection', 'theme', 'variant'], STEP.theme, 'form'],
    [['selection', 'sections', 'home', 2], STEP.sections, 'form'],
  ] as const)('%j → step %i, field %s', (path, step, field) => {
    expect(mapIssue({ path })).toMatchObject({ step, field })
  })

  it('answers in Czech, not zod English', () => {
    expect(mapIssue({ path: ['contact', 'email'] })?.message).toBe('Zadejte platný e-mail.')
  })

  it('falls back to a general message for unknown paths', () => {
    expect(mapIssue({ path: ['something', 'new'] })).toMatchObject({ step: STEP.submit, field: 'form' })
  })
})
