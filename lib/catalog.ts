/**
 * The templates on sale, as the configurator offers them.
 *
 * Static on purpose: the storefront stands alone and needs nothing running to
 * build or serve. The values are copied from the theme manifests
 * (platform/packages/theme-realvista/src/manifest.ts — `variants` and
 * `sections.home`). When a theme gains a colourway or a home section, update
 * this file too; the backend validates against the manifests and will reject
 * a value this list offers but the theme does not have.
 */
export interface CatalogVariant {
  value: string
  label: string
  /** Brand colour, for swatches and the mock site. */
  swatch: string
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

export const catalog: Catalog = [
  {
    name: 'realvista',
    label: 'REALVISTA',
    variants: [
      { value: 'indigo', label: 'Indigová', swatch: '#0d0053' },
      { value: 'crimson', label: 'Červená', swatch: '#ad0c14' },
      { value: 'clay', label: 'Hnědá', swatch: '#1c130d' },
      { value: 'mono', label: 'Černobílá', swatch: '#111111' },
    ],
    homeSections: ['hero', 'featured', 'services', 'agent', 'stats', 'contact', 'blog'],
  },
]
