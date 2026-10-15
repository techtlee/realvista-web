import type { Catalog } from '@/lib/catalog'
import { TONE_LABELS, type Draft } from '@/lib/draft'
import { STEP, type StepIndex } from '@/lib/issues'
import { sectionLabel } from '@/lib/sections'

const MODULE_LABELS: Record<keyof Draft['modules'], string> = {
  blog: 'Blog',
  listingMap: 'Mapa nemovitostí',
  mortgageCalculator: 'Hypoteční kalkulačka',
}

/** "Váš výběr": the configuration in words, with a way back to each part. */
export function Summary({ draft, catalog, onEdit }: { draft: Draft; catalog: Catalog; onEdit: (step: StepIndex) => void }) {
  const theme = catalog.find((t) => t.name === draft.theme.name)
  const variant = theme?.variants.find((v) => v.value === draft.theme.variant)
  const modules = (Object.keys(MODULE_LABELS) as (keyof Draft['modules'])[]).filter((k) => draft.modules[k])

  const rows: { label: string; value: React.ReactNode; step: StepIndex }[] = [
    {
      label: 'Vzhled',
      step: STEP.theme,
      value: (
        <span className="inline-flex items-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: variant?.swatch }} aria-hidden />
          {theme?.label} · {variant?.label}
        </span>
      ),
    },
    {
      label: 'Funkce',
      step: STEP.sections,
      value: modules.length ? modules.map((m) => MODULE_LABELS[m]).join(', ') : 'Žádné doplňkové funkce',
    },
    { label: 'Úvodní stránka', step: STEP.sections, value: draft.sections.home.map(sectionLabel).join(' → ') },
    {
      label: 'Značka',
      step: STEP.brand,
      value: (
        <>
          {draft.brand.name}
          {draft.brand.tagline && <span className="block text-ink-soft">„{draft.brand.tagline}“</span>}
        </>
      ),
    },
    { label: 'Tón textů', step: STEP.brand, value: TONE_LABELS[draft.content.tone].label },
  ]

  return (
    <div className="rounded-xl border border-line bg-white">
      <p className="border-b border-line px-4 py-3 text-sm font-semibold">Váš výběr</p>
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="flex gap-3 px-4 py-3 text-sm">
            <dt className="w-28 shrink-0 text-ink-soft">{r.label}</dt>
            <dd className="min-w-0 flex-1">{r.value}</dd>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="shrink-0 self-start text-xs font-medium underline underline-offset-2 hover:text-accent"
            >
              Upravit
            </button>
          </div>
        ))}
      </dl>
    </div>
  )
}
