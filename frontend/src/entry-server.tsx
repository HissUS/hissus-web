import { createMemoryHistory } from '@tanstack/react-router'
import { renderToString } from 'react-dom/server'
import { createSiteRouter } from './router'
import i18n from './i18n'
import { Application } from './Application'
export { getPrerenderUrls, getPageSeo, renderSeoHead, escapeMarkup, SITE_ORIGIN } from './lib/seo'

/** Build-time rendering only. No HTTP server or email calls run in production. */
export async function renderPage(url: string) {
  await i18n.changeLanguage(url.startsWith('/tw/') ? 'zh-TW' : 'en')
  const router = createSiteRouter(createMemoryHistory({ initialEntries: [url] }))
  await router.load()
  return renderToString(<Application router={router} />)
}
