/** Public business routes. English is unprefixed; other locales prepend their country. */
export const SITE_PATHS = {
  factory: {
    home: '/factory/home',
    services: '/factory/services',
    about: '/factory/about',
    contact: '/factory/contact',
  },
  windows: { home: '/windows/home', products: '/windows/products', quote: '/windows/quote' },
} as const

export const LEGACY_PATHS: Record<string, string> = {
  '/home': SITE_PATHS.factory.home,
  '/services': SITE_PATHS.factory.services,
  '/about': SITE_PATHS.factory.about,
  '/contact': SITE_PATHS.factory.contact,
  '/window-screen-solutions': SITE_PATHS.windows.home,
  '/products': SITE_PATHS.windows.products,
  '/get-a-quote': SITE_PATHS.windows.quote,
}

export function getSiteSection(pathname: string) {
  const path = pathname.replace(/^\/tw(?=\/|$)/, '')
  return path === '/windows' || path.startsWith('/windows/') ? 'windows' : 'factory'
}
