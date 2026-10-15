export type MockRoute =
  | { page: 'home' }
  | { page: 'listings' }
  | { page: 'detail'; slug: string }
  | { page: 'blog' }
  | { page: 'post'; slug: string }

export type Navigate = (route: MockRoute, section?: string) => void

/** The path the address bar shows, matching the real site's routes. */
export function routePath(route: MockRoute): string {
  switch (route.page) {
    case 'home':
      return '/'
    case 'listings':
      return '/nemovitosti'
    case 'detail':
      return `/nemovitosti/${route.slug}`
    case 'blog':
      return '/blog'
    case 'post':
      return `/blog/${route.slug}`
  }
}
