import en from '@/locales/en.json'
import zhTW from '@/locales/zh-TW.json'
import { SITE_CONFIG } from '@/config/site'
import { CATALOG_DATA } from '@/features/homepage/constants/catalog'
import { FACTORY_PHOTOS } from '@/features/homepage/constants/factoryPhotos'
import { getAssetUrl } from './utils'

export const SITE_ORIGIN = 'https://hissus.com'
export const PUBLIC_PAGES = [
  { path: '/factory/home', key: 'home', label: 'nav.home' },
  { path: '/factory/services', key: 'services', label: 'nav.servicesShort' },
  { path: '/factory/contact', key: 'contact', label: 'nav.contact' },
  { path: '/windows/home', key: 'screens', label: 'nav.home' },
  { path: '/windows/products', key: 'products', label: 'nav.products' },
  { path: '/windows/quote', key: 'quote', label: 'nav.quote' },
] as const
type Dictionary = { [key: string]: string | Dictionary }
const text = (dictionary: Dictionary, key: string): string => {
  const result = key
    .split('.')
    .reduce<string | Dictionary>(
      (value, part) => (typeof value === 'string' ? '' : (value[part] ?? '')),
      dictionary,
    )
  return typeof result === 'string' ? result : ''
}
export const escapeMarkup = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )

export function getPageSeo(url: string, preview = false) {
  const location = new URL(url, SITE_ORIGIN)
  const locale = location.pathname.startsWith('/tw/') ? 'zh-TW' : 'en'
  const prefix = locale === 'zh-TW' ? '/tw' : ''
  const path = location.pathname.replace(/^\/tw(?=\/|$)/, '').replace(/\/$/, '') || '/'
  const dictionary = (locale === 'en' ? en : zhTW) as unknown as Dictionary
  const page = PUBLIC_PAGES.find((candidate) => candidate.path === path)
  const privateKey = path === '/login' ? 'login' : path === '/console' ? 'console' : undefined
  const product =
    path === '/windows/products'
      ? (CATALOG_DATA.find((category) => category.id === location.searchParams.get('tab')) ??
        CATALOG_DATA[0])
      : undefined
  const key = product
    ? `productVariants.${product.nameKey.replace('products.', '')}`
    : (page?.key ?? privateKey)
  const title = key
    ? text(dictionary, `company.metadata.${key}.title`)
    : text(dictionary, 'company.notFoundTitle')
  const description = key
    ? text(dictionary, `company.metadata.${key}.desc`)
    : text(dictionary, 'company.notFoundDesc')
  // The default product duplicates the unfiltered catalog; use one canonical URL.
  const query = product && product.id !== CATALOG_DATA[0].id ? `?tab=${product.id}` : ''
  const canonical = key ? `${SITE_ORIGIN}${prefix}${path}${query}` : undefined
  const factory = path.startsWith('/factory/')
  const imageSource =
    product?.images[0]?.src ??
    (factory
      ? FACTORY_PHOTOS.find((photo) => photo.id === '1801')!.src
      : SITE_CONFIG.assets.heroImage)
  const image = new URL(getAssetUrl(imageSource), SITE_ORIGIN).href
  const imageAlt = product
    ? text(dictionary, product.images[0].altKey)
    : factory
      ? text(dictionary, 'company.photos.1801')
      : text(dictionary, 'homepage.hero.title')
  const alternates = page
    ? [
        ['en', ''],
        ['zh-TW', '/tw'],
        ['x-default', ''],
      ].map(([lang, country]) => ({ lang, href: `${SITE_ORIGIN}${country}${path}${query}` }))
    : []
  const graph: Record<string, unknown>[] = []
  if (page && canonical) {
    const organizationId = `${SITE_ORIGIN}/#organization`
    graph.push({
      '@type': ['Organization', 'LocalBusiness'],
      '@id': organizationId,
      name: SITE_CONFIG.name,
      alternateName: 'HISS US',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/logo.png`,
      telephone: SITE_CONFIG.contact.phone,
      email: SITE_CONFIG.contact.email,
      address: { '@type': 'PostalAddress', ...SITE_CONFIG.contact.address.postal },
      sameAs: [SITE_CONFIG.contact.facebook.href],
    })
    graph.push({
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: locale,
      about: { '@id': organizationId },
    })
    const home = `${SITE_ORIGIN}${prefix}/${factory ? 'factory' : 'windows'}/home`
    if (!path.endsWith('/home')) {
      const items = [
        { name: text(dictionary, 'nav.home'), item: home },
        { name: text(dictionary, page.label), item: `${SITE_ORIGIN}${prefix}${path}` },
        ...(product ? [{ name: text(dictionary, product.nameKey), item: canonical }] : []),
      ]
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumbs`,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...item,
        })),
      })
    }
    if (path === '/factory/services') {
      for (const service of ['site', 'permits', 'design', 'construction', 'operations', 'people'])
        graph.push({
          '@type': 'Service',
          '@id': `${canonical}#${service}`,
          name: text(dictionary, `company.coordination.services.${service}.title`),
          description: text(dictionary, `company.coordination.services.${service}.desc`),
          url: canonical,
          provider: { '@id': organizationId },
        })
    }
    if (path === '/windows/products')
      graph.push({
        '@type': 'ItemList',
        name: text(dictionary, 'products.title'),
        itemListElement: (product ? [product] : CATALOG_DATA).map((category, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: text(dictionary, category.nameKey),
          url: `${SITE_ORIGIN}${prefix}/windows/products?tab=${category.id}`,
        })),
      })
  }
  return {
    title,
    description,
    locale,
    canonical,
    image,
    imageAlt,
    alternates,
    robots: page && !preview ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    structuredData: graph.length
      ? { '@context': 'https://schema.org', '@graph': graph }
      : undefined,
    indexable: !!page && !preview,
  }
}

