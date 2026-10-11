import { useEffect } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

const PAGE_KEYS: Record<string, string> = {
  home: 'home',
  services: 'services',
  about: 'about',
  contact: 'contact',
  'window-screen-solutions': 'screens',
  products: 'products',
  'get-a-quote': 'quote',
  login: 'login',
  console: 'console',
}

export function usePageMetadata() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()
  useEffect(() => {
    const basePath = pathname.replace(/^\/tw(?=\/|$)/, '')
    const page = PAGE_KEYS[basePath.split('/')[1]]
    document.title = page ? t(`company.metadata.${page}.title`) : t('company.notFoundTitle')
    const description =
      document.querySelector<HTMLMetaElement>('meta[name="description"]') ??
      document.createElement('meta')
    description.name = 'description'
    description.content = page ? t(`company.metadata.${page}.desc`) : t('company.notFoundDesc')
    if (!description.parentNode) document.head.append(description)
    document.querySelectorAll('link[data-hissus-locale]').forEach((link) => link.remove())
    if (!page) return
    for (const [lang, prefix] of [
      ['en', ''],
      ['zh-TW', '/tw'],
      ['x-default', ''],
    ]) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = lang
      link.href = `https://hissus.com${prefix}${basePath}`
      link.dataset.hissusLocale = 'true'
      document.head.append(link)
    }
  }, [pathname, t, i18n.language])
}
