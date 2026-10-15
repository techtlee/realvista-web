'use client'

import { useState } from 'react'

import { formatNumber, formatPrice, type MockListing, type Penb } from '@/lib/mock-data'

import { Photo } from './Photo'
import type { Navigate } from './types'

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1120px] px-5 @3xl:px-10 ${className}`}>{children}</div>
}

export function Heading({ children, eyebrow }: { children: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 @3xl:mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mb)]">{eyebrow}</p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight @3xl:text-3xl">{children}</h2>
    </div>
  )
}

export function BrandButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center rounded-md bg-[var(--mb)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {children}
    </button>
  )
}

export function ListingCard({ listing, navigate }: { listing: MockListing; navigate: Navigate }) {
  return (
    <button
      type="button"
      onClick={() => navigate({ page: 'detail', slug: listing.slug })}
      className="group overflow-hidden rounded-lg border border-neutral-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo kind={listing.kind} seed={listing.seed} className="transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-neutral-800">
          {listing.rent ? 'Pronájem' : 'Prodej'}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold leading-snug">{listing.title}</p>
        <p className="mt-0.5 text-sm text-neutral-500">{listing.location}</p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <span className="font-semibold text-[var(--mb)]">{formatPrice(listing)}</span>
          <span className="text-xs text-neutral-500">
            {[listing.disposition, `${formatNumber(listing.area)} m²`].filter(Boolean).join(' · ')}
          </span>
        </div>
      </div>
    </button>
  )
}

const PENB_COLORS: Record<Penb, string> = {
  A: '#1a9641',
  B: '#52b151',
  C: '#a6d96a',
  D: '#f2d03b',
  E: '#fdae61',
  F: '#f46d43',
  G: '#d73027',
}

/** Legally mandatory in Czech property ads (zák. 406/2000 Sb.) — so it is in the mock too. */
export function PenbBadge({ penb }: { penb: Penb | null }) {
  if (!penb) {
    return <span className="text-sm text-neutral-500">Průkaz energetické náročnosti: nevyžaduje se</span>
  }
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span
        className="grid h-7 w-9 place-items-center rounded-sm font-bold text-white [clip-path:polygon(0_0,80%_0,100%_50%,80%_100%,0_100%)]"
        style={{ background: PENB_COLORS[penb] }}
      >
        {penb}
      </span>
      Energetická náročnost budovy
    </span>
  )
}

/** A stylised map with pins in the brand colour. No tiles, nothing external. */
export function MapPanel({ pins = 6, className = '' }: { pins?: number; className?: string }) {
  const spots = [
    [22, 30],
    [48, 22],
    [64, 48],
    [35, 62],
    [78, 28],
    [56, 74],
  ].slice(0, pins)
  return (
    <div className={`relative overflow-hidden rounded-lg border border-neutral-200 bg-[#eef1ec] ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path d="M0 70 C20 60 35 80 55 66 S85 50 100 58" stroke="#c9d6e3" strokeWidth="6" fill="none" />
        <path d="M10 0 L30 100 M0 35 L100 42 M62 0 L70 100 M0 85 L100 78" stroke="#fff" strokeWidth="1.6" />
        <path d="M40 0 L46 100 M0 15 L100 20" stroke="#fff" strokeWidth="0.8" />
        <rect x="70" y="5" width="18" height="14" fill="#dfe8d8" />
        <rect x="12" y="44" width="14" height="12" fill="#dfe8d8" />
      </svg>
      {spots.map(([x, y], i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-hidden
        >
          <svg width="22" height="28" viewBox="0 0 22 28">
            <path d="M11 27C11 27 21 16.5 21 10.5A10 10 0 0 0 1 10.5C1 16.5 11 27 11 27Z" fill="var(--mb)" />
            <circle cx="11" cy="10.5" r="3.6" fill="#fff" />
          </svg>
        </span>
      ))}
      <span className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-0.5 text-[10px] text-neutral-500">Mapa nemovitostí</span>
    </div>
  )
}

/** Annuity payment: price, own funds, rate, term → monthly instalment. */
export function MortgageCalculator({ price }: { price: number }) {
  const [ownShare, setOwnShare] = useState(20)
  const [years, setYears] = useState(30)
  const rate = 4.69
  const loan = Math.round(price * (1 - ownShare / 100))
  const r = rate / 100 / 12
  const n = years * 12
  const payment = Math.round((loan * r) / (1 - Math.pow(1 + r, -n)))

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="font-semibold">Hypoteční kalkulačka</p>
      <label className="mt-4 block text-sm">
        <span className="flex justify-between text-neutral-600">
          Vlastní zdroje <strong className="text-neutral-900">{ownShare} %</strong>
        </span>
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={ownShare}
          onChange={(e) => setOwnShare(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--mb)]"
        />
      </label>
      <label className="mt-3 block text-sm">
        <span className="flex justify-between text-neutral-600">
          Doba splácení <strong className="text-neutral-900">{years} let</strong>
        </span>
        <input
          type="range"
          min={10}
          max={30}
          step={5}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--mb)]"
        />
      </label>
      <div className="mt-4 rounded-md bg-[var(--mb-soft)] p-3">
        <p className="text-xs text-neutral-600">Orientační měsíční splátka při úroku {String(rate).replace('.', ',')} %</p>
        <p className="mt-1 text-2xl font-semibold text-[var(--mb)]">{formatNumber(payment)} Kč</p>
        <p className="mt-1 text-xs text-neutral-500">Výše úvěru {formatNumber(loan)} Kč</p>
      </div>
    </div>
  )
}

export function ContactForm({ button, compact = false }: { button: string; compact?: boolean }) {
  const field = 'w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400'
  return (
    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
      <div className={`grid gap-3 ${compact ? '' : '@xl:grid-cols-2'}`}>
        <input className={field} placeholder="Jméno a příjmení" tabIndex={-1} readOnly />
        <input className={field} placeholder="E-mail nebo telefon" tabIndex={-1} readOnly />
      </div>
      <textarea className={`${field} h-24 resize-none`} placeholder="Vaše zpráva" tabIndex={-1} readOnly />
      <BrandButton>{button}</BrandButton>
    </form>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  key: <path d="M15 7a4 4 0 1 1-3.9 4.9L4 19v-3h3v-3h3l1.1-1.1A4 4 0 0 1 15 7Zm1 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />,
  home: <path d="M12 3 3 10v11h6v-6h6v6h6V10l-9-7Z" />,
  chart: <path d="M4 20V10h3v10H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z" />,
  doc: <path d="M6 2h8l5 5v15H6V2Zm7 1.5V8h4.5L13 3.5ZM8.5 12h8v1.5h-8V12Zm0 3.5h8V17h-8v-1.5Z" />,
}

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
      {ICONS[name]}
    </svg>
  )
}
