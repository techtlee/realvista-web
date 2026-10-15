'use client'

import { useState } from 'react'

import { AGENT, formatNumber, formatPrice, type MockListing, type MockPost, type Penb } from '@/lib/mock-data'

import { Photo } from './Photo'
import type { Navigate } from './types'

/*
 * A port of platform/packages/theme-realvista/src/components/index.tsx.
 * Same sizes, spacing and tokens; container queries instead of media queries
 * (theme sm/md/lg/xl → @2xl/@3xl/@5xl/@7xl) so the phone frame gets the phone
 * layout; buttons instead of links so the mock never navigates the page.
 */

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1300px] px-5 @2xl:px-8 ${className}`}>{children}</div>
}

export function SolidButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-[50px] items-center justify-center rounded-rv-btn bg-rv-brand px-8 text-[16px] font-medium leading-[20px] text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  )
}

export function OutlineButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={`inline-flex h-[50px] items-center justify-center rounded-rv-btn border border-rv-brand px-8 text-[16px] font-medium leading-[21px] text-rv-brand transition-colors hover:bg-rv-brand hover:text-white ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[50px] min-w-[200px] items-center justify-center rounded-[50px] border border-white px-6 text-[16px] font-medium leading-[20px] text-white transition-colors hover:bg-white/10"
    >
      {children}
    </button>
  )
}

export function RegionChip({ label, count, onClick }: { label: string; count: number; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-[50px] shrink-0 items-center gap-2.5 rounded-rv-pill bg-rv-accent px-5">
      <span className="text-[12px] font-semibold leading-[20px] text-rv-brand">{label}</span>
      <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-[12px] font-semibold leading-[20px] text-rv-brand">
        {count}
      </span>
    </button>
  )
}

export function SpecPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[28px] items-center rounded-[16px] bg-rv-accent px-3 text-[12px] font-semibold leading-[16px] text-rv-brand">
      {children}
    </span>
  )
}

export function PropertyCard({ listing, navigate }: { listing: MockListing; navigate: Navigate }) {
  return (
    <button
      type="button"
      onClick={() => navigate({ page: 'detail', slug: listing.slug })}
      className="group block w-full text-left"
    >
      <div className="relative h-[235px] overflow-hidden bg-rv-accent">
        <Photo kind={listing.kind} seed={listing.seed} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        {listing.rent && (
          <span className="absolute left-3 top-3 rounded-rv-btn bg-rv-brand px-3 py-1 text-[12px] font-semibold text-white">
            Pronájem
          </span>
        )}
      </div>
      <div className="flex min-h-[100px] items-start justify-between gap-4 bg-rv-card px-[30px] py-[31px] shadow-rv-card">
        <div>
          <p className="text-[16px] font-bold leading-[20px] text-rv-brand">{listing.title}</p>
          <p className="rv-track mt-[11px] text-[16px] leading-[20px] text-rv-brand">{formatPrice(listing)}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[16px] leading-[21px] text-rv-muted">{formatNumber(listing.area)} m²</p>
          {listing.disposition && <p className="mt-[10px] text-[16px] leading-[21px] text-rv-muted">{listing.disposition}</p>}
        </div>
      </div>
    </button>
  )
}

export function MorePropertiesCard({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <div className="rv-promo flex min-h-[335px] flex-col items-center justify-center rounded-rv-btn p-8 text-center shadow-rv-card">
      <p className="text-[16px] font-bold leading-[20px] text-white">Dalších</p>
      <p className="text-[60px] font-medium leading-[67px] text-white">{count}+</p>
      <p className="mt-2 max-w-[224px] text-[16px] font-bold leading-[20px] text-white">nemovitostí v naší nabídce</p>
      <div className="mt-8">
        <GhostButton onClick={onClick}>Zobrazit vše</GhostButton>
      </div>
    </div>
  )
}

export function PostCard({ post, navigate }: { post: MockPost; navigate: Navigate }) {
  return (
    <button type="button" onClick={() => navigate({ page: 'post', slug: post.slug })} className="group block w-full text-left">
      <div className="h-[235px] overflow-hidden bg-rv-accent">
        <Photo kind="interior" seed={post.seed} className="transition-transform duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="min-h-[180px] bg-rv-card p-[30px] shadow-rv-card">
        <p className="text-[16px] font-bold leading-[20px] text-rv-brand">{post.title}</p>
        <p className="rv-track mt-5 text-[16px] leading-[20px] text-rv-brand opacity-40">{post.date}</p>
      </div>
    </button>
  )
}

