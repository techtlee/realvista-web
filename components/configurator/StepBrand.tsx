import { TONE_LABELS, TONES, type Draft, type Tone } from '@/lib/draft'

export function StepBrand({
  draft,
  errors,
  onBrand,
  onTone,
}: {
  draft: Draft
  errors: Partial<Record<'brand.name' | 'brand.tagline', string>>
  onBrand: (patch: Partial<Draft['brand']>) => void
  onTone: (tone: Tone) => void
}) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Field label="Název kanceláře nebo vaše jméno" error={errors['brand.name']} htmlFor="brand-name">
          <input
            id="brand-name"
            value={draft.brand.name}
            onChange={(e) => onBrand({ name: e.target.value })}
            maxLength={120}
            placeholder="např. Novák Reality"
            autoComplete="organization"
            aria-invalid={Boolean(errors['brand.name'])}
            className="input"
          />
        </Field>
        <Field
          label="Slogan"
          optional
          htmlFor="brand-tagline"
          error={errors['brand.tagline']}
          aside={`${draft.brand.tagline.length}/160`}
        >
          <input
            id="brand-tagline"
            value={draft.brand.tagline}
            onChange={(e) => onBrand({ tagline: e.target.value })}
            maxLength={160}
            placeholder="např. Prodáváme domovy, ne nemovitosti"
            className="input"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Jak má web mluvit?</legend>
        <p className="mb-3 text-xs text-ink-soft">Podle toho připravíme úvodní texty. Všechno pak můžete upravit.</p>
        <div className="grid gap-3">
          {TONES.map((t) => {
            const active = draft.content.tone === t
            return (
              <label
                key={t}
                className={`cursor-pointer rounded-xl border-2 bg-white px-4 py-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                  active ? 'border-ink' : 'border-line hover:border-ink-soft'
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={t}
                  checked={active}
                  onChange={() => onTone(t)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold">{TONE_LABELS[t].label}</span>
                <span className="mt-0.5 block text-sm italic text-ink-soft">„{TONE_LABELS[t].example}“</span>
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  error,
  optional,
  aside,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  optional?: boolean
  aside?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
          {optional && <span className="font-normal text-ink-soft"> (nepovinné)</span>}
        </label>
        {aside && <span className="text-xs tabular-nums text-ink-soft">{aside}</span>}
      </div>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
