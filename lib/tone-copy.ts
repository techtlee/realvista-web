import type { Tone } from './draft'

/**
 * The mock site's copy in each tone of voice. This is how a realtor sees what
 * "formální / přátelský / věcný" means — on their own homepage, not in a
 * description of it.
 */
export interface ToneCopy {
  heroTitle: string
  heroSub: string
  servicesTitle: string
  servicesLead: string
  /** The agent band's statement headline. */
  agentHeading: string
  aboutTitle: string
  about: (brand: string) => string
  ctaTitle: string
  ctaText: string
  contactButton: string
}

export const TONE_COPY: Record<Tone, ToneCopy> = {
  formal: {
    heroTitle: 'Prodej a pronájem nemovitostí s plným servisem',
    heroSub: 'Zajistíme ocenění, prezentaci, prohlídky i právní servis.',
    servicesTitle: 'Co pro vás zajistíme',
    servicesLead: 'Komplexní služby od ocenění nemovitosti po podpis kupní smlouvy.',
    agentHeading: 'Každý obchod vedeme osobně, od první prohlídky po předání klíčů.',
    aboutTitle: 'O naší kanceláři',
    about: (b) =>
      `${b} poskytuje komplexní realitní služby od roku 2011. Zakládáme si na transparentnosti, přesném ocenění a osobním přístupu ke každému klientovi.`,
    ctaTitle: 'Máte zájem o konzultaci?',
    ctaText: 'Kontaktujte nás a domluvíme si nezávaznou schůzku.',
    contactButton: 'Odeslat dotaz',
  },
  friendly: {
    heroTitle: 'Najdeme vám místo, kde budete doma',
    heroSub: 'Postaráme se o všechno — vy si jen vyberete, kdy se stěhujete.',
    servicesTitle: 'S čím vám pomůžu',
    servicesLead: 'Ať prodáváte, nebo hledáte, provedu vás celým procesem.',
    agentHeading: 'Reality nejsou jen cihly. Jsou to vaše další životní kroky.',
    aboutTitle: 'Kdo jsme',
    about: (b) =>
      `Ahoj, jsme ${b}. Nemovitostem se věnujeme přes deset let a pořád nás baví vidět, jak si lidé zabydlují nové domovy. Ozvěte se, rádi pomůžeme.`,
    ctaTitle: 'Pojďme si promluvit',
    ctaText: 'Napište nám pár řádků, ozveme se ještě dnes.',
    contactButton: 'Napsat nám',
  },
  neutral: {
    heroTitle: 'Realitní služby v Praze a okolí',
    heroSub: 'Ocenění, prezentace, prohlídky, právní servis. Vše na jednom místě.',
    servicesTitle: 'Služby',
    servicesLead: 'Prodej, pronájem, ocenění, právní servis.',
    agentHeading: '15 let na trhu. 120+ prodaných nemovitostí.',
    aboutTitle: 'O nás',
    about: (b) =>
      `${b}: 15 let praxe, 120+ prodaných nemovitostí, hodnocení 4,9 z 5. Specializace na byty a rodinné domy.`,
    ctaTitle: 'Kontakt',
    ctaText: 'Vyplňte formulář, odpovíme do 24 hodin.',
    contactButton: 'Odeslat',
  },
}
