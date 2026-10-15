import { CONSENT_TEXT } from '@/lib/consent'
import type { FieldKey } from '@/lib/issues'
import { PORTFOLIO_SIZES } from '@/lib/selection'

import { Field } from './StepBrand'

export interface ContactForm {
  name: string
  email: string
  phone: string
  ico: string
  companyName: string
  portfolioSize: '' | (typeof PORTFOLIO_SIZES)[number]
  consent: boolean
  /** Honeypot. */
  website: string
}

export const EMPTY_CONTACT: ContactForm = {
  name: '',
  email: '',
  phone: '',
  ico: '',
  companyName: '',
  portfolioSize: '',
  consent: false,
  website: '',
}

export function StepSubmit({
  form,
  errors,
  onChange,
}: {
  form: ContactForm
  errors: Partial<Record<FieldKey, string>>
  onChange: (patch: Partial<ContactForm>) => void
}) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-soft">
        Ozveme se vám do jednoho pracovního dne, projdeme spolu konfiguraci a domluvíme doménu. Odesláním se k
        ničemu nezavazujete.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Jméno a příjmení" htmlFor="c-name" error={errors['contact.name']}>
            <input
              id="c-name"
              className="input"
              autoComplete="name"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
              aria-invalid={Boolean(errors['contact.name'])}
            />
          </Field>
        </div>
        <Field label="E-mail" htmlFor="c-email" error={errors['contact.email']}>
          <input
            id="c-email"
            type="email"
            className="input"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            aria-invalid={Boolean(errors['contact.email'])}
          />
        </Field>
        <Field label="Telefon" optional htmlFor="c-phone" error={errors['contact.phone']}>
          <input
            id="c-phone"
            type="tel"
            className="input"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
        </Field>
        <Field label="IČO" optional htmlFor="c-ico" error={errors['company.ico']}>
          <input
            id="c-ico"
            className="input"
            inputMode="numeric"
            maxLength={8}
            value={form.ico}
            onChange={(e) => onChange({ ico: e.target.value.replace(/\D/g, '') })}
            aria-invalid={Boolean(errors['company.ico'])}
          />
        </Field>
        <Field label="Název firmy" optional htmlFor="c-company" error={errors['company.name']}>
          <input
            id="c-company"
            className="input"
            autoComplete="organization"
            value={form.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">
          Kolik nemovitostí obvykle nabízíte? <span className="font-normal text-ink-soft">(nepovinné)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {PORTFOLIO_SIZES.map((size) => (
            <label
              key={size}
              className={`cursor-pointer rounded-full border-2 px-4 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                form.portfolioSize === size ? 'border-ink bg-white font-medium' : 'border-line bg-white/60'
              }`}
            >
              <input
                type="radio"
                name="portfolio"
                className="sr-only"
                checked={form.portfolioSize === size}
                onChange={() => onChange({ portfolioSize: size })}
              />
              {size.replace('-', '–')}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Honeypot: off-screen, out of the tab order, ignored by autofill. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Web
          <input
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={form.website}
            onChange={(e) => onChange({ website: e.target.value })}
          />
        </label>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-ink)]"
            aria-invalid={Boolean(errors.consent)}
          />
          <span className="text-ink-soft">{CONSENT_TEXT}</span>
        </label>
        {errors.consent && (
          <p className="mt-1.5 text-sm text-danger" role="alert">
            {errors.consent}
          </p>
        )}
      </div>
    </div>
  )
}
