import { Outlet, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLocale, useLocaleSwitcher } from '../hooks'
import { COUNTRY_TO_LOCALE, DEFAULT_LOCALE } from '../locales/config'

export function MainLayout() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const { pathname } = useRouterState({ select: (s) => s.location })

  // Strip /$country suffix to build localized nav links
  const basePath = pathname.replace(/\/[a-z]{2}$/, '')

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <span className="text-xl font-semibold text-gray-900">Hissus</span>
          <nav className="flex items-center gap-6 text-sm">
            <a href={basePath.startsWith('/home') ? pathname : pathname.replace(basePath, '/home')} className="text-gray-600 hover:text-gray-900">
              {t('nav.home')}
            </a>
            <a href={basePath.startsWith('/products') ? pathname : pathname.replace(basePath, '/products')} className="text-gray-600 hover:text-gray-900">
              {t('nav.products')}
            </a>
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              {t('nav.login')}
            </a>
          </nav>
          {/* Language switcher */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => switchLocale(DEFAULT_LOCALE)}
              className={`rounded px-2 py-1 ${locale === DEFAULT_LOCALE ? 'font-semibold text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
            >
              EN
            </button>
            {Object.entries(COUNTRY_TO_LOCALE).map(([country, countryLocale]) => (
              <button
                key={country}
                onClick={() => switchLocale(countryLocale)}
                className={`rounded px-2 py-1 uppercase ${locale === countryLocale ? 'font-semibold text-gray-900' : 'text-gray-400 hover:text-gray-700'}`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
