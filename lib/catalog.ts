/**
 * The templates on sale, as the configurator offers them.
 *
 * Static on purpose: the storefront stands alone and needs nothing running to
 * build or serve. The values are copied verbatim from the theme
 * (platform/packages/theme-realvista: `src/manifest.ts` for the colourways and
 * home sections, `styles/theme.css` for the tokens). When the theme changes,
 * update this file too — the backend validates against the theme and will
 * reject a value offered here that the theme does not have.
 */

/**
 * A colourway's full token set — not just a hue. The colourways differ in
 * structure: indigo puts dark type on a pale wash over the hero photo, crimson
 * a saturated gradient with white type, clay and mono a dark scrim. The mock
 * site applies these as `--rv-*` custom properties, exactly as the theme does.
 */
export interface ThemeTokens {
  brand: string
  page: string
  accent: string
  muted: string
  card: string
  heroInk: string
  footerInk: string
  shadowCard: string
  heroOverlay: string
  bandA: string
  bandB: string
  promo: string
}

export interface CatalogVariant {
  value: string
  label: string
  /** Brand colour, for swatches. */
  swatch: string
  tokens: ThemeTokens
}

export interface CatalogTheme {
  name: string
  label: string
  /** The first is the default. */
  variants: CatalogVariant[]
  /** Home section ids in the theme's default order. */
  homeSections: string[]
}

export type Catalog = readonly CatalogTheme[]

const indigo: ThemeTokens = {
  brand: '#0d0053',
  page: '#f9f9ff',
  accent: '#d5e0ee',
  muted: '#8883a4',
  card: '#ffffff',
  heroInk: '#0d0053',
  footerInk: '#d5e0ee',
  shadowCard: '10px 17px 99.1px #ededf8',
  heroOverlay: 'linear-gradient(94.83deg, #d5e0ee 11.42%, rgba(255, 255, 255, 0) 61.59%)',
  bandA: 'linear-gradient(270deg, #d5e0ee 4.83%, #0c0053 121.63%)',
  bandB: 'linear-gradient(90deg, #d5e0ee -21.63%, #0c0053 95.17%)',
  promo: 'linear-gradient(324.1deg, #0d0053 21%, #a8adcb 118.08%)',
}

const crimson: ThemeTokens = {
  brand: '#ad0c14',
  page: '#ffffff',
  accent: '#eee7d5',
  muted: '#e46666',
  card: '#ffffff',
  heroInk: '#ffffff',
  footerInk: '#eee7d5',
  shadowCard: '10px 17px 99.1px #f0eeec',
  heroOverlay: 'linear-gradient(270deg, #ad0c14 4.83%, #fd7b54 121.63%)',
  bandA: 'linear-gradient(270deg, #ad0c14 4.83%, #fd7b54 121.63%)',
  bandB: 'linear-gradient(90deg, #ad0c14 -21.63%, #fd7b54 95.17%)',
  promo: 'linear-gradient(324.1deg, #ad0c14 21%, #fd7b54 118.08%)',
}

const clay: ThemeTokens = {
  brand: '#1c130d',
  page: '#ffffff',
  accent: '#eee7d5',
  muted: '#a48d83',
  card: '#ffffff',
  heroInk: '#ffffff',
  footerInk: '#eee7d5',
  shadowCard: '10px 17px 99.1px #f0eeec',
  heroOverlay: 'linear-gradient(90deg, rgba(0, 0, 0, 0.62) 0%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0) 100%)',
  bandA: 'linear-gradient(270deg, #885e36 4.83%, #1c130d 121.63%)',
  bandB: 'linear-gradient(90deg, #885e36 -21.63%, #1c130d 95.17%)',
  promo: 'linear-gradient(324.1deg, #1c130d 21%, #885e36 118.08%)',
}

const mono: ThemeTokens = {
  brand: '#111111',
  page: '#ffffff',
  accent: '#e8e8e8',
  muted: '#8a8a8a',
  card: '#ffffff',
  heroInk: '#ffffff',
  footerInk: '#e8e8e8',
  shadowCard: '10px 17px 99.1px #eeeeee',
  heroOverlay: 'linear-gradient(90deg, rgba(0, 0, 0, 0.66) 0%, rgba(0, 0, 0, 0.18) 60%, rgba(0, 0, 0, 0) 100%)',
  bandA: 'linear-gradient(270deg, #6e6e6e 4.83%, #111111 121.63%)',
  bandB: 'linear-gradient(90deg, #6e6e6e -21.63%, #111111 95.17%)',
  promo: 'linear-gradient(324.1deg, #111111 21%, #8a8a8a 118.08%)',
}

export const catalog: Catalog = [
  {
    name: 'realvista',
    label: 'REALVISTA',
    variants: [
      { value: 'indigo', label: 'Indigová', swatch: indigo.brand, tokens: indigo },
      { value: 'crimson', label: 'Červená', swatch: crimson.brand, tokens: crimson },
      { value: 'clay', label: 'Hnědá', swatch: clay.brand, tokens: clay },
      { value: 'mono', label: 'Černobílá', swatch: mono.brand, tokens: mono },
    ],
    homeSections: ['hero', 'featured', 'services', 'agent', 'stats', 'contact', 'blog'],
  },
]
