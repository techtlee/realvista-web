import { formatNumber, formatPrice, LISTINGS, POSTS } from '@/lib/mock-data'
import type { ToneCopy } from '@/lib/tone-copy'

import { Container, ContactForm, ListingCard, MapPanel, MortgageCalculator, PenbBadge } from './parts'
import { Photo } from './Photo'
import type { Navigate } from './types'

export function Listings({ map, navigate }: { map: boolean; navigate: Navigate }) {
  return (
    <Container className="py-10 @3xl:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Nabídka nemovitostí</h1>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {['Vše', 'Prodej', 'Pronájem', 'Byty', 'Domy', 'Pozemky'].map((f, i) => (
          <span
            key={f}
            className={`rounded-full border px-3.5 py-1.5 ${
              i === 0 ? 'border-[var(--mb)] bg-[var(--mb)] text-white' : 'border-neutral-300 text-neutral-700'
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      <div className={`mt-8 grid gap-6 ${map ? '@3xl:grid-cols-[1fr_340px]' : ''}`}>
        {map && <MapPanel className="h-56 @3xl:order-2 @3xl:sticky @3xl:top-4 @3xl:h-[520px]" />}
        <div className={`grid gap-5 @xl:grid-cols-2 ${map ? '' : '@3xl:grid-cols-3'}`}>
          {LISTINGS.map((l) => (
            <ListingCard key={l.slug} listing={l} navigate={navigate} />
          ))}
        </div>
      </div>
      <p className="mt-8 text-center text-sm text-neutral-500">Zobrazeno {LISTINGS.length} z {LISTINGS.length} nemovitostí</p>
    </Container>
  )
}

export function Detail({
  slug,
  map,
  calculator,
  brand,
  copy,
  navigate,
}: {
  slug: string
  map: boolean
  calculator: boolean
  brand: string
  copy: ToneCopy
  navigate: Navigate
}) {
  const l = LISTINGS.find((x) => x.slug === slug) ?? LISTINGS[0]!
  const params = [
    ['Cena', formatPrice(l)],
    ['Dispozice', l.disposition],
    ['Plocha', `${formatNumber(l.area)} m²`],
    ['Podlaží', l.floor],
    ['Stav', l.condition],
    ['Vlastnictví', l.ownership],
  ].filter((p): p is [string, string] => Boolean(p[1]))
  const similar = LISTINGS.filter((x) => x.slug !== l.slug).slice(0, 3)

  return (
    <Container className="py-8 @3xl:py-12">
      <button type="button" onClick={() => navigate({ page: 'listings' })} className="text-sm text-neutral-500 hover:text-[var(--mb)]">
        ← Zpět na nabídku
      </button>

      <div className="mt-4 grid gap-2 @3xl:grid-cols-[2fr_1fr] @3xl:grid-rows-2">
        <div className="aspect-[16/10] overflow-hidden rounded-lg @3xl:row-span-2 @3xl:aspect-auto">
          <Photo kind={l.kind} seed={l.seed} />
        </div>
        <div className="hidden overflow-hidden rounded-lg @3xl:block">
          <Photo kind="interior" seed={l.seed + 1} />
        </div>
        <div className="relative hidden overflow-hidden rounded-lg @3xl:block">
          <Photo kind="interior" seed={l.seed + 2} />
          <span className="absolute inset-0 grid place-items-center bg-black/40 text-sm font-semibold text-white">+ 14 fotografií</span>
        </div>
      </div>

      <div className="mt-8 grid gap-10 @3xl:grid-cols-[1fr_340px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--mb)]">{l.rent ? 'Pronájem' : 'Prodej'}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{l.title}</h1>
          <p className="mt-1 text-neutral-500">{l.location}</p>
          <p className="mt-4 text-3xl font-semibold text-[var(--mb)]">{formatPrice(l)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 border-t border-neutral-200 @xl:grid-cols-3">
            {params.map(([k, v]) => (
              <div key={k} className="border-b border-neutral-200 py-3">
                <dt className="text-xs text-neutral-500">{k}</dt>
                <dd className="mt-0.5 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <PenbBadge penb={l.penb} />
          </div>

          <h2 className="mt-8 text-xl font-semibold">Popis</h2>
          <p className="mt-3 leading-relaxed text-neutral-600">{l.description}</p>

          {map && (
            <>
              <h2 className="mt-8 text-xl font-semibold">Poloha</h2>
              <MapPanel pins={1} className="mt-3 h-56" />
            </>
          )}
        </div>

        <aside className="space-y-5">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 overflow-hidden rounded-full">
                <Photo kind="person" seed={5} />
              </span>
              <div>
                <p className="font-semibold">{brand}</p>
                <p className="text-sm text-neutral-500">+420 777 123 456</p>
              </div>
            </div>
            <div className="mt-4">
              <ContactForm button={copy.contactButton} compact />
            </div>
          </div>
          {calculator && !l.rent && (
            <div data-mock-section="calculator">
              <MortgageCalculator price={l.price} />
            </div>
          )}
        </aside>
      </div>

      <h2 className="mt-14 text-xl font-semibold">Podobné nemovitosti</h2>
      <div className="mt-5 grid gap-5 @xl:grid-cols-2 @3xl:grid-cols-3">
        {similar.map((s) => (
          <ListingCard key={s.slug} listing={s} navigate={navigate} />
        ))}
      </div>
    </Container>
  )
}

export function BlogIndex({ navigate }: { navigate: Navigate }) {
  return (
    <Container className="py-10 @3xl:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <div className="mt-8 grid gap-8 @3xl:grid-cols-3">
        {POSTS.map((p) => (
          <button key={p.slug} type="button" onClick={() => navigate({ page: 'post', slug: p.slug })} className="group text-left">
            <div className="aspect-[16/10] overflow-hidden rounded-lg">
              <Photo kind="interior" seed={p.seed} className="transition duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-3 text-xs text-neutral-500">{p.date}</p>
            <p className="mt-1 text-lg font-semibold group-hover:text-[var(--mb)]">{p.title}</p>
            <p className="mt-1 text-sm text-neutral-600">{p.excerpt}</p>
          </button>
        ))}
      </div>
    </Container>
  )
}

export function Post({ slug, navigate }: { slug: string; navigate: Navigate }) {
  const p = POSTS.find((x) => x.slug === slug) ?? POSTS[0]!
  return (
    <Container className="max-w-[760px] py-10 @3xl:py-14">
      <button type="button" onClick={() => navigate({ page: 'blog' })} className="text-sm text-neutral-500 hover:text-[var(--mb)]">
        ← Všechny články
      </button>
      <p className="mt-6 text-sm text-neutral-500">{p.date}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight @3xl:text-4xl">{p.title}</h1>
      <p className="mt-4 text-lg text-neutral-600">{p.excerpt}</p>
      <div className="mt-8 aspect-[16/9] overflow-hidden rounded-lg">
        <Photo kind="interior" seed={p.seed} />
      </div>
      <div className="mt-8 space-y-4 leading-relaxed text-neutral-700">
        <p>
          Tady bude váš článek. Blog píšete sami v administraci webu — stačí nadpis, pár odstavců a fotka. Pravidelné
          články přivádějí návštěvníky z vyhledávačů a ukazují, že trhu rozumíte.
        </p>
        <p>
          Každý článek dostane vlastní adresu, náhled pro sdílení na sociálních sítích a objeví se na úvodní stránce v
          sekci Blog.
        </p>
      </div>
    </Container>
  )
}
