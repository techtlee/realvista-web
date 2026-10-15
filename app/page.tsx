import { Configurator } from '@/components/configurator/Configurator'
import { Benefits } from '@/components/landing/Benefits'
import { Faq } from '@/components/landing/Faq'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { getCatalog } from '@/lib/catalog'

/** Matches the CMS's own cache header on /api/themes. */
export const revalidate = 300

export default async function Home() {
  const catalog = await getCatalog()

  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        {/* Product name is still undecided — see PROJECT-BRIEF "Open questions". */}
        <a href="/" className="font-display text-xl font-semibold tracking-tight">
          Makléři
        </a>
        <a href="#konfigurator" className="text-sm font-medium underline-offset-4 hover:underline">
          Nastavit web
        </a>
      </header>

      <main>
        <Hero catalog={catalog} />
        <HowItWorks />

        <section id="konfigurator" className="scroll-mt-4 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Nastavte si svůj web</h2>
            <p className="mt-3 text-lg text-ink-soft">
              Čtyři kroky. Náhled vpravo je skutečný web, jen s ukázkovými nemovitostmi.
            </p>
          </div>
          {catalog ? (
            <Configurator catalog={catalog} />
          ) : (
            <div className="rounded-2xl border border-line bg-white p-8 text-center">
              <p className="font-medium">Konfigurátor je teď nedostupný.</p>
              <p className="mt-2 text-ink-soft">Zkuste to prosím za chvíli, nebo nám napište e-mail.</p>
            </div>
          )}
        </section>

        <Benefits />
        <Faq />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-ink-soft sm:px-6">
          <span>© {new Date().getFullYear()} Makléři</span>
          {/* The privacy page is required before launch — the consent text must link to it. */}
          <span>Zásady ochrany osobních údajů připravujeme</span>
        </div>
      </footer>
    </>
  )
}
