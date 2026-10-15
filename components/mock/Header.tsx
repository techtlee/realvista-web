'use client'

import { useState } from 'react'

import { Container } from './parts'
import type { MockRoute, Navigate } from './types'

/**
 * The theme's header: over the hero it is transparent and takes the hero's
 * ink (dark on indigo, white on the others); elsewhere it sits on the page.
 *
 * Two deliberate departures from the theme, both gaps in the theme itself:
 * - a phone menu — the theme hides its nav below md and offers nothing
 *   instead, so a phone visitor cannot navigate;
 * - the nav honours the blog module — the theme always links /blog.
 */
export function Header({
  name,
  overlay,
  blog,
  route,
  navigate,
}: {
  name: string
  overlay: boolean
  blog: boolean
  route: MockRoute
  navigate: Navigate
}) {
  const [open, setOpen] = useState(false)
  const ink = overlay ? 'text-rv-hero-ink' : 'text-rv-brand'

  const items: { label: string; go: () => void; active: boolean }[] = [
    {
      label: 'Nemovitosti',
      go: () => navigate({ page: 'listings' }),
      active: route.page === 'listings' || route.page === 'detail',
    },
    { label: 'Kontakt', go: () => navigate({ page: 'home' }, 'contact'), active: false },
    ...(blog
      ? [{ label: 'Blog', go: () => navigate({ page: 'blog' }), active: route.page === 'blog' || route.page === 'post' }]
      : []),
    { label: 'O makléři', go: () => navigate({ page: 'home' }, 'agent'), active: false },
  ]

  function go(fn: () => void) {
    setOpen(false)
    fn()
  }

  return (
    <header className={overlay ? 'absolute inset-x-0 top-0 z-40' : 'relative z-40'}>
      <Container className="flex h-[60px] items-center justify-between gap-6">
        <button type="button" onClick={() => go(() => navigate({ page: 'home' }))} className={`rv-track truncate text-[16px] leading-[20px] ${ink}`}>
          {name}
        </button>
        <nav className="hidden items-center gap-8 @3xl:flex">
          {items.map((n) => (
            <button
              key={n.label}
              type="button"
              onClick={() => go(n.go)}
              className={`rv-track text-[16px] leading-[20px] ${ink} hover:opacity-70 ${n.active ? 'underline underline-offset-8' : ''}`}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          className={`grid h-10 w-10 place-items-center @3xl:hidden ${ink}`}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </Container>
      {open && (
        <nav className="bg-rv-card shadow-rv-card @3xl:hidden">
          {items.map((n) => (
            <button
              key={n.label}
              type="button"
              onClick={() => go(n.go)}
              className="rv-track block w-full border-b border-rv-accent px-5 py-4 text-left text-[16px] text-rv-brand"
            >
              {n.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
