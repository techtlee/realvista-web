import type { Catalog } from '@/lib/catalog'

import { Wireframe } from '../configurator/Wireframe'

/**
 * The hero's visual is the product itself: one layout fanned out in every
 * colourway on sale, read from the catalog. A new colourway appears here
 * without anyone touching this file.
 */
export function Hero({ catalog }: { catalog: Catalog }) {
  const theme = catalog?.[0]
  const variants = theme?.variants.slice(0, 4) ?? []

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Weby pro realitní makléře
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Váš realitní web.
            <br />
            <span className="text-ink-soft">Poskládaný za pět minut.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Vyberte šablonu, barvy a sekce a rovnou uvidíte, jak bude web vypadat. My ho spustíme na vaší doméně a
            nabídky si pak spravujete sami — česky a bez programátora.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#konfigurator" className="btn-primary px-7 py-3.5 text-base">
              Nastavit svůj web
            </a>
            <a href="#jak-to-funguje" className="btn-ghost">
              Jak to funguje
            </a>
          </div>
        </div>

        {theme && variants.length > 0 && (
          <div className="relative mx-auto h-[22rem] w-full max-w-md sm:h-[26rem]" aria-hidden>
            {variants.map((v, i) => {
              const offset = i - (variants.length - 1) / 2
              return (
                <div
                  key={v.value}
                  className="absolute left-1/2 top-1/2 h-[19rem] w-[15rem] overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(20,20,40,0.45)] sm:h-[22rem] sm:w-[17rem]"
                  style={{
                    transform: `translate(-50%, -50%) translateX(${offset * 58}px) rotate(${offset * 5}deg)`,
                    zIndex: i,
                  }}
                >
                  <Wireframe
                    sections={theme.homeSections.slice(0, 4)}
                    color={v.swatch ?? '#222'}
                    brand={theme.label}
                    compact
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
