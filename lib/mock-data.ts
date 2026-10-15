/**
 * Sample content for the mock site. Mirrors the demo tenant's listings so the
 * mock and the real demo site tell the same story.
 */
export type PhotoKind = 'flat' | 'house' | 'land' | 'interior' | 'person' | 'city'
export type Penb = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'

export interface MockListing {
  slug: string
  title: string
  location: string
  price: number
  rent?: boolean
  area: number
  disposition?: string
  floor?: string
  condition: string
  ownership: string
  /** Null for a plot — no building, no energy certificate. */
  penb: Penb | null
  kind: PhotoKind
  seed: number
  description: string
}

export const LISTINGS: MockListing[] = [
  {
    slug: 'byt-3kk-praha-7',
    title: 'Byt 3+kk s balkonem',
    location: 'Praha 7 – Holešovice',
    price: 8_450_000,
    area: 78,
    disposition: '3+kk',
    floor: '4. z 6',
    condition: 'Po rekonstrukci',
    ownership: 'Osobní',
    penb: 'C',
    kind: 'flat',
    seed: 1,
    description:
      'Světlý byt v cihlovém domě pět minut od Letenských sadů. Kuchyň propojená s obývacím pokojem, dvě oddělené ložnice a balkon do klidného dvora.',
  },
  {
    slug: 'dum-5-1-brno-lisen',
    title: 'Rodinný dům 5+1 se zahradou',
    location: 'Brno – Líšeň',
    price: 12_900_000,
    area: 182,
    disposition: '5+1',
    floor: '2 podlaží',
    condition: 'Velmi dobrý',
    ownership: 'Osobní',
    penb: 'B',
    kind: 'house',
    seed: 2,
    description:
      'Prostorný dům na okraji Brna se zahradou 640 m², dvojgaráží a tepelným čerpadlem. Škola i školka v docházkové vzdálenosti.',
  },
  {
    slug: 'byt-2kk-praha-10',
    title: 'Pronájem bytu 2+kk',
    location: 'Praha 10 – Vršovice',
    price: 24_500,
    rent: true,
    area: 54,
    disposition: '2+kk',
    floor: '2. z 5',
    condition: 'Novostavba',
    ownership: 'Osobní',
    penb: 'B',
    kind: 'interior',
    seed: 3,
    description: 'Zařízený byt v novostavbě u Krymské. Sklep, výtah, k dispozici od příštího měsíce.',
  },
  {
    slug: 'pozemek-ricany',
    title: 'Stavební pozemek',
    location: 'Říčany',
    price: 6_200_000,
    area: 1240,
    condition: 'Zasíťovaný',
    ownership: 'Osobní',
    penb: null,
    kind: 'land',
    seed: 4,
    description: 'Rovinatý pozemek v nové zástavbě se všemi sítěmi na hranici. Územní rozhodnutí pro rodinný dům.',
  },
  {
    slug: 'byt-4-1-ostrava',
    title: 'Byt 4+1 s lodžií',
    location: 'Ostrava – Poruba',
    price: 4_350_000,
    area: 96,
    disposition: '4+1',
    floor: '7. z 8',
    condition: 'Původní stav',
    ownership: 'Družstevní',
    penb: 'E',
    kind: 'city',
    seed: 5,
    description: 'Velkometrážní byt s lodžií a výhledem na Beskydy. Ideální pro rodinu, která si ho zařídí po svém.',
  },
  {
    slug: 'dum-4kk-plzen',
    title: 'Moderní dům 4+kk',
    location: 'Plzeň – Bory',
    price: 9_800_000,
    area: 132,
    disposition: '4+kk',
    floor: '1 podlaží',
    condition: 'Novostavba',
    ownership: 'Osobní',
    penb: 'A',
    kind: 'house',
    seed: 6,
    description: 'Úsporný bungalov z roku 2024 s fotovoltaikou, rekuperací a terasou na jih.',
  },
]

export interface MockPost {
  slug: string
  title: string
  excerpt: string
  date: string
  seed: number
}

export const POSTS: MockPost[] = [
  {
    slug: 'jak-pripravit-byt-na-prodej',
    title: 'Jak připravit byt na prodej',
    excerpt: 'Pět drobností, které zvednou cenu víc než nová kuchyň.',
    date: '2. října 2026',
    seed: 7,
  },
  {
    slug: 'energeticky-stitek-penb',
    title: 'Energetický štítek: kdy ho potřebujete',
    excerpt: 'Bez PENB nemovitost legálně neinzerujete. Co stojí a jak dlouho platí.',
    date: '18. září 2026',
    seed: 8,
  },
  {
    slug: 'hypoteky-2027',
    title: 'Hypotéky v roce 2027: co čekat',
    excerpt: 'Sazby, LTV a co dělat, když vám končí fixace.',
    date: '4. září 2026',
    seed: 9,
  },
]

export const SERVICES = [
  { icon: 'key', title: 'Prodej', text: 'Od ocenění po předání klíčů.' },
  { icon: 'home', title: 'Pronájem', text: 'Prověříme nájemníky, připravíme smlouvu.' },
  { icon: 'chart', title: 'Ocenění', text: 'Tržní cena podle skutečných prodejů v okolí.' },
  { icon: 'doc', title: 'Právní servis', text: 'Kupní smlouvy a úschova přes advokáta.' },
] as const

const czk = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 0 })

export function formatPrice(l: Pick<MockListing, 'price' | 'rent'>): string {
  return `${czk.format(l.price)} Kč${l.rent ? '/měsíc' : ''}`
}

export function formatNumber(n: number): string {
  return czk.format(n)
}
