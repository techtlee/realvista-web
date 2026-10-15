import { AGENT, formatNumber, formatPrice, LISTINGS, listingCount, POSTS, TOTAL_LISTINGS } from '@/lib/mock-data'
import type { ToneCopy } from '@/lib/tone-copy'

import { Container, ContactSection, MapPanel, MortgageCalculator, OutlineButton, PenbValue, PostCard, PropertyCard, SolidButton, SpecPill } from './parts'
import { Photo } from './Photo'
import type { Navigate } from './types'

/* Ports of RealvistaListingIndex, RealvistaPropertyDetail, RealvistaBlogIndex
 * and RealvistaPostDetail. The header and footer come from MockSite. */

interface Shared {
  copy: ToneCopy
  email: string
  navigate: Navigate
}

export function Listings({ map, copy, email, navigate }: Shared & { map: boolean }) {
  return (
    <>
      <Container className="py-[90px]">
        <h1 className="text-[30px] font-medium leading-[36px] text-rv-brand">Nabídka nemovitostí</h1>
        <p className="rv-track mt-4 text-[16px] leading-[20px] text-rv-brand">{listingCount(TOTAL_LISTINGS)}</p>
        {map && <MapPanel className="mt-[50px] h-[260px] @5xl:h-[380px]" />}
        <div className="mt-[50px] grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
          {LISTINGS.map((l) => (
            <PropertyCard key={l.slug} listing={l} navigate={navigate} />
          ))}
        </div>
      </Container>
      <ContactSection title={copy.ctaTitle} button={copy.contactButton} email={email} />
    </>
  )
}

