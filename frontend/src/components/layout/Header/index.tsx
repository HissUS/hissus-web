import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale, useLocaleSwitcher } from '@/hooks'
import { Button } from '@/components/ui-wrapper'
import { getAssetUrl } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { country, locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const prefix = country ? `/${country}` : ''

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex items-center justify-between gap-3">
          <Link to={`${prefix}/home` as never} className="inline-flex items-center">
            <img
              src={getAssetUrl(SITE_CONFIG.assets.logo)}
              alt="Hissus"
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          <div className="flex items-center gap-2 sm:hidden">
            <div className="flex items-center justify-between gap-2 sm:hidden">
              <div className="inline-flex overflow-hidden rounded-full bg-gray-500/10">
                <button
                  type="button"
                  aria-pressed={locale === 'en'}
                  onClick={() => switchLocale('en')}
                  className={`px-2 py-1 text-[10px] font-medium ${
                    locale === 'en' ? 'bg-gray-500/15' : ''
                  }`}
                >
                  EN
                </button>

                <button
                  type="button"
                  aria-pressed={locale === 'zh-TW'}
                  onClick={() => switchLocale('zh-TW')}
                  className={`px-2 py-1 text-[10px] font-medium ${
                    locale === 'zh-TW' ? 'bg-gray-500/15' : ''
                  }`}
                >
                  繁體
                </button>
              </div>
            </div>
            <Link to={`${prefix}/get-a-quote` as never} className="inline-flex items-center">
              <Button size="sm" className="px-3 text-xs">
                {t('nav.getQuote')}
              </Button>
            </Link>
            {/* <Link to={`${prefix}/login` as never} className="inline-flex items-center">
              <Button variant="outline" size="sm" className="px-3 text-xs">
                {t('nav.login')}
              </Button>
            </Link> */}
          </div>
        </div>

        <nav className="flex w-full items-center justify-center gap-3 text-sm sm:gap-6 sm:absolute sm:left-1/2 sm:w-auto sm:-translate-x-1/2 ">
          <Link
            to={`${prefix}/home` as never}
            className="inline-flex min-h-11 items-center px-1 text-gray-600 hover:text-gray-900"
            activeProps={{
              className: 'inline-flex min-h-11 items-center px-1 font-semibold text-gray-900',
            }}
          >
            {t('nav.home')}
          </Link>
          <Link
            to={`${prefix}/products` as never}
            className="inline-flex min-h-11 items-center px-1 text-gray-600 hover:text-gray-900"
            activeProps={{
              className: 'inline-flex min-h-11 items-center px-1 font-semibold text-gray-900',
            }}
          >
            {t('nav.products')}
          </Link>
          {/* <Link
            to={`${prefix}/console` as never}
            className="inline-flex min-h-11 items-center gap-1 px-1 font-medium text-gray-400 hover:text-gray-700"
            activeProps={{
              className: 'inline-flex min-h-11 items-center gap-1 px-1 font-medium text-gray-700',
            }}
          >
            <Lock className="h-3 w-3" aria-hidden="true" />
            <span>{t('nav.console')}</span>
          </Link> */}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {/* Locale switcher */}
          <div className="inline-flex overflow-hidden rounded-full bg-gray-500/10">
            <button
              type="button"
              aria-pressed={locale === 'en'}
              onClick={() => switchLocale('en')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                locale === 'en' ? 'bg-gray-500/15' : 'hover:bg-white/5'
              }`}
            >
              EN
            </button>

            <button
              type="button"
              aria-pressed={locale === 'zh-TW'}
              onClick={() => switchLocale('zh-TW')}
              className={`px-3 py-1 text-xs font-medium transition-colors ${
                locale === 'zh-TW' ? 'bg-gray-500/15' : 'hover:bg-white/5'
              }`}
            >
              繁體
            </button>
          </div>

          <Link to={`${prefix}/get-a-quote` as never} className="inline-flex items-center">
            <Button size="sm">{t('nav.getQuote')}</Button>
          </Link>

          {/* <Link to={`${prefix}/login` as never} className="inline-flex items-center">
            <Button variant="outline" size="sm">
              {t('nav.login')}
            </Button>
          </Link> */}
        </div>
      </div>
    </header>
  )
}
