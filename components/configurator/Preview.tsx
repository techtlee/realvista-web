'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { slug } from '@/components/mock/Home'
import { MockSite } from '@/components/mock/MockSite'
import { routePath, type MockRoute, type Navigate } from '@/components/mock/types'
import type { Draft } from '@/lib/draft'

type Device = 'desktop' | 'mobile'

/** Logical widths the mock is laid out at, then scaled to fit the panel. */
// 1024 rather than 1280: still the desktop layout (it breaks at 768), but the
// mock scales down less, so its text stays readable in a half-width panel.
const DEVICE_WIDTH: Record<Device, number> = { desktop: 1024, mobile: 390 }

/**
 * Where the preview should show the effect of the realtor's last action:
 * the section they just moved, the page a module they just toggled lives on.
 * `n` changes on every action so the same target can be shown twice.
 */
export interface PreviewFocus {
  route?: MockRoute
  section?: string
  n: number
}

export function Preview({
  draft,
  swatch,
  focus,
  initialDevice = 'desktop',
}: {
  draft: Draft
  swatch: string
  focus: PreviewFocus | null
  initialDevice?: Device
}) {
  const [device, setDevice] = useState<Device>(initialDevice)
  const [route, setRoute] = useState<MockRoute>({ page: 'home' })
  const [highlight, setHighlight] = useState<string | null>(null)
  const [pending, setPending] = useState<{ section?: string; n: number } | null>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const navigate: Navigate = useCallback((r, section) => {
    setRoute(r)
    setPending({ section, n: Date.now() })
  }, [])

  // After the page renders: scroll to the section asked for, or to the top.
  useEffect(() => {
    if (!pending) return
    const frame = requestAnimationFrame(() => {
      const scroller = scrollRef.current
      if (!scroller) return
      const el = pending.section
        ? scroller.querySelector<HTMLElement>(`[data-mock-section="${pending.section}"]`)
        : null
      if (!el) {
        scroller.scrollTo({ top: 0 })
        return
      }
      // Rects are in scaled screen pixels; scrollTop is in the mock's own.
      const scale = scroller.getBoundingClientRect().width / scroller.offsetWidth || 1
      const top = (el.getBoundingClientRect().top - scroller.getBoundingClientRect().top) / scale + scroller.scrollTop
      scroller.scrollTo({ top: Math.max(0, top - 72), behavior: 'smooth' })
      setHighlight(pending.section ?? null)
    })
    return () => cancelAnimationFrame(frame)
  }, [pending])

  useEffect(() => {
    if (!highlight) return
    const t = setTimeout(() => setHighlight(null), 1400)
    return () => clearTimeout(t)
  }, [highlight])

  // Follow the realtor's actions in the configurator.
  useEffect(() => {
    if (focus) navigate(focus.route ?? { page: 'home' }, focus.section)
  }, [focus, navigate])

  // A page whose module was switched off no longer exists.
  useEffect(() => {
    if (!draft.modules.blog && (route.page === 'blog' || route.page === 'post')) navigate({ page: 'home' })
  }, [draft.modules.blog, route.page, navigate])

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setBox({ w: entry.contentRect.width, h: entry.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const frameWidth = DEVICE_WIDTH[device]
  const scale = box.w ? Math.min(1, box.w / frameWidth) : 0

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-30px_rgba(20,20,40,0.35)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="hidden gap-1.5 sm:flex" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        </span>
        <button
          type="button"
          onClick={() => navigate({ page: 'home' })}
          className="min-w-0 flex-1 truncate rounded-md bg-neutral-100 px-3 py-1 text-left text-xs text-ink-soft"
          title="Zpět na úvodní stránku"
        >
          {slug(draft.brand.name)}.cz<span className="text-ink">{routePath(route) === '/' ? '' : routePath(route)}</span>
        </button>
        <div role="radiogroup" aria-label="Zařízení" className="flex rounded-md bg-neutral-100 p-0.5 text-xs">
          {(['desktop', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              role="radio"
              aria-checked={device === d}
              onClick={() => setDevice(d)}
              className={`rounded px-2.5 py-1 transition ${device === d ? 'bg-white font-medium shadow-sm' : 'text-ink-soft'}`}
            >
              {d === 'desktop' ? 'Počítač' : 'Mobil'}
            </button>
          ))}
        </div>
      </div>

      <div ref={boxRef} className={`relative flex-1 overflow-hidden ${device === 'mobile' ? 'bg-neutral-100' : 'bg-white'}`}>
        {scale > 0 && (
          <div
            ref={scrollRef}
            data-mock-scroller
            className={`absolute top-0 overflow-y-auto overscroll-contain ${
              device === 'mobile' ? 'border-x border-neutral-200 shadow-xl' : ''
            }`}
            style={{
              width: frameWidth,
              height: box.h / scale,
              left: Math.max(0, (box.w - frameWidth * scale) / 2),
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <MockSite draft={draft} swatch={swatch} route={route} highlight={highlight} navigate={navigate} />
          </div>
        )}
      </div>
      <p className="border-t border-line px-4 py-2 text-center text-[11px] text-ink-soft">
        Ukázka s ilustračními nemovitostmi — klikejte, web funguje.
      </p>
    </div>
  )
}
