import type { Catalog } from '@makleri/selection'

import type { Draft } from '@/lib/draft'

import { Wireframe } from './Wireframe'

export function StepTheme({
  catalog,
  draft,
  onTheme,
  onVariant,
}: {
  catalog: Catalog
  draft: Draft
  onTheme: (name: string) => void
  onVariant: (value: string) => void
}) {
  const theme = catalog.find((t) => t.name === draft.theme.name) ?? catalog[0]

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Šablona</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {catalog.map((t) => {
            const active = t.name === draft.theme.name
            const color = (active ? t.variants.find((v) => v.value === draft.theme.variant) : t.variants[0])?.swatch
            return (
              <label
                key={t.name}
                className={`group cursor-pointer overflow-hidden rounded-xl border-2 bg-white transition ${
                  active ? 'border-ink' : 'border-line hover:border-ink-soft'
                }`}
              >
                <input
                  type="radio"
                  name="theme"
                  value={t.name}
                  checked={active}
                  onChange={() => onTheme(t.name)}
                  className="sr-only"
                />
                <div className="pointer-events-none h-36 overflow-hidden border-b border-line" aria-hidden>
                  <Wireframe sections={t.homeSections.slice(0, 3)} color={color ?? '#222'} brand={t.label} compact />
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="font-semibold tracking-wide">{t.label}</span>
                  <span className="text-xs text-ink-soft">{t.variants.length} barevné varianty</span>
                </div>
              </label>
            )
          })}
          <div className="flex min-h-[12rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-line p-4 text-center text-sm text-ink-soft">
            <span className="text-2xl" aria-hidden>
              +
            </span>
            Další šablony připravujeme
          </div>
        </div>
      </fieldset>

      {theme && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Barevná varianta</legend>
          <div className="flex flex-wrap gap-3">
            {theme.variants.map((v) => {
              const active = v.value === draft.theme.variant
              return (
                <label
                  key={v.value}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-full border-2 py-1.5 pl-1.5 pr-4 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    active ? 'border-ink bg-white font-medium' : 'border-line bg-white/60 hover:border-ink-soft'
                  }`}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v.value}
                    checked={active}
                    onChange={() => onVariant(v.value)}
                    className="sr-only"
                  />
                  <span
                    className="h-7 w-7 rounded-full ring-1 ring-black/10"
                    style={{ background: v.swatch ?? '#ccc' }}
                    aria-hidden
                  />
                  {v.label}
                </label>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
