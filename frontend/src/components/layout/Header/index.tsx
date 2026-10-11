import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale, useLocaleSwitcher } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { country, locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const prefix = country ? `/${country}` : ''
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const links = [
    { path: '/home', key: 'home' },
    { path: '/services', key: 'services' },
    { path: '/services', hash: 'experience', key: 'experience' },
    { path: '/window-screen-solutions', key: 'screens' },
    { path: '/about', key: 'about' },
    { path: '/contact', key: 'contact' },
  ]
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-4"
      >
        {t('nav.skip')}
      </a>
      <div className="company-container flex min-h-24 items-center justify-between gap-4">
        <Link
          to={`${prefix}/home` as never}
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
        <nav aria-label={t('nav.primary')} className="hidden items-center gap-4 xl:flex">
          {links.map(({ path, key, hash }) => (
            <Link
              key={key}
              to={`${prefix}${path}` as never}
              hash={hash}
              className="inline-flex items-center text-sm text-gray-700 hover:text-primary"
              activeProps={
                hash
                  ? undefined
                  : { className: 'inline-flex items-center text-sm font-semibold text-primary' }
              }
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-pressed={locale === 'en'}
            onClick={() => {
              switchLocale('en')
              setOpen(false)
            }}
            className="px-2 text-sm text-gray-700 aria-pressed:font-semibold aria-pressed:text-primary"
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
            className="px-2 text-sm text-gray-700 aria-pressed:font-semibold aria-pressed:text-primary"
          >
            {t('nav.chinese')}
          </button>
          <button
            ref={menuButton}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="inline-flex items-center gap-2 px-2 text-sm text-gray-700 xl:hidden"
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
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label={t('nav.primary')}
          className="company-container max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-gray-200 py-4 xl:hidden"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              menuButton.current?.focus()
            }
          }}
        >
          {links.map(({ path, key, hash }) => (
            <Link
              key={key}
              to={`${prefix}${path}` as never}
              hash={hash}
              onClick={() => setOpen(false)}
              className="flex items-center border-b border-gray-100 py-4 text-gray-700"
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
