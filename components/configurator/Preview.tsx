'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Draft } from '@/lib/draft'
import { MSG_READY, MSG_VARIANT, previewOrigin, previewSrc } from '@/lib/preview'

import { Wireframe } from './Wireframe'

type Device = 'desktop' | 'mobile'

const DEVICE_WIDTH: Record<Device, number> = { desktop: 1280, mobile: 390 }

/** How long to wait for the preview's `ready` before showing the wireframe. */
const READY_TIMEOUT_MS = 4000

/**
 * The real site, in an iframe, scaled to fit.
 *
 * Two update speeds: the colourway goes by postMessage and repaints
 * instantly; sections and modules change the src (debounced) because the
 * theme renders them on the server.
 */
export function Preview({ draft, swatch }: { draft: Draft; swatch: string }) {
  const [device, setDevice] = useState<Device>('desktop')
  const frameRef = useRef<HTMLIFrameElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [boxWidth, setBoxWidth] = useState(0)
  const [state, setState] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  const origin = previewOrigin()
  const variantRef = useRef(draft.theme.variant)
  variantRef.current = draft.theme.variant

  // Structural key: only these reload the frame.
  const structure = JSON.stringify([draft.sections.home, draft.modules])
  const [src, setSrc] = useState(() => previewSrc(draft, draft.theme.variant))

  useEffect(() => {
    const t = setTimeout(() => setSrc(previewSrc(draft, variantRef.current)), 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `structure` is the dependency
  }, [structure])

  // Wait for the first ready signal; if it never comes, settle on the
  // wireframe. Once the preview has proven itself, a reload after a section
  // change keeps showing the frame — swapping to the wireframe and back for a
  // 300 ms reload would flash on every click.
  useEffect(() => {
    if (!src) {
      setState('unavailable')
      return
    }
    const t = setTimeout(() => setState((s) => (s === 'ready' ? s : 'unavailable')), READY_TIMEOUT_MS)
    return () => clearTimeout(t)
  }, [src])

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!origin || event.origin !== origin) return
      if (event.source !== frameRef.current?.contentWindow) return
      if ((event.data as { type?: string })?.type !== MSG_READY) return
      setState('ready')
      post(variantRef.current)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin])

  useEffect(() => {
    if (state === 'ready') post(draft.theme.variant)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.theme.variant, state])

  function post(value: string) {
    if (!origin) return
    frameRef.current?.contentWindow?.postMessage({ type: MSG_VARIANT, value }, origin)
  }

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setBoxWidth(entry?.contentRect.width ?? 0))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const frameWidth = DEVICE_WIDTH[device]
  const scale = useMemo(() => (boxWidth ? Math.min(1, boxWidth / frameWidth) : 0), [boxWidth, frameWidth])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-30px_rgba(20,20,40,0.35)]">
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
          <i className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md bg-neutral-100 px-3 py-1 text-xs text-ink-soft">
          {domainHint(draft.brand.name)}
        </span>
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

      <div ref={boxRef} className="relative flex-1 overflow-hidden bg-neutral-50">
        {src && scale > 0 && (
          <div
            className="absolute left-1/2 top-0 origin-top transition-opacity duration-300"
            style={{
              width: frameWidth,
              height: `calc(100% / ${scale})`,
              transform: `translateX(-50%) scale(${scale})`,
              opacity: state === 'ready' ? 1 : 0,
            }}
          >
            <iframe
              ref={frameRef}
              src={src}
              title="Náhled vašeho webu"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin"
              loading="lazy"
            />
          </div>
        )}

        {state !== 'ready' && (
          <div className="absolute inset-0 flex justify-center p-3">
            <div className={`h-full w-full ${device === 'mobile' ? 'max-w-[260px]' : ''}`}>
              <Wireframe
                sections={draft.sections.home}
                color={swatch}
                brand={draft.brand.name}
                tagline={draft.brand.tagline}
                compact={device === 'mobile'}
              />
            </div>
          </div>
        )}

        {state === 'unavailable' && (
          <p className="absolute inset-x-0 bottom-0 bg-white/90 px-4 py-2 text-center text-xs text-ink-soft backdrop-blur">
            Zjednodušený náhled. Skutečný web se zobrazí, jakmile bude náhledový server k dispozici.
          </p>
        )}
      </div>
    </div>
  )
}

function domainHint(brand: string): string {
  const slug = brand
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 30)
  return `${slug || 'vasekancelar'}.cz`
}
