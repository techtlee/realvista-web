'use client'

import type { CatalogVariant } from '@/lib/catalog'
import type { Draft } from '@/lib/draft'
import { TONE_COPY } from '@/lib/tone-copy'

import { Header } from './Header'
import { Home, slug } from './Home'
import { BlogIndex, Detail, Listings, Post } from './Pages'
import { Footer } from './parts'
import type { MockRoute, Navigate } from './types'

/**
 * The realtor's future site, as REALVISTA renders it — a port of
 * platform/packages/theme-realvista, rebuilt from the draft on every change:
 * their name in the header, their colourway's full token set, their section
 * order, their modules, their tone.
 *
 * Laid out with container queries so it responds to the frame it sits in.
 */
export function MockSite({
  draft,
  variant,
  route,
  highlight,
  navigate,
}: {
  draft: Draft
  variant: CatalogVariant
  route: MockRoute
  highlight: string | null
  navigate: Navigate
}) {
  const brand = draft.brand.name.trim() || 'Vaše realitní kancelář'
  const tagline = draft.brand.tagline.trim()
  const copy = TONE_COPY[draft.content.tone]
  const blog = draft.modules.blog
  const email = `info@${slug(brand)}.cz`
  const t = variant.tokens

  return (
    <div
      className="@container min-h-full bg-rv-page font-rv text-rv-brand"
      style={
        {
          '--rv-brand': t.brand,
          '--rv-page': t.page,
          '--rv-accent': t.accent,
          '--rv-muted': t.muted,
          '--rv-card': t.card,
          '--rv-hero-ink': t.heroInk,
          '--rv-footer-ink': t.footerInk,
          '--rv-shadow-card': t.shadowCard,
          '--rv-hero-overlay': t.heroOverlay,
          '--rv-band-a': t.bandA,
          '--rv-band-b': t.bandB,
          '--rv-promo': t.promo,
        } as React.CSSProperties
      }
    >
      {route.page !== 'home' && <Header name={brand} overlay={false} blog={blog} route={route} navigate={navigate} />}

      <main>
        {route.page === 'home' && (
          <Home
            sections={draft.sections.home}
            brand={brand}
            tagline={tagline}
            email={email}
            copy={copy}
            blog={blog}
            highlight={highlight}
            route={route}
            navigate={navigate}
          />
        )}
        {route.page === 'listings' && <Listings map={draft.modules.listingMap} copy={copy} email={email} navigate={navigate} />}
        {route.page === 'detail' && (
          <Detail
            slug={route.slug}
            map={draft.modules.listingMap}
            calculator={draft.modules.mortgageCalculator}
            copy={copy}
            email={email}
            navigate={navigate}
          />
        )}
        {route.page === 'blog' && blog && <BlogIndex navigate={navigate} />}
        {route.page === 'post' && blog && <Post slug={route.slug} navigate={navigate} />}
      </main>

      <Footer name={brand} tagline={tagline || copy.heroSub} email={email} blog={blog} navigate={navigate as Navigate} />
    </div>
  )
}
