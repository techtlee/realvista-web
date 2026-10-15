'use client'

import { createIntakeRequestSchema, type Catalog } from '@makleri/selection'
import { useEffect, useMemo, useRef, useState } from 'react'

import { CONSENT_TEXT } from '@/lib/consent'
import {
  decodeDraft,
  DRAFT_PARAM,
  DRAFT_STORAGE_KEY,
  encodeDraft,
  initialDraft,
  normalizeDraft,
  toSelection,
  withBlogConsistency,
  type Draft,
  type SourceFacts,
} from '@/lib/draft'
import { mapIssue, STEP, type FieldKey, type StepIndex } from '@/lib/issues'

import { Preview } from './Preview'
import { StepBrand } from './StepBrand'
import { StepSections } from './StepSections'
import { EMPTY_CONTACT, StepSubmit, type ContactForm } from './StepSubmit'
import { StepTheme } from './StepTheme'

const STEPS = [
  { title: 'Šablona a barvy', short: 'Vzhled' },
  { title: 'Funkce a sekce', short: 'Sekce' },
  { title: 'Značka a tón', short: 'Značka' },
  { title: 'Odeslat poptávku', short: 'Odeslat' },
] as const

type Errors = Partial<Record<FieldKey, string>>

export function Configurator({ catalog }: { catalog: Catalog }) {
  const firstTheme = catalog[0]!
  const [draft, setDraftState] = useState<Draft>(() => initialDraft(firstTheme))
  const [step, setStep] = useState<StepIndex>(STEP.theme)
  const [contact, setContact] = useState<ContactForm>(EMPTY_CONTACT)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [restored, setRestored] = useState(false)
  // Nothing is saved until the saved draft has been read back. Otherwise the
  // first save writes the defaults over the very link being opened.
  const [hydrated, setHydrated] = useState(false)
  const previewed = useRef(new Set<string>())
  const landing = useRef<{ page: string; utm: SourceFacts['utm'] }>({ page: '/', utm: {} })
  const panelRef = useRef<HTMLDivElement>(null)

  const theme = catalog.find((t) => t.name === draft.theme.name) ?? firstTheme
  const swatch = theme.variants.find((v) => v.value === draft.theme.variant)?.swatch ?? '#222'

  // Restore: a shared link wins over this browser's saved draft.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    landing.current = {
      page: window.location.pathname,
      utm: {
        source: params.get('utm_source') ?? undefined,
        medium: params.get('utm_medium') ?? undefined,
        campaign: params.get('utm_campaign') ?? undefined,
        term: params.get('utm_term') ?? undefined,
        content: params.get('utm_content') ?? undefined,
      },
    }

    const fromUrl = params.get(DRAFT_PARAM)
    let saved: unknown = null
    if (fromUrl) saved = decodeDraft(fromUrl)
    if (!saved) {
      try {
        const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
        saved = raw ? JSON.parse(raw) : null
      } catch {
        saved = null
      }
    }
    const next = normalizeDraft(saved, catalog)
    if (next) {
      setDraftState(next)
      setRestored(true)
    }
    setHydrated(true)
  }, [catalog])

  // Persist every change to the URL (shareable) and this browser (survives a closed tab).
  useEffect(() => {
    if (!hydrated) return
    previewed.current.add(draft.theme.variant)
    const url = new URL(window.location.href)
    url.searchParams.set(DRAFT_PARAM, encodeDraft(draft))
    window.history.replaceState(null, '', url)
    try {
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      // Private mode or blocked storage: the URL still carries the draft.
    }
  }, [draft, hydrated])

  function setDraft(update: (d: Draft) => Draft) {
    setDraftState((d) => withBlogConsistency(update(d)))
  }

  function setModule(key: keyof Draft['modules'], value: boolean) {
    setDraft((d) => {
      const modules = { ...d.modules, [key]: value }
      // Turning the blog back on brings its section back, at the end.
      const home =
        key === 'blog' && value && !d.sections.home.includes('blog') && theme.homeSections.includes('blog')
          ? [...d.sections.home, 'blog']
          : d.sections.home
      return { ...d, modules, sections: { home } }
    })
  }

  const schema = useMemo(() => createIntakeRequestSchema(catalog), [catalog])

  function buildBody() {
    const selection = toSelection(draft, {
      page: landing.current.page,
      previewedVariants: [...previewed.current],
      utm: landing.current.utm,
    })
    const ico = contact.ico.trim()
    const companyName = contact.companyName.trim()
    return {
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        ...(contact.phone.trim() ? { phone: contact.phone.trim() } : {}),
      },
      ...(ico || companyName ? { company: { ...(ico ? { ico } : {}), ...(companyName ? { name: companyName } : {}) } } : {}),
      ...(contact.portfolioSize ? { portfolioSize: contact.portfolioSize } : {}),
      // `given` is only ever sent as true; unticked, the key is left out so
      // the schema reports it missing rather than "false is not true".
      consent: contact.consent ? { given: true, text: CONSENT_TEXT } : undefined,
      selection,
      ...(contact.website ? { website: contact.website } : {}),
    }
  }

  function applyIssues(issues: readonly { path?: readonly PropertyKey[] }[]): boolean {
    const mapped = issues.map(mapIssue).filter((m) => m !== null)
    if (mapped.length === 0) return false
    const next: Errors = {}
    for (const m of mapped) next[m.field] ??= m.message
    setErrors(next)
    const first = Math.min(...mapped.map((m) => m.step)) as StepIndex
    goTo(first)
    return true
  }

  async function submit() {
    setErrors({})
    const body = buildBody()

    const local = schema.safeParse(body)
    if (!local.success && applyIssues(local.error.issues)) return

    setStatus('sending')
    try {
      const res = await fetch('/api/poptavka-webu', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setStatus('sent')
        try {
          window.localStorage.removeItem(DRAFT_STORAGE_KEY)
        } catch {}
        return
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; issues?: unknown }
      setStatus('idle')
      if (Array.isArray(data.issues) && applyIssues(data.issues)) return
      setErrors({
        form:
          res.status === 429
            ? 'Odeslali jste příliš mnoho poptávek. Zkuste to prosím za chvíli.'
            : 'Poptávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište e-mail.',
      })
    } catch {
      setStatus('idle')
      setErrors({ form: 'Nepodařilo se spojit se serverem. Zkontrolujte připojení a zkuste to znovu.' })
    }
  }

  function goTo(next: StepIndex) {
    setStep(next)
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function next() {
    if (step === STEP.brand && !draft.brand.name.trim()) {
      setErrors({ 'brand.name': 'Vyplňte název kanceláře nebo své jméno.' })
      return
    }
    setErrors({})
    if (step < STEP.submit) goTo((step + 1) as StepIndex)
  }

  if (status === 'sent') {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center sm:p-12">
        <div
          className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full text-2xl text-white"
          style={{ background: swatch }}
          aria-hidden
        >
          ✓
        </div>
        <h3 className="font-display text-2xl font-semibold">Děkujeme, poptávku máme</h3>
        <p className="mt-3 text-ink-soft">
          Konfiguraci webu <strong className="text-ink">{draft.brand.name}</strong> jsme si uložili. Do jednoho
          pracovního dne se vám ozveme na <strong className="text-ink">{contact.email}</strong>.
        </p>
      </div>
    )
  }

  return (
    <div ref={panelRef} className="grid scroll-mt-6 gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-10">
      <div className="min-w-0">
        <nav aria-label="Kroky konfigurace" className="mb-6">
          <ol className="grid grid-cols-4 gap-1.5">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => (i <= step ? goTo(i as StepIndex) : next())}
                  aria-current={i === step ? 'step' : undefined}
                  className="group w-full text-left"
                >
                  <span
                    className={`block h-1 rounded-full transition ${i <= step ? 'bg-ink' : 'bg-line'}`}
                    aria-hidden
                  />
                  <span
                    className={`mt-2 block truncate text-xs ${i === step ? 'font-semibold text-ink' : 'text-ink-soft'}`}
                  >
                    {i + 1}. {s.short}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <h3 className="mb-5 font-display text-2xl font-semibold">{STEPS[step].title}</h3>

        {restored && step === STEP.theme && (
          <p className="mb-5 rounded-lg bg-accent/10 px-3 py-2 text-sm">
            Pokračujete v rozpracované konfiguraci.{' '}
            <button
              type="button"
              className="font-medium underline underline-offset-2"
              onClick={() => {
                setDraftState(initialDraft(firstTheme))
                setRestored(false)
              }}
            >
              Začít znovu
            </button>
          </p>
        )}

        {/* Mobile: the preview collapses — a phone cannot show both. */}
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setPreviewOpen((o) => !o)}
            aria-expanded={previewOpen}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium"
          >
            <span className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: swatch }} aria-hidden />
            {previewOpen ? 'Skrýt náhled' : 'Zobrazit náhled webu'}
            <span className="ml-auto text-ink-soft" aria-hidden>
              {previewOpen ? '▴' : '▾'}
            </span>
          </button>
          {previewOpen && (
            <div className="mt-3 h-[28rem]">
              <Preview draft={draft} swatch={swatch} />
            </div>
          )}
        </div>

        {step === STEP.theme && (
          <StepTheme
            catalog={catalog}
            draft={draft}
            onTheme={(name) => {
              const t = catalog.find((c) => c.name === name)
              if (t && t.name !== draft.theme.name) setDraft((d) => ({ ...initialDraft(t), brand: d.brand, content: d.content }))
            }}
            onVariant={(value) => setDraft((d) => ({ ...d, theme: { ...d.theme, variant: value } }))}
          />
        )}
        {step === STEP.sections && (
          <StepSections
            draft={draft}
            available={theme.homeSections}
            onModule={setModule}
            onSections={(home) => setDraft((d) => ({ ...d, sections: { home } }))}
          />
        )}
        {step === STEP.brand && (
          <StepBrand
            draft={draft}
            errors={errors}
            onBrand={(patch) => setDraft((d) => ({ ...d, brand: { ...d.brand, ...patch } }))}
            onTone={(tone) => setDraft((d) => ({ ...d, content: { tone } }))}
          />
        )}
        {step === STEP.submit && (
          <StepSubmit form={contact} errors={errors} onChange={(patch) => setContact((c) => ({ ...c, ...patch }))} />
        )}

        {errors.form && (
          <p className="mt-5 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger" role="alert">
            {errors.form}
          </p>
        )}

        <div className="mt-8 flex items-center gap-3">
          {step > STEP.theme && (
            <button type="button" onClick={() => goTo((step - 1) as StepIndex)} className="btn-ghost">
              Zpět
            </button>
          )}
          {step < STEP.submit ? (
            <button type="button" onClick={next} className="btn-primary ml-auto">
              Pokračovat
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={status === 'sending'}
              className="btn-primary ml-auto disabled:opacity-60"
            >
              {status === 'sending' ? 'Odesílám…' : 'Odeslat poptávku'}
            </button>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-6 h-[min(44rem,calc(100vh-3rem))]">
          <Preview draft={draft} swatch={swatch} />
        </div>
      </div>
    </div>
  )
}
