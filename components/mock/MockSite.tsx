'use client'

import { useState } from 'react'

import type { Draft } from '@/lib/draft'
import { TONE_COPY } from '@/lib/tone-copy'

import { Home, slug } from './Home'
import { BlogIndex, Detail, Listings, Post } from './Pages'
import { Container } from './parts'
import type { MockRoute, Navigate } from './types'

/**
 * A clickable stand-in for the realtor's future site, rebuilt from the draft
 * on every change: their name in the header, their colour everywhere, their
 * section order on the homepage, their modules deciding which pages and
 * widgets exist, their tone in the copy.
 *
 * Laid out with container queries, not media queries, so it responds to the
 * frame it sits in — the "Mobil" frame gets the real phone layout.
 */
export function MockSite({
  draft,
  swatch,
  route,
  highlight,
  navigate,
}: {
  draft: Draft
  swatch: string
  route: MockRoute
  highlight: string | null
  navigate: Navigate
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const brand = draft.brand.name.trim() || 'Vaše realitní kancelář'
  const copy = TONE_COPY[draft.content.tone]
  const blog = draft.modules.blog

  const go: Navigate = (r, section) => {
    setMenuOpen(false)
    navigate(r, section)
  }

  const nav: { label: string; route: MockRoute; section?: string; active: boolean }[] = [
    { label: 'Úvod', route: { page: 'home' }, active: route.page === 'home' },
    { label: 'Nemovitosti', route: { page: 'listings' }, active: route.page === 'listings' || route.page === 'detail' },
    ...(blog ? [{ label: 'Blog', route: { page: 'blog' } as MockRoute, active: route.page === 'blog' || route.page === 'post' }] : []),
    { label: 'Kontakt', route: { page: 'home' }, section: 'contact', active: false },
  ]

  return (
    <div
      className="@container min-h-full bg-white font-[family-name:var(--font-body)] text-neutral-900"
      style={
        {
          '--mb': swatch,
          '--mb-soft': `color-mix(in srgb, ${swatch} 7%, white)`,
        } as React.CSSProperties
      }
    >
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <button type="button" onClick={() => go({ page: 'home' })} className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--mb)] text-sm font-bold text-white">
              {initials(brand)}
            </span>
            <span className="truncate font-semibold tracking-tight">{brand}</span>
          </button>

          <nav className="hidden items-center gap-7 text-sm @3xl:flex">
            {nav.map((n) => (
              <button
                key={n.label}
                type="button"
                onClick={() => go(n.route, n.section)}
                className={n.active ? 'font-semibold text-[var(--mb)]' : 'text-neutral-600 hover:text-neutral-900'}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-md border border-neutral-200 @3xl:hidden"
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              {menuOpen ? (
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
              )}
            </svg>
          </button>
        </Container>

        {menuOpen && (
          <nav className="border-t border-neutral-200 bg-white @3xl:hidden">
            {nav.map((n) => (
              <button
                key={n.label}
                type="button"
                onClick={() => go(n.route, n.section)}
                className={`block w-full border-b border-neutral-100 px-5 py-3.5 text-left ${
                  n.active ? 'font-semibold text-[var(--mb)]' : ''
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>
        {route.page === 'home' && (
          <Home
            sections={draft.sections.home}
            brand={brand}
            tagline={draft.brand.tagline.trim()}
            copy={copy}
            blog={blog}
            highlight={highlight}
            navigate={go}
          />
        )}
        {route.page === 'listings' && <Listings map={draft.modules.listingMap} navigate={go} />}
        {route.page === 'detail' && (
          <Detail
            slug={route.slug}
            map={draft.modules.listingMap}
            calculator={draft.modules.mortgageCalculator}
            brand={brand}
            copy={copy}
            navigate={go}
          />
        )}
        {route.page === 'blog' && blog && <BlogIndex navigate={go} />}
        {route.page === 'post' && blog && <Post slug={route.slug} navigate={go} />}
      </main>

      <footer className="bg-neutral-900 py-10 text-sm text-neutral-400">
        <Container className="flex flex-col gap-6 @3xl:flex-row @3xl:items-start @3xl:justify-between">
          <div>
            <p className="font-semibold text-white">{brand}</p>
            <p className="mt-1">{draft.brand.tagline.trim() || copy.heroSub}</p>
          </div>
          <div className="space-y-1">
            <p>+420 777 123 456</p>
            <p>info@{slug(brand)}.cz</p>
          </div>
          <div className="space-y-1">
            <p>Zásady ochrany osobních údajů</p>
            <p>Cookies</p>
          </div>
        </Container>
      </footer>
    </div>
  )
}

function initials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  return ((words[0]?.[0] ?? 'V') + (words[1]?.[0] ?? '')).toUpperCase()
}
