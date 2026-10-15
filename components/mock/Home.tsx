import { LISTINGS, POSTS, SERVICES } from '@/lib/mock-data'
import type { ToneCopy } from '@/lib/tone-copy'

import { BrandButton, Container, ContactForm, Heading, Icon, ListingCard } from './parts'
import { Photo } from './Photo'
import type { Navigate } from './types'

interface Props {
  sections: string[]
  brand: string
  tagline: string
  copy: ToneCopy
  blog: boolean
  highlight: string | null
  navigate: Navigate
}

/** The homepage, rendered in exactly the section order the realtor chose. */
export function Home({ sections, highlight, ...props }: Props) {
  return (
    <>
      {sections.map((id) => (
        <div
          key={id}
          data-mock-section={id}
          className={`transition-[box-shadow] duration-500 ${
            highlight === id ? 'relative z-10 shadow-[inset_0_0_0_4px_var(--mb),0_0_0_9999px_rgba(255,255,255,0.35)]' : ''
          }`}
        >
          <Section id={id} {...props} />
        </div>
      ))}
    </>
  )
}

function Section({ id, brand, tagline, copy, blog, navigate }: Omit<Props, 'sections' | 'highlight'> & { id: string }) {
  switch (id) {
    case 'hero':
      return (
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Photo kind="house" seed={2} />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--mb)_15%,color-mix(in_srgb,var(--mb)_55%,transparent)_60%,transparent)]" />
          </div>
          <Container className="py-16 text-white @3xl:py-28">
            <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight @3xl:text-5xl">{copy.heroTitle}</h1>
            <p className="mt-4 max-w-lg text-base text-white/85 @3xl:text-lg">{tagline || copy.heroSub}</p>
            <div className="mt-8 flex max-w-2xl flex-col gap-2 rounded-lg bg-white p-2 text-sm text-neutral-800 shadow-xl @xl:flex-row">
              <span className="flex-1 rounded-md bg-neutral-100 px-3 py-2.5 text-neutral-500">Byt, dům, pozemek…</span>
              <span className="flex-1 rounded-md bg-neutral-100 px-3 py-2.5 text-neutral-500">Lokalita</span>
              <BrandButton onClick={() => navigate({ page: 'listings' })}>Hledat</BrandButton>
            </div>
          </Container>
        </section>
      )

    case 'featured':
      return (
        <section className="py-14 @3xl:py-20">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <Heading eyebrow="Nabídka">Vybrané nemovitosti</Heading>
              <button
                type="button"
                onClick={() => navigate({ page: 'listings' })}
                className="mb-7 hidden text-sm font-semibold text-[var(--mb)] @xl:block"
              >
                Celá nabídka →
              </button>
            </div>
            <div className="grid gap-5 @xl:grid-cols-2 @3xl:grid-cols-3">
              {LISTINGS.slice(0, 3).map((l) => (
                <ListingCard key={l.slug} listing={l} navigate={navigate} />
              ))}
            </div>
          </Container>
        </section>
      )

    case 'services':
      return (
        <section className="bg-[var(--mb-soft)] py-14 @3xl:py-20">
          <Container>
            <Heading eyebrow="Služby">S čím vám pomůžeme</Heading>
            <div className="grid gap-4 @xl:grid-cols-2 @3xl:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.title} className="rounded-lg bg-white p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-[var(--mb)] text-white">
                    <Icon name={s.icon} />
                  </span>
                  <p className="mt-4 font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm text-neutral-600">{s.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'agent':
      return (
        <section className="py-14 @3xl:py-20">
          <Container className="grid items-center gap-8 @3xl:grid-cols-[320px_1fr] @3xl:gap-14">
            <div className="mx-auto aspect-[4/5] w-56 overflow-hidden rounded-lg @3xl:w-full">
              <Photo kind="person" seed={5} />
            </div>
            <div>
              <Heading eyebrow="O nás">{copy.aboutTitle}</Heading>
              <p className="max-w-xl leading-relaxed text-neutral-600">{copy.about(brand)}</p>
              <p className="mt-5 text-sm font-semibold">+420 777 123 456 · info@{slug(brand)}.cz</p>
            </div>
          </Container>
        </section>
      )

    case 'stats':
      return (
        <section className="bg-[var(--mb)] py-12 text-white">
          <Container className="grid grid-cols-3 gap-4 text-center">
            {[
              ['120+', 'prodaných nemovitostí'],
              ['15 let', 'na trhu'],
              ['4,9 / 5', 'hodnocení klientů'],
            ].map(([n, label]) => (
              <div key={label}>
                <p className="text-2xl font-semibold @3xl:text-4xl">{n}</p>
                <p className="mt-1 text-xs text-white/75 @3xl:text-sm">{label}</p>
              </div>
            ))}
          </Container>
        </section>
      )

    case 'contact':
      return (
        <section className="py-14 @3xl:py-20">
          <Container className="grid gap-8 @3xl:grid-cols-2 @3xl:gap-14">
            <div>
              <Heading eyebrow="Kontakt">{copy.ctaTitle}</Heading>
              <p className="text-neutral-600">{copy.ctaText}</p>
            </div>
            <ContactForm button={copy.contactButton} />
          </Container>
        </section>
      )

    case 'blog':
      if (!blog) return null
      return (
        <section className="border-t border-neutral-200 py-14 @3xl:py-20">
          <Container>
            <Heading eyebrow="Blog">Rady a novinky</Heading>
            <div className="grid gap-5 @3xl:grid-cols-3">
              {POSTS.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => navigate({ page: 'post', slug: p.slug })}
                  className="group text-left"
                >
                  <div className="aspect-[16/10] overflow-hidden rounded-lg">
                    <Photo kind="interior" seed={p.seed} className="transition duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">{p.date}</p>
                  <p className="mt-1 font-semibold group-hover:text-[var(--mb)]">{p.title}</p>
                </button>
              ))}
            </div>
          </Container>
        </section>
      )

    default:
      return null
  }
}

export function slug(text: string): string {
  return (
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 30) || 'vasekancelar'
  )
}
