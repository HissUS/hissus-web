import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdirSync, readFileSync } from 'node:fs'
const dictionaries = Object.fromEntries(
  ['en', 'zh-TW'].map((locale) => [
    locale,
    JSON.parse(readFileSync(new URL(`../src/locales/${locale}.json`, import.meta.url), 'utf8')),
  ]),
)
const metadataKeys = {
  'factory/home': 'home',
  'factory/services': 'services',
  'factory/about': 'about',
  'factory/contact': 'contact',
  'windows/home': 'screens',
  'windows/products': 'products',
  'windows/quote': 'quote',
}
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  args: ['--disable-dev-shm-usage'],
})
const paths = [
  'factory/home',
  'factory/services',
  'factory/contact',
  'windows/home',
  'windows/products?tab=windows',
  'windows/quote',
  'login',
  'console',
]
const thumbnail = readFileSync(
  new URL('../src/assets/images/factory/1555-640.webp', import.meta.url),
)
// External thumbnails and players are stubbed; local assets and CSP remain real.
async function newPage(options) {
  const page = await browser.newPage(options)
  await page.route('https://i.ytimg.com/**', (route) =>
    route.fulfill({ contentType: 'image/webp', body: thumbnail }),
  )
  return page
}
let checks = 0
const screenshotDirectory = process.env.SCREENSHOT_DIR
if (screenshotDirectory) mkdirSync(screenshotDirectory, { recursive: true })
try {
  for (const width of [1440, 390, 320])
    for (const prefix of ['', '/tw']) {
      const page = await newPage({ viewport: { width, height: 900 } })
      let factoryHeroHeight
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      for (const path of paths) {
        await page.goto(`${base}${prefix}/${path}`, { waitUntil: 'domcontentloaded' })
        await page.locator('h1,h2').first().waitFor()
        await page.waitForFunction(
          (locale) => document.documentElement.lang === locale,
          prefix ? 'zh-TW' : 'en',
        )
        const key = metadataKeys[path.split('?')[0]] || path
        const expected = dictionaries[prefix ? 'zh-TW' : 'en'].company.metadata[key]
        await page.waitForFunction((title) => document.title === title, expected.title)
        assert.equal(
          await page.locator('meta[name="description"]').getAttribute('content'),
          expected.desc,
        )
        assert.deepEqual(
          await page
            .locator('link[data-hissus-locale]')
            .evaluateAll((links) =>
              links.map((link) => ({ lang: link.hreflang, href: link.href })),
            ),
          [
            { lang: 'en', href: `https://hissus.com/${path.split('?')[0]}` },
            { lang: 'zh-TW', href: `https://hissus.com/tw/${path.split('?')[0]}` },
            { lang: 'x-default', href: `https://hissus.com/${path.split('?')[0]}` },
          ],
        )

        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
          false,
          `${width} ${prefix}/${path} overflow`,
        )
        assert.equal(
          await page
            .locator('img')
            .evaluateAll((images) =>
              images.some((image) => image.complete && image.naturalWidth === 0),
            ),
          false,
          'missing asset',
        )
        assert.deepEqual(errors, [], `${prefix}/${path} browser errors`)
        assert.equal(
          (await page.locator('body').innerText()).includes('\u2014'),
          false,
          'visible copy must not contain em dashes',
        )
        if (await page.locator('header').count()) {
          const translations = dictionaries[prefix ? 'zh-TW' : 'en']
          const windowSite = path.startsWith('windows/')
          const expectedLinks = windowSite
            ? [translations.nav.home, translations.nav.products, translations.nav.quote]
            : [translations.nav.home, translations.nav.servicesShort, translations.nav.contact]
          const expectedSwitch = windowSite ? translations.nav.services : translations.nav.screens
          const switchButton = page
            .locator('header')
            .getByRole('link', { name: expectedSwitch, exact: true })
          assert.equal(
            await switchButton.getAttribute('href'),
            `${prefix}/${windowSite ? 'factory/home' : 'windows/home'}`,
          )
          assert.equal(
            await page
              .locator('header')
              .getByRole('link', { name: 'HISSUS', exact: true })
              .getAttribute('href'),
            `${prefix}/${windowSite ? 'windows/home' : 'factory/home'}`,
          )
          if (width < 1024)
            await page
              .locator('header')
              .getByRole('button', { name: translations.nav.menu, exact: true })
              .click()
          const navigation =
            width < 1024 ? page.locator('#mobile-navigation') : page.locator('header nav').first()
          assert.deepEqual(
            (await navigation.getByRole('link').allTextContents()).map((text) => text.trim()),
            expectedLinks,
          )
          assert.equal(
            await navigation
              .getByRole('link')
              .first()
              .evaluate((element) => getComputedStyle(element).fontSize),
            '18px',
          )
          if (windowSite)
            assert.equal(
              await navigation
                .getByRole('link', { name: translations.nav.quote, exact: true })
                .getAttribute('href'),
              `${prefix}/windows/quote`,
            )
          if (width < 1024)
            await page
              .locator('header')
              .getByRole('button', { name: translations.nav.closeMenu, exact: true })
              .click()
          assert.equal(await page.locator('footer li svg').count(), 6)
          const contactRows = await page.locator('footer li').evaluateAll((rows) =>
            rows.map((row) => {
              const rect = row.getBoundingClientRect()
              return { top: rect.top, height: rect.height }
            }),
          )
          assert.ok(
            contactRows.every((row) => Math.abs(row.height - 44) < 1),
            'footer contact rows have equal height',
          )
          assert.ok(
            contactRows
              .slice(1)
              .every((row, index) => Math.abs(row.top - contactRows[index].top - 52) < 1),
            'footer contact rows have equal spacing',
          )

          assert.equal(await page.locator('footer nav').getByRole('link').count(), 2)
          if (path === 'factory/contact')
            assert.equal(await page.locator('main a[href$="/windows/quote"]').count(), 0)
          if (path === 'factory/home')
            assert.equal(await page.locator('#screens-heading').count(), 0)
          if (['factory/home', 'factory/services', 'factory/about'].includes(path))
            assert.equal(
              await page
                .locator(
                  'section[aria-labelledby="company-contact-heading"] a[href^="mailto:"],section[aria-labelledby="company-contact-heading"] a[href^="tel:"]',
                )
                .count(),
              0,
            )
          if (path === 'factory/home')
            assert.equal(await page.locator('h1').innerText(), translations.company.heroTitle)
          if (path === 'windows/home')
            assert.equal(
              await page
                .getByRole('link', { name: translations.common.explore_details, exact: true })
                .count(),
              0,
            )

          if (path === 'factory/home') {
            assert.equal(await page.locator('#experience, #gmp').count(), 0)
            assert.deepEqual(
              await page
                .locator('main > section')
                .evaluateAll((sections) =>
                  sections.map((section) => section.getAttribute('aria-labelledby')),
                ),
              [
                'company-hero-heading',
                'photo-heading',
                'factory-steps-heading',
                'about-heading',
                'company-contact-heading',
              ],
              'homepage keeps the gallery near the hero and the About story below starting steps',
            )
            assert.equal(await page.locator('.factory-hero a').count(), 1)
            assert.equal(
              await page.locator('.factory-hero a').getAttribute('href'),
              `${prefix}/factory/contact`,
            )
            const introduction = page.locator('#about')
            assert.equal(
              await introduction.getByRole('link').getAttribute('href'),
              `${prefix}/factory/services`,
            )
            assert.equal(
              await introduction.getByRole('heading').innerText(),
              translations.company.aboutTitle,
            )
            assert.ok((await introduction.innerText()).includes(translations.company.aboutDesc))
            assert.equal(await introduction.locator('img').count(), 1)
            assert.equal(
              await introduction.locator('img').getAttribute('alt'),
              translations.company.aboutImageAlt,
            )
            assert.equal(
              await introduction
                .locator('.company-about-blend')
                .evaluate((element) =>
                  getComputedStyle(element).backgroundImage.includes('linear-gradient'),
                ),
              true,
              'the illustration fades into the section background',
            )
            const steps = page.locator('section[aria-labelledby="factory-steps-heading"]')
            assert.deepEqual(
              await steps.locator('li h3').allTextContents(),
              ['needs', 'scope', 'approach'].map((key) => translations.company.start[key].title),
            )
            assert.equal(
              await steps.getByRole('link').getAttribute('href'),
              `${prefix}/factory/services`,
            )
            const closing = page.locator('section[aria-labelledby="company-contact-heading"]')
            assert.equal(
              await closing.getByRole('heading').innerText(),
              translations.company.homeContactTitle,
            )
            assert.equal(await closing.locator('p').count(), 0)
            checks++
            factoryHeroHeight = (await page.locator('.factory-hero').boundingBox()).height
            assert.equal(
              await page
                .getByText(
                  translations.company.heroImageNote || 'Illustrative architectural concept',
                  { exact: true },
                )
                .count(),
              0,
            )
          }
          if (path === 'factory/services') {
            assert.equal(await page.locator('#experience').count(), 1)
            assert.equal(await page.locator('#gmp').count(), 1)
            assert.ok(
              (await page.locator('#gmp').innerText()).includes(translations.company.gmpNote),
            )
            assert.ok(
              (
                await page.locator('section[aria-labelledby="company-contact-heading"]').innerText()
              ).includes(translations.company.contactDesc),
            )
            checks++
          }
          if (path === 'windows/home') {
            const windowsHeight = (await page.locator('main section').first().boundingBox()).height
            assert.ok(
              Math.abs(factoryHeroHeight - windowsHeight) < 1,
              `hero heights match ${width} ${prefix}: ${factoryHeroHeight} / ${windowsHeight}`,
            )
            assert.equal(windowsHeight, width < 640 ? 520 : 600)
            checks++
          }
          checks++
        }

        if (
          screenshotDirectory &&
          ['factory/home', 'factory/services', 'factory/contact', 'windows/home'].includes(path)
        ) {
          await page.locator('img').evaluateAll(async (images) => {
            for (const image of images) {
              image.loading = 'eager'
              await image.decode()
            }
          })
          await page.locator('[class*="animate-in"]').evaluateAll(async (elements) => {
            await Promise.all(
              elements.flatMap((element) =>
                element.getAnimations().map((animation) => animation.finished.catch(() => {})),
              ),
            )
          })
          for (const reveal of await page.locator('.factory-reveal').all())
            await reveal.scrollIntoViewIfNeeded()
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
          await page.waitForTimeout(700)
          await page.screenshot({
            path: `${screenshotDirectory}/${width}-${prefix ? 'tw' : 'en'}-${path.replaceAll('/', '-')}.png`,
            fullPage: true,
          })
        }
        await page.reload({ waitUntil: 'domcontentloaded' })
        await page.waitForFunction((title) => document.title === title, expected.title)
        checks++
      }
      await page.goto(`${base}${prefix}/factory/home`, { waitUntil: 'domcontentloaded' })
      const screenButton = page.locator('header').getByRole('link', {
        name: prefix ? '門窗與紗窗解決方案' : 'Window & Screen Solutions',
        exact: true,
      })
      await screenButton.waitFor()
      assert.equal(
        await page
          .locator('header nav')
          .getByRole('link', {
            name: prefix ? '門窗與紗窗解決方案' : 'Window & Screen Solutions',
            exact: true,
          })
          .count(),
        0,
      )
      assert.equal(
        await screenButton.evaluate((element) => element.classList.contains('bg-primary')),
        true,
      )
      const buttonBox = await screenButton.boundingBox()
      const englishBox = await page
        .locator('header')
        .getByRole('button', { name: 'English', exact: true })
        .boundingBox()
      assert.ok(buttonBox.x + buttonBox.width <= englishBox.x)
      await screenButton.click()
      await page.waitForURL('**/windows/home')
      await page.locator('h1').waitFor()
      checks++
      const factoryButton = page.locator('header').getByRole('link', {
        name: prefix ? '工廠與設施建置' : 'Factory & Facility Services',
        exact: true,
      })
      await factoryButton.click()
      await page.waitForURL(`**${prefix}/factory/home`)
      await page.locator('h1').waitFor()
      checks++
      await page.goto(`${base}${prefix}/windows/products?tab=windows`, {
        waitUntil: 'domcontentloaded',
      })
      for (const [tab, translationKey, imageCount, videoCount] of [
        ['multi-handle', 'multiHandle', 5, 4],
        ['double-handle', 'doubleHandle', 1, 3],
        ['single-handle', 'singleHandle', 4, 1],
        ['windows', 'windows', 1, 1],
      ]) {
        const productLink = page.locator(`#select-product a[href$="tab=${tab}"]`)
        await productLink.scrollIntoViewIfNeeded()
        await page.waitForTimeout(150)
        const selectionY = await page.evaluate(() => window.scrollY)
        await productLink.click()
        await page.waitForURL(`**/windows/products?tab=${tab}`)
        await page.waitForTimeout(400)
        assert.ok(
          Math.abs((await page.evaluate(() => window.scrollY)) - selectionY) < 2,
          `product selection retains scroll ${width} ${prefix} ${tab}`,
        )
        checks++

        await page.locator('#product-details').waitFor()
        await page.waitForFunction(
          (locale) => document.documentElement.lang === locale,
          prefix ? 'zh-TW' : 'en',
        )
        assert.ok(
          (await page.locator('#product-details').textContent()).includes(
            dictionaries[prefix ? 'zh-TW' : 'en'].products[translationKey],
          ),
        )
        assert.ok((await page.locator('#product-details img').count()) >= imageCount)
        assert.equal(
          await page
            .getByRole('button', { name: prefix ? '點擊播放' : 'Click to play', exact: false })
            .count(),
          videoCount,
        )
        checks++
      }
      await page.goto(`${base}${prefix}/windows/products?tab=single-handle`, {
        waitUntil: 'domcontentloaded',
      })
      await page.locator('#product-details').waitFor()
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }))
      const previousY = await page.evaluate(() => window.scrollY)
      await page
        .getByRole('button', { name: prefix ? 'English' : '繁體中文', exact: true })
        .first()
        .click()
      await page.waitForURL(`**/${prefix ? '' : 'tw/'}windows/products?tab=single-handle`)
      await page.waitForTimeout(750)
      assert.ok(
        Math.abs((await page.evaluate(() => window.scrollY)) - previousY) < 2,
        'product language switch retains scroll',
      )
      checks++
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForFunction(
        (locale) => document.documentElement.lang === locale,
        prefix ? 'en' : 'zh-TW',
      )
      assert.equal(await page.locator('html').getAttribute('lang'), prefix ? 'en' : 'zh-TW')
      assert.ok(page.url().includes('tab=single-handle'))
      checks++
      assert.equal(await page.locator('iframe').count(), 0, 'videos must not autoplay')
      // Verify the preserved video target without depending on external YouTube access.
      await page.route('https://www.youtube-nocookie.com/**', (route) =>
        route.fulfill({
          contentType: 'text/html',
          body: '<html><body>External player stub</body></html>',
        }),
      )
      await page
        .getByRole('button', { name: prefix ? 'Click to play' : '點擊播放', exact: false })
        .first()
        .click()
      assert.ok((await page.locator('iframe').first().getAttribute('src')).includes('autoplay=1'))
      assert.ok((await page.locator('iframe').first().getAttribute('allow')).includes('autoplay'))
      await page.waitForFunction(
        () => getComputedStyle(document.querySelector('iframe')).opacity === '1',
      )
      checks++
      await page
        .locator('#product-details button')
        .filter({ has: page.locator('img') })
        .first()
        .click()
      await page.getByRole('dialog').waitFor()
      await page.keyboard.press('Escape')
      assert.equal(await page.getByRole('dialog').count(), 0)
      checks++
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }))
      const topButton = page.getByRole('button', {
        name: prefix ? 'Back to top' : '回到頁首',
        exact: true,
      })
      await topButton.waitFor()
      assert.equal(await topButton.evaluate((element) => getComputedStyle(element).width), '56px')
      assert.equal(await topButton.evaluate((element) => getComputedStyle(element).height), '56px')
      assert.equal((await topButton.textContent()).trim(), '')
      await topButton.click()
      await page.waitForFunction(() => window.scrollY < 1)
      checks++
      if (width < 768) {
        const translations = dictionaries[prefix ? 'en' : 'zh-TW']
        // The previous language switch leaves this page in the opposite locale.
        await page
          .locator('header')
          .getByRole('button', { name: translations.nav.menu, exact: true })
          .click()
        await page
          .locator('#mobile-navigation')
          .getByRole('link', { name: translations.nav.home, exact: true })
          .click()
        await page.waitForURL('**/windows/home')
        await page
          .locator('header')
          .getByRole('link', { name: translations.nav.services, exact: true })
          .click()
        await page.waitForURL('**/factory/home')
        await page
          .locator('header')
          .getByRole('button', { name: translations.nav.menu, exact: true })
          .click()
        await page
          .locator('#mobile-navigation')
          .getByRole('link', { name: translations.nav.servicesShort, exact: true })
          .click()
        await page.waitForURL('**/factory/services')
        assert.equal(await page.locator('#mobile-navigation').count(), 0)
        checks++
      }
      await page.close()
    }
  for (const width of [1440, 390, 320]) {
    const media = await newPage({ viewport: { width, height: 900 } })
    for (const prefix of ['', '/tw']) {
      for (const hash of ['', '#factory-gallery']) {
        await media.goto(`${base}${prefix}/factory/home${hash}`, { waitUntil: 'domcontentloaded' })
        await media.locator('#factory-gallery').waitFor()
        await media.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }))
        await media.waitForTimeout(200)
        const before = await media.evaluate(() => window.scrollY)
        await media
          .locator('header')
          .getByRole('button', { name: prefix ? 'English' : '繁體中文', exact: true })
          .click()
        await media.waitForURL(`**/${prefix ? '' : 'tw/'}factory/home${hash}`)
        await media.waitForTimeout(750)
        assert.ok(
          Math.abs((await media.evaluate(() => window.scrollY)) - before) < 2,
          `factory locale scroll ${width} ${prefix} ${hash}`,
        )
        checks++
      }
      const gallery = media.locator('#factory-gallery')
      assert.equal(await gallery.locator('figure').count(), 6)
      const carousel = gallery.locator('[data-factory-carousel]')
      const next = carousel.getByRole('button', {
        name: dictionaries[prefix ? 'en' : 'zh-TW'].gallery.next,
        exact: true,
      })
      const previous = carousel.getByRole('button', {
        name: dictionaries[prefix ? 'en' : 'zh-TW'].gallery.previous,
        exact: true,
      })
      await next.scrollIntoViewIfNeeded()
      await media.waitForFunction(
        () =>
          getComputedStyle(document.querySelector('[data-factory-carousel]').parentElement)
            .opacity === '1',
      )
      // Center the arrow clear of the sticky header before measuring scroll retention.
      // A merely visible arrow can sit behind the header and make Playwright scroll on click.
      await next.evaluate((button) =>
        button.scrollIntoView({ block: 'center', behavior: 'instant' }),
      )
      assert.equal(await previous.isDisabled(), false)
      assert.equal(await next.isDisabled(), false)
      const initialX = (await gallery.locator('figure').first().boundingBox()).x
      const initialY = await media.evaluate(() => window.scrollY)
      await next.click()
      await media.waitForTimeout(900)
      assert.ok(
        (await gallery.locator('figure').first().boundingBox()).x < initialX - 100,
        'carousel scrolls horizontally',
      )
      assert.ok(
        Math.abs((await media.evaluate(() => window.scrollY)) - initialY) < 2,
        `carousel keeps page position ${width} ${prefix}: ${initialY} / ${await media.evaluate(() => window.scrollY)}`,
      )
      assert.equal(await previous.isDisabled(), false)
      await media.keyboard.press('ArrowLeft')
      await media.waitForTimeout(900)
      assert.ok(
        Math.abs((await gallery.locator('figure').first().boundingBox()).x - initialX) < 2,
        'carousel keyboard returns to first photo',
      )
      checks++
      const leadingPhoto = () =>
        carousel.locator('figure button').evaluateAll((buttons) => {
          const left = buttons[0].closest('[data-factory-carousel]').getBoundingClientRect().left
          const distances = buttons.map((button) =>
            Math.abs(button.getBoundingClientRect().left - left),
          )
          return distances.indexOf(Math.min(...distances))
        })
      const firstImage = await carousel.locator('figure img').first().boundingBox()
      const previousBox = await previous.boundingBox()
      const nextBox = await next.boundingBox()
      assert.ok(previousBox.x < nextBox.x, 'gallery arrows occupy opposite sides')
      for (const arrow of [previousBox, nextBox]) {
        assert.ok(
          arrow.y >= firstImage.y && arrow.y + arrow.height <= firstImage.y + firstImage.height,
          'gallery arrows overlay the photos rather than sitting below them',
        )
        assert.ok(arrow.width >= 44 && arrow.height >= 44, 'gallery arrows retain touch targets')
      }
      await media.emulateMedia({ reducedMotion: 'reduce' })
      await previous.click()
      await media.waitForTimeout(50)
      assert.equal(await leadingPhoto(), 5, 'previous wraps from the first to the last photo')
      await next.click()
      await media.waitForTimeout(50)
      assert.equal(await leadingPhoto(), 0, 'next wraps from the last to the first photo')
      for (let index = 1; index <= 6; index++) {
        await next.click()
        await media.waitForTimeout(50)
        assert.equal(await leadingPhoto(), index % 6, 'every original photo remains in the loop')
      }
      assert.ok(
        Math.abs((await media.evaluate(() => window.scrollY)) - initialY) < 2,
        'looping controls retain the page position',
      )
      await media.keyboard.press('ArrowLeft')
      await media.waitForTimeout(50)
      assert.equal(await leadingPhoto(), 5, 'keyboard navigation wraps backward')
      await media.keyboard.press('ArrowRight')
      await media.waitForTimeout(50)
      assert.equal(await leadingPhoto(), 0, 'keyboard navigation wraps forward')
      await media.emulateMedia({ reducedMotion: 'no-preference' })
      checks++
      const trigger = gallery.locator('figure button').first()
      await trigger.click()
      const dialog = media.getByRole('dialog')
      await dialog.waitFor()
      assert.equal(
        await media.evaluate(() => document.activeElement.closest('dialog') !== null),
        true,
      )
      await media.keyboard.press('ArrowRight')
      assert.ok((await dialog.textContent()).includes('2 / 6'))
      await media.keyboard.press('ArrowLeft')
      assert.ok((await dialog.textContent()).includes('1 / 6'))
      await dialog
        .getByRole('button', {
          name: dictionaries[prefix ? 'en' : 'zh-TW'].gallery.next,
          exact: true,
        })
        .click()
      assert.ok((await dialog.textContent()).includes('2 / 6'))
      await dialog.locator('img').evaluate((img) => img.decode())
      assert.equal(
        await media.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
        false,
      )
      await media.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      assert.equal(await trigger.evaluate((element) => element === document.activeElement), true)
      checks++
      await media
        .locator('footer')
        .getByRole('button', { name: prefix ? '繁體中文' : 'English', exact: true })
        .click()
      const footerY = await media.evaluate(() => window.scrollY)
      await media.waitForTimeout(750)
      assert.ok(
        await media.evaluate(() => window.scrollY > 1000),
        'footer locale switch does not return to top',
      )
      assert.ok(footerY > 1000)
      checks++
    }
    await media.close()
  }
  const redirects = await newPage()
  for (const prefix of ['', '/tw']) {
    for (const [oldPath, destination] of [
      ['/home', '/factory/home'],
      ['/services', '/factory/services'],
      ['/about', '/factory/home'],
      ['/contact', '/factory/contact'],
      ['/window-screen-solutions', '/windows/home'],
      ['/products', '/windows/products'],
      ['/get-a-quote', '/windows/quote'],
      ['/factory', '/factory/home'],
      ['/windows', '/windows/home'],
    ]) {
      await redirects.goto(`${base}${prefix}${oldPath}?tab=single-handle#details`, {
        waitUntil: 'domcontentloaded',
      })
      await redirects.waitForURL(`${base}${prefix}${destination}?tab=single-handle#details`)
      await redirects.locator('h1').waitFor()
      checks++
    }
    for (const aboutPath of ['/about', '/factory/about']) {
      await redirects.goto(`${base}${prefix}${aboutPath}?campaign=about`, {
        waitUntil: 'domcontentloaded',
      })
      await redirects.waitForURL(`${base}${prefix}/factory/home?campaign=about#about`)
      await redirects.locator('#about').waitFor()
      await redirects.waitForTimeout(300)
      const aboutTop = (await redirects.locator('#about').boundingBox()).y
      assert.ok(
        aboutTop >= 0 && aboutTop < 180,
        'About bookmarks open the homepage company section below the header',
      )
      checks++
    }
    await redirects.goto(`${base}${prefix || '/'}?campaign=sample#intro`, {
      waitUntil: 'domcontentloaded',
    })
    await redirects.waitForURL(`${base}${prefix}/factory/home?campaign=sample#intro`)
    checks++
    for (const section of ['factory', 'windows']) {
      await redirects.goto(`${base}${prefix}/${section}/unknown`, { waitUntil: 'domcontentloaded' })
      await redirects
        .getByRole('link', { name: dictionaries[prefix ? 'zh-TW' : 'en'].nav.home, exact: true })
        .waitFor()
      assert.equal(
        await redirects
          .getByRole('link', { name: dictionaries[prefix ? 'zh-TW' : 'en'].nav.home, exact: true })
          .getAttribute('href'),
        `${prefix}/${section}/home`,
      )
      checks++
    }
  }
  await redirects.close()
  const page = await newPage()
  for (const prefix of ['', '/tw'])
    for (const facility of [false, true]) {
      await page.goto(`${base}${prefix}/${facility ? 'factory/contact' : 'windows/quote'}`, {
        waitUntil: 'domcontentloaded',
      })
      assert.equal(
        await page.locator('main a[href^="mailto:"]').count(),
        0,
        'no email link beneath inquiry form',
      )
      if (facility) {
        await page
          .getByLabel(prefix ? '姓名／公司名稱' : 'Name / company name', { exact: false })
          .fill('Sample Company')
        await page
          .getByLabel(prefix ? '您想詢問什麼？' : 'What would you like to ask about?', {
            exact: false,
          })
          .fill('Factory setup and GMP')
        assert.equal(await page.locator('form input:visible').count(), 4)
        assert.equal(await page.locator('form textarea:visible').count(), 1)
        assert.equal(await page.locator('select').count(), 0)
        checks++
      } else {
        await page.getByLabel(prefix ? '名字' : 'First name', { exact: false }).fill('Test')
        await page.getByLabel(prefix ? '姓氏' : 'Last name', { exact: false }).fill('Visitor')
        await page.locator('select').nth(0).selectOption('Plano')
        await page.locator('select').nth(1).selectOption('windows')
      }
      await page.locator('input[type="email"]').fill('test@example.com')
      await page.locator('input[type="tel"]').fill(facility ? '+886 912 345 678' : '4692883098')
      let calls = 0
      await page.route('**/.netlify/functions/quote', async (route) => {
        calls++
        await route.fulfill({
          status: 502,
          contentType: 'application/json',
          body: '{"code":"SEND_FAILED"}',
        })
      })
      await page.locator('button[type="submit"]').click()
      await page.getByRole('alert').waitFor()
      assert.equal(await page.getByRole('status').count(), 0)
      assert.equal(calls, 1)
      checks++
      await page.unroute('**/.netlify/functions/quote')
      await page.route('**/.netlify/functions/quote', async (route) => {
        const data = route.request().postDataJSON()
        assert.equal(data.kind, facility ? 'facility' : 'screen')
        if (facility) {
          assert.equal(data.name, 'Sample Company')
          assert.equal(data.subject, 'Factory setup and GMP')
          assert.equal(
            'city' in data || 'product' in data || 'firstName' in data || 'lastName' in data,
            false,
          )
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '{"success":true,"confirmationSent":false}',
        })
      })
      await page.locator('button[type="submit"]').click()
      await page.getByRole('status').waitFor()
      assert.ok(
        (await page.getByRole('status').textContent()).includes(
          prefix ? '確認信' : 'confirmation email',
        ),
      )
      checks++
      await page.unroute('**/.netlify/functions/quote')
    }
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${base}/factory/home`, { waitUntil: 'domcontentloaded' })
  await page.locator('h1').waitFor()
  assert.equal(
    await page.evaluate(() => getComputedStyle(document.querySelector('a')).transitionDuration),
    '0s',
  )
  assert.equal(
    await page
      .locator('.factory-reveal')
      .evaluateAll((elements) =>
        elements.every(
          (element) =>
            getComputedStyle(element).opacity === '1' &&
            getComputedStyle(element).transitionDuration === '0s',
        ),
      ),
    true,
  )
  checks++
  await page.keyboard.press('Tab')
  assert.equal(
    await page.evaluate(() => document.activeElement.getAttribute('href')),
    '#main-content',
  )
  checks++
  await page.unroute('https://i.ytimg.com/**')
  await page.route('https://i.ytimg.com/**', (route) => route.abort('failed'))
  await page.goto(`${base}/windows/products?tab=single-handle`, { waitUntil: 'domcontentloaded' })
  const poster = page.locator('img[src*="i.ytimg.com"]').first()
  await poster.scrollIntoViewIfNeeded()
  await page.waitForFunction(
    () => !!document.querySelector('img[data-fallback="true"]')?.naturalWidth,
  )
  assert.ok(
    (await page.locator('img[data-fallback="true"]').first().getAttribute('src')).startsWith(
      '/assets/',
    ),
  )
  checks++
  console.log(
    `${checks} browser checks passed (desktop/mobile, EN/zh-TW, routes, media, forms, keyboard, reduced motion). External thumbnails, video, and mail delivery are stubbed.`,
  )
} finally {
  await browser.close()
}
