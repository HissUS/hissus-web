import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import seoEdge from '../netlify/edge-functions/seo.ts'

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
const origin = 'https://hissus.com'
const manifest = JSON.parse(readFileSync('dist/seo-manifest.json', 'utf8'))
const { getPageSeo, renderSeoHead } = await import(
  pathToFileURL(resolve('node_modules/.cache/hissus-ssr/entry-server.js'))
)
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--disable-dev-shm-usage'],
})
const page = await browser.newPage({ javaScriptEnabled: false })
// DOM inspection only; never contact email, video or verification providers.
await page.route('**/*', (route) => route.abort())
const canonicalPages = new Map()
const metadata = new Map()
const internalLinks = []
let checks = 0
try {
  assert.equal(manifest.pages.length, 30)
  for (const entry of manifest.pages) {
    const html = readFileSync(`dist/${entry.file}`, 'utf8')
    assert.ok(html.includes('data-prerender="true"'))
    assert.ok(!html.includes('<div id="root"></div>'))
    await page.setContent(html)
    assert.equal(await page.locator('h1').count(), 1, entry.url)
    assert.equal(
      await page.locator('html').getAttribute('lang'),
      entry.url.startsWith('/tw/') ? 'zh-TW' : 'en',
    )
    assert.equal(await page.locator('title').count(), 1)
    assert.equal(await page.locator('meta[name="description"]').count(), 1)
    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    assert.ok(title.length > 5 && description.length > 10, entry.url)
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    assert.equal(robots.startsWith('index'), entry.indexable)
    const canonical = (await page.locator('link[rel="canonical"]').count())
      ? await page.locator('link[rel="canonical"]').getAttribute('href')
      : undefined
    assert.equal(canonical, entry.canonical)
    assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), title)
    assert.equal(
      await page.locator('meta[name="twitter:description"]').getAttribute('content'),
      description,
    )
    if (entry.indexable) {
      assert.ok(canonical.startsWith(origin + '/'))
      const previous = metadata.get(canonical)
      if (previous) assert.deepEqual(previous, { title, description })
      else metadata.set(canonical, { title, description })
      canonicalPages.set(canonical, entry)
      const alternates = await page
        .locator('link[hreflang]')
        .evaluateAll((nodes) =>
          nodes.map((n) => ({ lang: n.hreflang, href: n.getAttribute('href') })),
        )
      assert.deepEqual(
        alternates.map((a) => a.lang),
        ['en', 'zh-TW', 'x-default'],
      )
      assert.ok(alternates.every((a) => a.href.startsWith(origin)))
      const graph = JSON.parse(
        await page.locator('script[type="application/ld+json"]').textContent(),
      )
      assert.equal(graph['@context'], 'https://schema.org')
      assert.ok(graph['@graph'].some((n) => n['@type'].includes('Organization')))
      assert.ok(graph['@graph'].some((n) => n['@type'] === 'WebPage' && n.url === canonical))
      const body = await page.locator('body').innerText()
      for (const service of graph['@graph'].filter((n) => n['@type'] === 'Service')) {
        assert.ok(body.includes(service.name), service.name)
        assert.ok(body.includes(service.description), service.description)
      }
      assert.ok(!JSON.stringify(graph).includes('aggregateRating'))
      internalLinks.push(
        ...(await page
          .locator('a[href]')
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href')))
          .then((links) => links.map((href) => ({ href, from: canonical })))),
      )
    }
    for (const src of await page
      .locator('img[src],link[rel="stylesheet"],script[src]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('src') || n.getAttribute('href')))) {
      if (src.startsWith('/')) assert.ok(existsSync(`dist${src}`), `${entry.url}: missing ${src}`)
    }
    checks++
  }
  assert.equal(canonicalPages.size, manifest.preview ? 0 : 18)
  assert.equal(new Set([...metadata.values()].map((m) => m.title)).size, metadata.size)
  assert.equal(new Set([...metadata.values()].map((m) => m.description)).size, metadata.size)
  await page.setContent('<html><body></body></html>')
  const xml = readFileSync('dist/sitemap.xml', 'utf8')
  const sitemap = await page.evaluate((xml) => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml')
    return {
      errors: doc.querySelectorAll('parsererror').length,
      urls: [...doc.querySelectorAll('loc')].map((n) => n.textContent),
      alternates: doc.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link').length,
    }
  }, xml)
  assert.equal(sitemap.errors, 0)
  assert.deepEqual(sitemap.urls.sort(), [...canonicalPages.keys()].sort())
  assert.equal(sitemap.alternates, sitemap.urls.length * 3)
  const robots = readFileSync('dist/robots.txt', 'utf8')
  assert.equal(robots.includes(`Sitemap: ${origin}/sitemap.xml`), !manifest.preview)
  assert.ok(!robots.includes('Disallow: /factory') && !robots.includes('Disallow: /windows'))
  checks++

  for (const { href, from } of internalLinks) {
    const url = new URL(href, from)
    if (url.origin !== origin) continue
    const entry =
      manifest.pages.find((p) => p.url === url.pathname + url.search) ??
      manifest.pages.find((p) => p.url === url.pathname)
    assert.ok(entry && entry.status === 200, `${from}: broken link ${href}`)
    if (url.hash) {
      const html = readFileSync(`dist/${entry.file}`, 'utf8')
      assert.ok(
        html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),
        `${from}: missing anchor ${href}`,
      )
    }
  }
  for (const entry of manifest.pages) {
    const response = await fetch(base + entry.url, { redirect: 'manual' })
    assert.equal(response.status, entry.status, entry.url)
    const html = await response.text()
    assert.ok(html.includes('<h1'), entry.url)
    // Confirm public rewrites choose the same category/language HTML as the static output.
    assert.equal(html, readFileSync(`dist/${entry.file}`, 'utf8'), entry.url)
    checks++
  }
  for (const path of [
    '/missing',
    '/factory/missing',
    '/windows/missing',
    '/tw/factory/missing',
    '/tw/windows/missing',
    '/fr/factory/home',
    '/_prerender/factory-home.html',
  ]) {
    const response = await fetch(base + path, { redirect: 'manual' })
    assert.equal(response.status, 404, path)
    assert.ok((await response.text()).includes('noindex'))
    checks++
  }
  for (const [path, target] of [
    ['/', '/factory/home'],
    ['/home', '/factory/home'],
    ['/products?tab=windows', '/windows/products?tab=windows'],
    ['/tw/get-a-quote', '/tw/windows/quote'],
    ['/factory/home/', '/factory/home'],
  ]) {
    const response = await fetch(base + path, { redirect: 'manual' })
    assert.equal(response.status, 301)
    assert.equal(
      new URL(response.headers.get('location')).pathname +
        new URL(response.headers.get('location')).search,
      target,
    )
    checks++
  }
  for (const path of [
    '/windows/products?utm_source=test#product-details',
    '/windows/products?tab=multi-handle',
    '/windows/products?tab=bad',
  ]) {
    assert.equal(getPageSeo(path).canonical, `${origin}/windows/products`)
  }
  assert.equal(getPageSeo('/factory/contact', true).indexable, false)
  assert.equal(getPageSeo('/missing').canonical, undefined)
  assert.ok(!renderSeoHead('/factory/home?x=%3Cscript%3E').includes('<script>'))
  checks++

  for (const hostname of [
    'hissus.com',
    'hissus.netlify.app',
    'deploy-preview-1--hissus.netlify.app',
    'production-id--hissus.netlify.app',
  ]) {
    const response = await seoEdge(new Request(`https://${hostname}/factory/home`), {
      next: async () => new Response('page', { headers: { 'X-Keep': 'preserved' } }),
    })
    assert.equal(response.headers.get('x-keep'), 'preserved')
    assert.equal(
      response.headers.get('x-robots-tag'),
      hostname === 'hissus.com' ? null : 'noindex, nofollow',
    )
    assert.equal(await response.text(), 'page')
  }
  const www = await seoEdge(new Request('https://www.hissus.com/tw/windows/products?tab=windows'), {
    next: async () => {
      throw new Error('must redirect')
    },
  })
  assert.equal(www.status, 301)
  assert.equal(www.headers.get('location'), `${origin}/tw/windows/products?tab=windows`)
  for (const path of ['/api/quote', '/.netlify/functions/quote']) {
    const response = await seoEdge(
      new Request(`https://hissus.netlify.app${path}`, { method: 'POST' }),
      { next: async () => new Response('{"code":"VERIFICATION_REQUIRED"}', { status: 403 }) },
    )
    assert.equal(response.status, 403)
    assert.equal(response.headers.get('x-robots-tag'), null)
  }
  checks++
  console.log(
    JSON.stringify({
      checks,
      prerenderedRoutes: manifest.pages.length,
      canonicalUrls: canonicalPages.size,
      preview: manifest.preview,
      providers: 'not contacted',
      liveNetlify: 'not verified',
    }),
  )
} finally {
  await browser.close()
}
