import { AGENT, LISTINGS, POSTS, regionCounts, SERVICES, TOTAL_LISTINGS } from '@/lib/mock-data'
import type { ToneCopy } from '@/lib/tone-copy'

import { Header } from './Header'
import { Container, ContactSection, GhostButton, Icon, MorePropertiesCard, PostCard, PropertyCard, RegionChip, SolidButton } from './parts'
import { Photo } from './Photo'
import type { MockRoute, Navigate } from './types'

interface Props {
  sections: string[]
  brand: string
  tagline: string
  email: string
  copy: ToneCopy
  blog: boolean
  highlight: string | null
  route: MockRoute
  navigate: Navigate
}

/**
 * RealvistaHome, in exactly the section order the realtor chose.
 *
 * The theme carries its header inside the hero, and when the hero is not
 * first it appends a second header after every section — at the bottom of
 * the page. The mock does what the theme means: the header is always at the
 * top, overlaid on the hero only when the hero opens the page.
 */
export function Home({ sections, highlight, ...props }: Props) {
  const heroFirst = sections[0] === 'hero'
  return (
    <>
      {!heroFirst && (
        <Header name={props.brand} overlay={false} blog={props.blog} route={props.route} navigate={props.navigate} />
      )}
      {sections.map((id, i) => (
        <div
          key={id}
          data-mock-section={id}
          className={`transition-[box-shadow] duration-500 ${
            highlight === id ? 'relative z-10 shadow-[inset_0_0_0_4px_var(--rv-brand),0_0_0_9999px_rgba(255,255,255,0.4)]' : ''
          }`}
        >
          <Section id={id} withHeader={id === 'hero' && i === 0} {...props} />
        </div>
      ))}
    </>
  )
}

function Section({
  id,
  withHeader,
  brand,
  tagline,
  email,
  copy,
  blog,
  route,
  navigate,
}: Omit<Props, 'sections' | 'highlight'> & { id: string; withHeader: boolean }) {
  switch (id) {
    case 'hero':
      return (
        <section className="relative isolate h-[700px] overflow-hidden">
          <div className="absolute inset-0">
            <Photo kind="house" seed={2} />
          </div>
          <div className="rv-hero-overlay absolute inset-0" />
          {withHeader && <Header name={brand} overlay blog={blog} route={route} navigate={navigate} />}
          <Container className="relative flex h-full flex-col justify-center">
            <h1 className="max-w-[689px] text-[40px] font-medium leading-[1.12] text-rv-hero-ink @2xl:text-[60px] @2xl:leading-[67px]">
              {copy.heroTitle}
            </h1>
            <p className="mt-10 max-w-[530px] text-[22px] font-medium leading-[1.2] text-rv-hero-ink @2xl:text-[30px] @2xl:leading-[36px]">
              {tagline || copy.heroSub}
            </p>
          </Container>
        </section>
      )

    case 'featured': {
      const grid = LISTINGS.slice(0, 5)
      return (
        <section className="pt-[150px]">
          <Container>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h2 className="text-[30px] font-medium leading-[36px] text-rv-brand">Nabídka našich nemovitostí</h2>
                <p className="rv-track mt-4 text-[16px] leading-[20px] text-rv-brand">Vyberte si svůj nový domov.</p>
              </div>
              <SolidButton onClick={() => navigate({ page: 'listings' })} className="min-w-[200px]">
                Zobrazit více
              </SolidButton>
            </div>
            <div className="-mx-5 mt-[50px] flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] @2xl:mx-0 @2xl:px-0">
              {regionCounts().map((r) => (
                <RegionChip key={r.label} label={r.label} count={r.count} onClick={() => navigate({ page: 'listings' })} />
              ))}
            </div>
            <div className="mt-[30px] grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
              {grid.map((l) => (
                <PropertyCard key={l.slug} listing={l} navigate={navigate} />
              ))}
              <MorePropertiesCard count={TOTAL_LISTINGS - grid.length} onClick={() => navigate({ page: 'listings' })} />
            </div>
          </Container>
        </section>
      )
    }

    case 'services':
      return (
        <section className="pt-[150px]">
          <Container>
            <h2 className="text-[30px] font-medium leading-[36px] text-rv-brand">{copy.servicesTitle}</h2>
            <p className="rv-track mt-4 max-w-[520px] text-[16px] leading-[20px] text-rv-brand">{copy.servicesLead}</p>
            <div className="mt-[50px] grid gap-5 @2xl:grid-cols-2 @7xl:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.title} className="bg-rv-card p-[30px] shadow-rv-card">
                  <span className="text-rv-brand">
                    <Icon name={s.icon} />
                  </span>
                  <p className="mt-6 text-[16px] font-bold leading-[20px] text-rv-brand">{s.title}</p>
                  <p className="rv-track mt-3 text-[16px] leading-[22px] text-rv-muted">{s.text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )

    case 'agent':
      return (
        <section className="rv-band-a relative mt-[150px] py-[55px]">
          <Container className="grid items-center gap-10 @5xl:grid-cols-[1fr_420px]">
            <div className="@5xl:pl-[110px]">
              <h2 className="max-w-[530px] text-[30px] font-medium leading-[36px] text-white">{copy.agentHeading}</h2>
              <p className="rv-track mt-5 max-w-[640px] text-[16px] leading-[22px] text-white">{copy.about(brand)}</p>
              <p className="rv-track mt-3 text-[16px] leading-[22px] text-white">
                {AGENT.name} — {AGENT.jobTitle}.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <GhostButton>{AGENT.phone}</GhostButton>
              </div>
            </div>
            <div className="mx-auto h-[459px] w-full max-w-[420px] overflow-hidden">
              <Photo kind="person" seed={5} />
            </div>
          </Container>
        </section>
      )

    case 'stats':
      return (
        <section className="rv-band-b py-[72px]">
          <Container>
            <dl className="grid gap-12 text-center @2xl:grid-cols-3">
              {[
                ['120+', 'prodaných nemovitostí'],
                ['15 let', 'na trhu'],
                ['4,9', 'hodnocení klientů'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-[60px] font-medium leading-[67px] text-white">{value}</dt>
                  <dd className="mt-4 text-[30px] font-medium leading-[36px] text-white">{label}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      )

    case 'contact':
      return <ContactSection title={copy.ctaTitle} button={copy.contactButton} email={email} />

    case 'blog':
      if (!blog) return null
      return (
        <section className="pb-[150px] pt-[150px]">
          <Container>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <h2 className="text-[30px] font-medium leading-[36px] text-rv-brand">Vědomosti a praxe</h2>
                <p className="rv-track mt-4 max-w-[520px] text-[16px] leading-[20px] text-rv-brand">
                  Pravidelně sdílím své zkušenosti, hloubkové analýzy a praktické tipy.
                </p>
              </div>
              <SolidButton onClick={() => navigate({ page: 'blog' })} className="min-w-[200px]">
                Přejít na blog
              </SolidButton>
            </div>
            <div className="mt-[60px] grid gap-5 @3xl:grid-cols-2 @7xl:grid-cols-3">
              {POSTS.map((p) => (
                <PostCard key={p.slug} post={p} navigate={navigate} />
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