/** Shared contact block: 60px heading left, underlined form right. */
export function ContactSection({ title, button, email }: { title: string; button: string; email: string }) {
  const line =
    'w-full border-0 border-b border-rv-muted bg-transparent pb-2 text-[16px] font-medium leading-[20px] text-rv-brand outline-none placeholder:text-rv-muted'
  return (
    <section className="py-[90px]">
      <Container className="grid gap-16 @5xl:grid-cols-2">
        <div>
          <h2 className="max-w-[504px] text-[40px] font-medium leading-[1.12] text-rv-brand @2xl:text-[60px] @2xl:leading-[67px]">
            {title}
          </h2>
          <div className="mt-16 space-y-5">
            <p className="rv-track text-[16px] leading-[20px] text-rv-brand">{email}</p>
            <p className="rv-track whitespace-pre-line text-[16px] font-bold leading-[20px] text-rv-brand">
              {'Vodičkova 12\n110 00 Praha 1'}
            </p>
            <p className="rv-track text-[16px] leading-[20px] text-rv-brand">{AGENT.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[30px] font-medium leading-[36px] text-rv-brand">Pojďme se spojit</h3>
          <form className="mt-12 space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-10 @2xl:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[16px] font-medium leading-[20px] text-rv-brand">Jméno a příjmení</span>
                <input readOnly tabIndex={-1} placeholder="Vaše jméno" className={line} />
              </label>
              <label className="block">
                <span className="mb-2 block text-[16px] font-medium leading-[20px] text-rv-brand">E-mail</span>
                <input readOnly tabIndex={-1} placeholder="E-mail" className={line} />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-[16px] font-medium leading-[20px] text-rv-brand">Zpráva</span>
              <textarea readOnly tabIndex={-1} rows={3} placeholder="Zde napište o co máte zájem" className={`${line} resize-none`} />
            </label>
            <div className="grid gap-6 @2xl:grid-cols-2">
              {['Souhlasím se zpracováním osobních údajů', 'Chci dostávat novinky e-mailem'].map((t) => (
                <span key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 h-[30px] w-[30px] shrink-0 rounded-rv-btn border border-rv-muted" />
                  <span className="text-[12px] font-medium leading-[20px] text-rv-brand">{t}</span>
                </span>
              ))}
            </div>
            <button
              type="button"
              className="h-[50px] w-full rounded-rv-btn bg-rv-brand text-[16px] font-medium leading-[20px] text-white transition-opacity hover:opacity-90"
            >
              {button}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}

export function Footer({
  name,
  tagline,
  email,
  blog,
  navigate,
}: {
  name: string
  tagline: string
  email: string
  blog: boolean
  navigate: Navigate
}) {
  const menu: { label: string; go: () => void }[] = [
    { label: 'O makléři', go: () => navigate({ page: 'home' }, 'agent') },
    { label: 'Nabízené nemovitosti', go: () => navigate({ page: 'listings' }) },
    ...(blog ? [{ label: 'Blog & Poradna', go: () => navigate({ page: 'blog' }) }] : []),
  ]
  return (
    <footer className="bg-rv-brand pb-[60px] pt-[150px]">
      <Container className="grid gap-12 @5xl:grid-cols-[420px_1fr_1fr_290px]">
        <div>
          <p className="rv-track break-words text-[46px] font-bold leading-[60px] text-white">{name}</p>
          <p className="mt-2 max-w-[420px] text-[16px] leading-[24px] text-rv-footer-ink">{tagline}</p>
        </div>
        <div>
          <p className="text-[18px] font-bold leading-[23px] text-white">Menu</p>
          <ul className="mt-4 space-y-4">
            {menu.map((l) => (
              <li key={l.label}>
                <button type="button" onClick={l.go} className="text-[15px] leading-[20px] text-rv-footer-ink hover:text-white">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[18px] font-bold leading-[23px] text-white">Kancelář</p>
          <ul className="mt-4 space-y-4 text-[15px] leading-[20px] text-rv-footer-ink">
            <li className="whitespace-pre-line">{'Vodičkova 12\n110 00 Praha 1'}</li>
            <li>{AGENT.phone}</li>
            <li>{email}</li>
          </ul>
        </div>
        <div className="rounded-rv-btn border border-white/10 bg-white/5 p-5">
          <p className="text-[16px] font-bold leading-[21px] text-white">Odebírat novinky</p>
          <p className="mt-2 text-[13px] leading-[18px] text-rv-footer-ink">Nové nemovitosti a tipy z trhu jednou měsíčně.</p>
          <div className="mt-6 flex h-[41px] items-center justify-between rounded-rv-btn bg-white px-4">
            <span className="text-[13px] leading-[17px] text-rv-muted">Váš e-mail</span>
            <span aria-hidden className="text-[13px] font-bold text-rv-brand">
              →
            </span>
          </div>
        </div>
      </Container>
      <Container className="mt-[120px] flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] leading-[20px] text-rv-footer-ink">© 2026 {name}</p>
        <div className="flex gap-6 text-[15px] leading-[20px] text-rv-footer-ink">
          <span>Zásady ochrany osobních údajů</span>
          <span>Cookies</span>
        </div>
      </Container>
    </footer>
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

/** Legally mandatory in Czech property ads (zák. 406/2000 Sb.). */
export function PenbValue({ penb }: { penb: Penb | null }) {
  if (!penb) return <>Nevyžaduje se</>
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid h-6 w-8 place-items-center text-[13px] font-bold text-white [clip-path:polygon(0_0,78%_0,100%_50%,78%_100%,0_100%)]"
        style={{ background: PENB_COLORS[penb] }}
      >
        {penb}
      </span>
      Třída {penb}
    </span>
  )
}

/**
 * A stylised map with pins in the brand colour. No tiles, nothing external.
 * Not part of the theme yet — `features.listingMap` is offered by the
 * configurator but the theme does not render it (see README).
 */
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
    <div className={`relative overflow-hidden rounded-rv-btn bg-rv-accent ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-70" aria-hidden>
        <path d="M0 70 C20 60 35 80 55 66 S85 50 100 58" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.7" />
        <path d="M10 0 L30 100 M0 35 L100 42 M62 0 L70 100 M0 85 L100 78" stroke="#fff" strokeWidth="1.6" />
        <path d="M40 0 L46 100 M0 15 L100 20" stroke="#fff" strokeWidth="0.8" />
      </svg>
      {spots.map(([x, y], i) => (
        <span key={i} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden>
          <svg width="22" height="28" viewBox="0 0 22 28">
            <path d="M11 27C11 27 21 16.5 21 10.5A10 10 0 0 0 1 10.5C1 16.5 11 27 11 27Z" fill="var(--rv-brand)" />
            <circle cx="11" cy="10.5" r="3.6" fill="#fff" />
          </svg>
        </span>
      ))}
      <span className="absolute bottom-3 right-3 rounded-rv-btn bg-white/90 px-2.5 py-1 text-[12px] font-medium text-rv-brand">
        Mapa nemovitostí
      </span>
    </div>
  )
}

/**
 * Annuity payment from price, own funds and term. Styled as a theme card.
 * Like the map, offered by the configurator but not yet in the theme.
 */
export function MortgageCalculator({ price }: { price: number }) {
  const [ownShare, setOwnShare] = useState(20)
  const [years, setYears] = useState(30)
  const rate = 4.69
  const loan = Math.round(price * (1 - ownShare / 100))
  const r = rate / 100 / 12
  const payment = Math.round((loan * r) / (1 - Math.pow(1 + r, -years * 12)))

  return (
    <div className="rounded-rv-btn bg-rv-card p-[40px] shadow-rv-card">
      <p className="text-[30px] font-medium leading-[39px] text-rv-brand">Hypoteční kalkulačka</p>
      {(
        [
          ['Vlastní zdroje', `${ownShare} %`, ownShare, 10, 50, setOwnShare],
          ['Doba splácení', `${years} let`, years, 10, 30, setYears],
        ] as const
      ).map(([label, shown, value, min, max, set]) => (
        <label key={label} className="mt-6 block">
          <span className="flex justify-between text-[16px] leading-[21px] text-rv-muted">
            {label} <strong className="font-medium text-rv-brand">{shown}</strong>
          </span>
          <input
            type="range"
            min={min}
            max={max}
            step={5}
            value={value}
            onChange={(e) => set(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--rv-brand)]"
          />
        </label>
      ))}
      <div className="mt-8 border-t border-rv-accent pt-6">
        <p className="text-[14px] leading-[18px] text-rv-muted">Orientační měsíční splátka při úroku {String(rate).replace('.', ',')} %</p>
        <p className="mt-2 text-[30px] font-bold leading-[39px] text-rv-brand">{formatNumber(payment)} Kč</p>
        <p className="mt-1 text-[14px] leading-[18px] text-rv-muted">Výše úvěru {formatNumber(loan)} Kč</p>
      </div>
    </div>
  )
}

const ICONS: Record<string, React.ReactNode> = {
  key: <path d="M3 3h8.2l9.8 9.8-8.2 8.2L3 11.2V3Zm4.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />,
  home: <path d="M12 3 3 10v11h6v-6h6v6h6V10l-9-7Z" />,
  chart: <path d="M4 20V10h3v10H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z" />,
  doc: <path d="M6 2h8l5 5v15H6V2Zm7 1.5V8h4.5L13 3.5ZM8.5 12h8v1.5h-8V12Zm0 3.5h8V17h-8v-1.5Z" />,
}

export function Icon({ name, className = 'h-8 w-8' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden>
      {ICONS[name]}
    </svg>
  )
}
