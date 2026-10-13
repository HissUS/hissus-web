import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { installVerificationStub } from './browser-stubs.mjs'
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
;(async () => {
  const policy = readFileSync(new URL('../../netlify.toml', import.meta.url), 'utf8').match(
    /Content-Security-Policy = "([^"]+)"/,
  )[1]
  const browser = await chromium.launch({
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  await installVerificationStub(page)
  let violations = []
  await page.exposeFunction('recordViolation', (v) => violations.push(v))
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) =>
      window.recordViolation({ directive: e.violatedDirective, blocked: e.blockedURI }),
    )
  })
  await page.route(`${base}/**`, async (route) => {
    const r = await route.fetch()
    await route.fulfill({
      response: r,
      headers: {
        ...r.headers(),
        'content-security-policy': policy,
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
      },
    })
  })
  await page.route('https://www.youtube-nocookie.com/**', (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<html><body>Stubbed external player</body></html>',
    }),
  )
  await page.route('https://i.ytimg.com/**', (route) =>
    route.fulfill({
      contentType: 'image/webp',
      body: readFileSync(new URL('../src/assets/images/factory/1555-640.webp', import.meta.url)),
    }),
  )
  for (const path of [
    '/factory/home',
    '/tw/factory/home',
    '/windows/products?tab=multi-handle',
    '/tw/windows/products?tab=windows',
    '/windows/quote',
    '/tw/factory/contact',
  ]) {
    await page.goto(base + path, { waitUntil: 'domcontentloaded' })
    await page.locator('h1').waitFor()
    await page.locator('img').evaluateAll(async (imgs) => {
      for (const i of imgs) {
        i.loading = 'eager'
        await i.decode()
      }
    })
    await page.waitForTimeout(150)
    if (path.includes('products')) {
      await page
        .getByRole('button', { name: /Click to play|點擊播放/ })
        .first()
        .click()
      await page.locator('iframe').waitFor()
    }
  }
  console.log(
    JSON.stringify({ pages: 6, violations, externalPlayer: 'stubbed; real playback unverified' }),
  )
  await browser.close()
  if (violations.length) process.exit(1)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
