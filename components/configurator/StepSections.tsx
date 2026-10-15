'use client'

import { useState } from 'react'

import type { Draft } from '@/lib/draft'
import { sectionHint, sectionLabel } from '@/lib/sections'

type Modules = Draft['modules']

const MODULES: { key: keyof Modules; label: string; hint: string }[] = [
  { key: 'blog', label: 'Blog', hint: 'Články, které vám přivedou návštěvníky z vyhledávačů' },
  { key: 'listingMap', label: 'Mapa nemovitostí', hint: 'Nabídky na mapě u výpisu i detailu' },
  { key: 'mortgageCalculator', label: 'Hypoteční kalkulačka', hint: 'Orientační splátka přímo u nemovitosti' },
]

export function StepSections({
  draft,
  available,
  onModule,
  onSections,
}: {
  draft: Draft
  /** Every home section the theme offers, in its default order. */
  available: string[]
  onModule: (key: keyof Modules, value: boolean) => void
  onSections: (home: string[]) => void
}) {
  const visible = draft.sections.home
  const hidden = available.filter((s) => !visible.includes(s) && (s !== 'blog' || draft.modules.blog))
  const [dragging, setDragging] = useState<string | null>(null)
  const [announce, setAnnounce] = useState('')

  function move(id: string, by: -1 | 1) {
    const i = visible.indexOf(id)
    const j = i + by
    if (i < 0 || j < 0 || j >= visible.length) return
    const next = [...visible]
    ;[next[i], next[j]] = [next[j] as string, next[i] as string]
    onSections(next)
    setAnnounce(`${sectionLabel(id)}: pozice ${j + 1} z ${visible.length}`)
  }

  function hide(id: string) {
    if (visible.length <= 1) return
    onSections(visible.filter((s) => s !== id))
    setAnnounce(`${sectionLabel(id)} skryto`)
  }

  function show(id: string) {
    onSections([...visible, id])
    setAnnounce(`${sectionLabel(id)} přidáno na konec`)
  }

  function dropOn(target: string) {
    if (!dragging || dragging === target) return
    // The target's index in the list *before* removal: dragging down, that
    // lands after the target; dragging up, before it. Using the post-removal
    // index would always insert above, and downward drags would never move.
    const to = visible.indexOf(target)
    const next = visible.filter((s) => s !== dragging)
    next.splice(to, 0, dragging)
    onSections(next)
  }

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Funkce webu</legend>
        <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {MODULES.map((m) => {
            const on = draft.modules[m.key]
            return (
              <label key={m.key} className="flex cursor-pointer items-center gap-4 px-4 py-3">
                <span className="flex-1">
                  <span className="block text-sm font-medium">{m.label}</span>
                  <span className="block text-xs text-ink-soft">{m.hint}</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={on}
                  onChange={(e) => onModule(m.key, e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className={`relative h-6 w-11 shrink-0 rounded-full transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
                    on ? 'bg-ink' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`}
                  />
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Sekce na úvodní stránce</legend>
        <p className="mb-3 text-xs text-ink-soft">Přetáhněte nebo použijte šipky. Pořadí se hned projeví v náhledu.</p>
        <ol className="space-y-2">
          {visible.map((id, i) => (
            <li
              key={id}
              draggable
              onDragStart={() => setDragging(id)}
              onDragEnd={() => setDragging(null)}
              onDragOver={(e) => {
                e.preventDefault()
                dropOn(id)
              }}
              className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition ${
                dragging === id ? 'border-ink opacity-60' : 'border-line'
              }`}
            >
              <span className="cursor-grab select-none text-ink-soft" aria-hidden>
                ⋮⋮
              </span>
              <span className="w-5 text-center text-xs tabular-nums text-ink-soft">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{sectionLabel(id)}</span>
                {sectionHint(id) && <span className="block truncate text-xs text-ink-soft">{sectionHint(id)}</span>}
              </span>
              <span className="flex gap-1">
                <IconButton label={`Posunout ${sectionLabel(id)} nahoru`} disabled={i === 0} onClick={() => move(id, -1)}>
                  ↑
                </IconButton>
                <IconButton
                  label={`Posunout ${sectionLabel(id)} dolů`}
                  disabled={i === visible.length - 1}
                  onClick={() => move(id, 1)}
                >
                  ↓
                </IconButton>
                <IconButton label={`Skrýt ${sectionLabel(id)}`} disabled={visible.length <= 1} onClick={() => hide(id)}>
                  ✕
                </IconButton>
              </span>
            </li>
          ))}
        </ol>

        {hidden.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-ink-soft">Skryté sekce</p>
            <div className="flex flex-wrap gap-2">
              {hidden.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => show(id)}
                  className="rounded-full border border-dashed border-ink-soft/50 px-3 py-1.5 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  + {sectionLabel(id)}
                </button>
              ))}
            </div>
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </fieldset>
    </div>
  )
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-lg text-sm text-ink-soft transition hover:bg-neutral-100 hover:text-ink disabled:opacity-25 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}
