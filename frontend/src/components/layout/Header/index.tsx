import { Link } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale } from '@/hooks'
import { Button } from '@/components/ui-wrapper'
import { getAssetUrl } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Brand Logo */}
        <Link to={`${prefix}/home` as never} className="inline-flex items-center">
          <img src={getAssetUrl(SITE_CONFIG.assets.logo)} alt="Hissus" className="h-8 w-auto" />
        </Link>

        {/* Center: Primary Navigation */}
        <nav className="flex items-center gap-6 text-sm">
          <Link
            to={`${prefix}/home` as never}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
            activeProps={{ className: 'inline-flex items-center font-semibold text-gray-900' }}
          >
            {t('nav.home')}
          </Link>
          <Link
            to={`${prefix}/products` as never}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
            activeProps={{ className: 'inline-flex items-center font-semibold text-gray-900' }}
          >
            {t('nav.products')}
          </Link>
          <Link
            to={`${prefix}/console` as never}
            className="inline-flex items-center gap-1 font-medium text-gray-400 hover:text-gray-700"
            activeProps={{ className: 'inline-flex items-center gap-1 font-medium text-gray-700' }}
          >
            <Lock className="h-3 w-3" aria-hidden="true" />
            <span>{t('nav.console')}</span>
          </Link>
        </nav>

        {/* Right: User Actions */}
        <div className="flex items-center gap-3">
          <Link to={`${prefix}/get-a-quote` as never} className="inline-flex items-center">
            <Button size="sm">
              {t('nav.getQuote')}
            </Button>
          </Link>
          <Link to={`${prefix}/login` as never} className="inline-flex items-center">
            <Button variant="outline" size="sm">
              {t('nav.login')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
