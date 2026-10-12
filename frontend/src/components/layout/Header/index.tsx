import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale, useLocaleSwitcher, useSiteSection } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { country, locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const prefix = country ? `/${country}` : ''
  const { isWindowSite, homePath, switchPath, switchLabel } = useSiteSection()
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const links = isWindowSite
    ? [
        { path: homePath, key: 'home' },
        { path: '/windows/products', key: 'products' },
        { path: '/windows/quote', key: 'quote' },
      ]
    : [
        { path: homePath, key: 'home' },
        { path: '/factory/services', key: 'servicesShort' },
        { path: '/factory/contact', key: 'contact' },
      ]
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-4"
      >
        {t('nav.skip')}
      </a>
      <div className="company-container grid min-h-24 grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 py-4 sm:flex sm:justify-between lg:py-0">
        <Link
          to={`${prefix}${homePath}` as never}
          aria-label="HISSUS"
          onClick={() => setOpen(false)}
          className="inline-flex shrink-0 items-center"
        >
          <img
            src={getAssetUrl(SITE_CONFIG.assets.logo)}
            alt="HISSUS"
            width="569"
            height="268"
            className="h-12 w-auto sm:h-16"
          />
        </Link>
        <nav aria-label={t('nav.primary')} className="hidden items-center gap-8 lg:flex">
          {links.map(({ path, key }) => (
            <Link
              key={key}
              to={`${prefix}${path}` as never}
              className="inline-flex items-center border-b-2 border-transparent text-base font-medium text-gray-700 hover:text-primary sm:text-lg"
              activeProps={{
                className:
                  'inline-flex items-center border-b-2 border-primary text-base font-semibold text-primary sm:text-lg',
              }}
              activeOptions={{ exact: true }}
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>
        <div className="col-span-2 row-start-2 flex w-full items-center gap-2 sm:w-auto sm:shrink-0">
          <Link
            to={`${prefix}${switchPath}` as never}
            onClick={() => setOpen(false)}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:flex-none"
          >
            <span>{t(switchLabel)}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-pressed={locale === 'en'}
            onClick={() => {
              switchLocale('en')
              setOpen(false)
            }}
            className="shrink-0 px-2 text-sm text-gray-700 aria-pressed:font-semibold aria-pressed:text-primary"
          >
            {t('nav.english')}
          </button>
          <span aria-hidden="true" className="text-gray-300">
            /
          </span>
          <button
            type="button"
            aria-pressed={locale === 'zh-TW'}
            onClick={() => {
              switchLocale('zh-TW')
              setOpen(false)
            }}
            className="shrink-0 px-2 text-sm text-gray-700 aria-pressed:font-semibold aria-pressed:text-primary"
          >
            {t('nav.chinese')}
          </button>
        </div>
        <button
          ref={menuButton}
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="col-start-2 row-start-1 inline-flex shrink-0 justify-self-end items-center gap-2 px-2 text-sm text-gray-700 lg:hidden"
        >
          {open ? (
            <X className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Menu className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">{t(open ? 'nav.closeMenu' : 'nav.menu')}</span>
          <span className="sr-only sm:hidden">{t(open ? 'nav.closeMenu' : 'nav.menu')}</span>
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label={t('nav.primary')}
          className="company-container max-h-[calc(100dvh-10rem)] sm:max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-gray-200 py-4 lg:hidden"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              menuButton.current?.focus()
            }
          }}
        >
          {links.map(({ path, key }) => (
            <Link
              key={key}
              to={`${prefix}${path}` as never}
              onClick={() => setOpen(false)}
              className="flex items-center border-b border-gray-100 py-4 text-lg font-medium text-gray-700"
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