export function Detail({
  slug,
  map,
  calculator,
  copy,
  email,
  navigate,
}: Shared & { slug: string; map: boolean; calculator: boolean }) {
  const l = LISTINGS.find((x) => x.slug === slug) ?? LISTINGS[0]!
  const similar = LISTINGS.filter((x) => x.slug !== l.slug).slice(0, 3)
  const perM2 = l.rent ? null : `${formatNumber(Math.round(l.price / l.area))} Kč/m²`

  const rows: [string, React.ReactNode][] = [
    ['Dispozice', l.disposition],
    [l.kind === 'land' ? 'Plocha pozemku' : 'Užitná plocha', `${formatNumber(l.area)} m²`],
    ['Podlaží', l.floor],
    ['Stav nemovitosti', l.condition],
    ['Vlastnictví', l.ownership],
    ['Energetická náročnost', <PenbValue key="penb" penb={l.penb} />],
  ]
  const params = rows.filter(([, v]) => Boolean(v))

  const pills = [`${formatNumber(l.area)} m²`, l.disposition && `Dispozice ${l.disposition}`, `${l.ownership} vlastnictví`].filter(
    Boolean,
  ) as string[]

  return (
    <>
      <Container className="pt-[40px]">
        <nav aria-label="Drobečková navigace" className="flex flex-wrap items-center gap-2 text-[14px] leading-[18px] text-rv-muted">
          <button type="button" onClick={() => navigate({ page: 'listings' })} className="hover:text-rv-brand">
            Nemovitosti
          </button>
          <span>›</span>
          <span>{l.location}</span>
          <span>›</span>
          <span className="font-medium text-rv-brand">{l.title}</span>
        </nav>
      </Container>

      <Container className="mt-[38px]">
        <div className="grid gap-5 @5xl:grid-cols-[640px_1fr]">
          <div className="h-[320px] overflow-hidden rounded-rv-btn bg-rv-accent @2xl:h-[500px]">
            <Photo kind={l.kind} seed={l.seed} />
          </div>
          <div className="grid gap-5 @2xl:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[150px] overflow-hidden rounded-rv-btn bg-rv-accent @2xl:h-[240px]">
                <Photo kind="interior" seed={l.seed + i} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <div className="flex h-[50px] w-full items-center justify-between rounded-rv-btn bg-rv-brand px-[30px] @2xl:w-[310px]">
            <span className="text-[16px] font-bold leading-[20px] text-white">Všechny fotky</span>
            <span className="text-[16px] font-bold leading-[20px] text-white opacity-60">+14</span>
          </div>
        </div>
      </Container>

      <Container className="mt-[50px]">
        <div className="flex flex-wrap items-start justify-between gap-6 rounded-rv-btn bg-rv-card px-5 py-[30px] shadow-rv-card @2xl:px-[50px]">
          <div>
            <h1 className="max-w-[595px] text-[30px] font-medium leading-[36px] text-rv-brand">{l.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3">
              {pills.map((p) => (
                <SpecPill key={p}>{p}</SpecPill>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[30px] font-bold leading-[39px] text-rv-brand">{formatPrice(l)}</p>
            {perM2 && <p className="text-[14px] leading-[18px] text-rv-muted">{perM2}</p>}
          </div>
        </div>
      </Container>

      <Container className="mt-[100px] grid gap-[60px] @5xl:grid-cols-[640px_1fr] @5xl:gap-[130px]">
        <div>
          <h2 className="text-[30px] font-medium leading-[39px] text-rv-brand">Popis nemovitosti</h2>
          <p className="mt-[50px] text-[16px] leading-[26px] text-rv-brand">{l.description}</p>
          <h2 className="mt-[100px] text-[30px] font-medium leading-[39px] text-rv-brand">Parametry nemovitosti</h2>
          <dl className="mt-[25px] border-t border-rv-accent">
            {params.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-rv-accent py-[14px]">
                <dt className="text-[16px] leading-[21px] text-rv-muted">{k}</dt>
                <dd className="text-right text-[16px] font-medium leading-[21px] text-rv-brand">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-10">
          <aside className="h-fit rounded-rv-btn bg-rv-card p-[40px] shadow-rv-card">
            <p className="text-center text-[30px] font-medium leading-[39px] text-rv-brand">Máte zájem o prohlídku?</p>
            <div className="mt-[18px] flex items-center gap-[30px]">
              <span className="h-20 w-20 shrink-0 overflow-hidden rounded-rv-btn">
                <Photo kind="person" seed={5} />
              </span>
              <div>
                <p className="text-[16px] font-bold leading-[21px] text-rv-brand">{AGENT.name}</p>
                <p className="mt-1 text-[16px] leading-[21px] text-rv-muted">{AGENT.jobTitle}</p>
              </div>
            </div>
            <div className="mt-[40px] flex flex-wrap gap-3">
              <SolidButton onClick={() => navigate({ page: 'home' }, 'contact')} className="flex-1">
                Domluvit prohlídku
              </SolidButton>
              <OutlineButton className="flex-1">Zavolat makléři</OutlineButton>
            </div>
            <div className="mt-[60px] flex flex-wrap gap-x-12 gap-y-3 text-[16px] font-medium leading-[21px] text-rv-brand">
              <p>{AGENT.phone}</p>
              <p>{email}</p>
            </div>
          </aside>
          {calculator && !l.rent && (
            <div data-mock-section="calculator">
              <MortgageCalculator price={l.price} />
            </div>
          )}
        </div>
      </Container>

      <Container className="mt-[100px]">
        <h2 className="text-[30px] font-medium leading-[39px] text-rv-brand">Lokalita</h2>
        <p className="mt-[50px] max-w-[640px] text-[16px] leading-[24px] text-rv-brand">
          {l.location}. Přesná adresa je k dispozici na vyžádání.
        </p>
        {map && <MapPanel pins={1} className="mt-[30px] h-[300px]" />}
      </Container>

      <Container className="mt-[100px]">
        <h2 className="text-[30px] font-medium leading-[39px] text-rv-brand">Podobné nemovitosti</h2>
        <p className="mt-2 text-[16px] leading-[21px] text-rv-muted">Prohlédněte si další exkluzivní nemovitosti v okolí.</p>
        <div className="mt-[50px] grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
          {similar.map((s) => (
            <PropertyCard key={s.slug} listing={s} navigate={navigate} />
          ))}
        </div>
      </Container>

      <div className="mt-[150px]">
        <ContactSection title={copy.ctaTitle} button={copy.contactButton} email={email} />
      </div>
    </>
  )
}

export function BlogIndex({ navigate }: { navigate: Navigate }) {
  return (
    <>
      <Container className="pt-[90px]">
        <h1 className="max-w-[900px] text-[40px] font-medium leading-[1.12] text-rv-brand @2xl:text-[60px] @2xl:leading-[67px]">
          Vědomosti a praxe
        </h1>
        <p className="rv-track mt-5 max-w-[640px] text-[16px] leading-[22px] text-rv-brand">
          Zkušenosti z trhu, hloubkové analýzy a praktické tipy k prodeji i pronájmu.
        </p>
      </Container>
      <Container className="pb-[150px] pt-[50px]">
        <div className="grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
          {POSTS.map((p) => (
            <PostCard key={p.slug} post={p} navigate={navigate} />
          ))}
        </div>
      </Container>
    </>
  )
}

export function Post({ slug, navigate }: { slug: string; navigate: Navigate }) {
  const p = POSTS.find((x) => x.slug === slug) ?? POSTS[0]!
  const recent = POSTS.filter((x) => x.slug !== p.slug)
  return (
    <>
      <Container className="pt-[40px]">
        <nav aria-label="Drobečková navigace" className="flex flex-wrap items-center gap-2 text-[14px] leading-[18px] text-rv-muted">
          <button type="button" onClick={() => navigate({ page: 'blog' })} className="hover:text-rv-brand">
            Blog
          </button>
          <span>›</span>
          <span className="font-medium text-rv-brand">{p.title}</span>
        </nav>
      </Container>
      <Container className="pt-[40px]">
        <h1 className="max-w-[900px] text-[40px] font-medium leading-[1.12] text-rv-brand @2xl:text-[60px] @2xl:leading-[67px]">
          {p.title}
        </h1>
        <p className="rv-track mt-5 text-[16px] leading-[20px] text-rv-muted">{p.date}</p>
      </Container>
      <Container className="mt-[50px]">
        <div className="h-[320px] overflow-hidden rounded-rv-btn bg-rv-accent @2xl:h-[500px]">
          <Photo kind="interior" seed={p.seed} />
        </div>
      </Container>
      <Container className="mt-[60px] max-w-[760px]">
        <p className="text-[22px] font-medium leading-[32px] text-rv-brand">{p.excerpt}</p>
        <div className="mt-[40px] space-y-4 text-[16px] leading-[26px] text-rv-brand">
          <p>
            Tady bude váš článek. Blog píšete sami v administraci webu — stačí nadpis, pár odstavců a fotka. Pravidelné
            články přivádějí návštěvníky z vyhledávačů a ukazují, že trhu rozumíte.
          </p>
          <p>Každý článek dostane vlastní adresu a náhled pro sdílení na sociálních sítích.</p>
        </div>
      </Container>
      <Container className="mt-[150px] pb-[150px]">
        <h2 className="text-[30px] font-medium leading-[36px] text-rv-brand">Další články</h2>
        <div className="mt-[50px] grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
          {recent.map((r) => (
            <PostCard key={r.slug} post={r} navigate={navigate} />
          ))}
        </div>
      </Container>
    </>
  )
}
