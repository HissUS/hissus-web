import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// Runs during the static build, using existing React/Vite dependencies only.
const cache = resolve('node_modules/.cache/hissus-ssr')
await build({
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir: cache, emptyOutDir: true, copyPublicDir: false },
})
const { renderPage, getPrerenderUrls, getPageSeo, renderSeoHead, escapeMarkup } = await import(
  pathToFileURL(resolve(cache, 'entry-server.js')).href
)
const preview =
  process.env.VITE_SEO_PREVIEW === 'true' ||
  (!!process.env.CONTEXT && process.env.CONTEXT !== 'production')
const template = readFileSync('dist/index.html', 'utf8')
mkdirSync('dist/_prerender', { recursive: true })
const pages = []
const canonicalPages = new Map()
for (const url of [...getPrerenderUrls(), '/factory/about', '/tw/factory/about']) {
  const alias = url.endsWith('/factory/about')
  const renderUrl = alias ? url.replace('/factory/about', '/factory/home') : url
  const seo = getPageSeo(renderUrl, preview || alias)
  let html = await renderPage(renderUrl)
  let preload = ''
  html = html.replace(/^((?:<link\b[^>]*\/>)+)/, (_, links) => {
    preload = links
    return ''
  })
  const document = template
    .replace('<html lang="en">', `<html lang="${seo.locale}">`)
    .replace(/<title>[\s\S]*?<\/title>/, preload + renderSeoHead(renderUrl, preview || alias))
    .replace('<div id="root"></div>', `<div id="root" data-prerender="true">${html}</div>`)
  const location = new URL(url, 'https://hissus.com')
  const filename =
    location.pathname.slice(1).replaceAll('/', '-') +
    (location.searchParams.has('tab') ? `-${location.searchParams.get('tab')}` : '') +
    '.html'
  const file = `_prerender/${filename}`
  writeFileSync(`dist/${file}`, document)
  const status = url.endsWith('/not-found') ? 404 : 200
  pages.push({ url, file, status, indexable: seo.indexable, canonical: seo.canonical })
  if (seo.indexable) canonicalPages.set(seo.canonical, seo)
  if (url === '/not-found') writeFileSync('dist/404.html', document)
}
writeFileSync('dist/seo-manifest.json', JSON.stringify({ preview, pages }, null, 2))
const xmlUrls = [...canonicalPages]
  .map(
    ([url, seo]) =>
      `  <url><loc>${escapeMarkup(url)}</loc>${seo.alternates
        .map(
          ({ lang, href }) =>
            `<xhtml:link rel="alternate" hreflang="${lang}" href="${escapeMarkup(href)}"/>`,
        )
        .join('')}</url>`,
  )
  .join('\n')
writeFileSync(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${xmlUrls}\n</urlset>\n`,
)
writeFileSync(
  'dist/robots.txt',
  'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /.netlify/\nDisallow: /_prerender/\n' +
    (preview ? '' : 'Sitemap: https://hissus.com/sitemap.xml\n'),
)
writeFileSync(
  'dist/_headers',
  (preview ? '/*\n  X-Robots-Tag: noindex, nofollow\n' : '') +
    ['/login', '/tw/login', '/console', '/tw/console', '/404.html', '/seo-manifest.json']
      .map((path) => `${path}\n  X-Robots-Tag: noindex, follow\n`)
      .join(''),
)
console.log(
  `Prerendered ${pages.length} routes; ${canonicalPages.size} canonical sitemap URLs; preview noindex: ${preview}.`,
)