export function getPrerenderUrls() {
  return ['', '/tw'].flatMap((prefix) => [
    ...PUBLIC_PAGES.map((page) => `${prefix}${page.path}`),
    ...CATALOG_DATA.map((category) => `${prefix}/windows/products?tab=${category.id}`),
    `${prefix}/login`,
    `${prefix}/console`,
    `${prefix}/not-found`,
    `${prefix}/windows/not-found`,
  ])
}

export function renderSeoHead(url: string, preview = false) {
  const seo = getPageSeo(url, preview)
  const meta = (name: string, content: string, property = false) =>
    `<meta ${property ? 'property' : 'name'}="${name}" content="${escapeMarkup(content)}" data-hissus-seo>`
  return (
    `<title>${escapeMarkup(seo.title)}</title>\n` +
    [
      meta('description', seo.description),
      meta('robots', seo.robots),
      ...(seo.canonical
        ? [`<link rel="canonical" href="${escapeMarkup(seo.canonical)}" data-hissus-seo>`]
        : []),
      ...seo.alternates.map(
        ({ lang, href }) =>
          `<link rel="alternate" hreflang="${lang}" href="${escapeMarkup(href)}" data-hissus-locale>`,
      ),
      meta('og:type', 'website', true),
      meta('og:site_name', SITE_CONFIG.name, true),
      meta('og:title', seo.title, true),
      meta('og:description', seo.description, true),
      ...(seo.canonical ? [meta('og:url', seo.canonical, true)] : []),
      meta('og:locale', seo.locale === 'en' ? 'en_US' : 'zh_TW', true),
      meta('og:locale:alternate', seo.locale === 'en' ? 'zh_TW' : 'en_US', true),
      meta('og:image', seo.image, true),
      meta('og:image:alt', seo.imageAlt, true),
      meta('twitter:card', 'summary_large_image'),
      meta('twitter:title', seo.title),
      meta('twitter:description', seo.description),
      meta('twitter:image', seo.image),
      meta('twitter:image:alt', seo.imageAlt),
      ...(seo.structuredData
        ? [
            `<script type="application/ld+json" data-hissus-seo>${JSON.stringify(seo.structuredData).replaceAll('<', '\\u003c')}</script>`,
          ]
        : []),
    ].join('\n')
  )
}
