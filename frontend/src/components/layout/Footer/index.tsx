import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale, useLocaleSwitcher } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'

export function Footer() {
  const { t } = useTranslation()
  const { country, locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const prefix = country ? `/${country}` : ''
  return (
    <footer className="bg-zinc-950 text-zinc-200">
      <div className="company-container py-16">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr_1.5fr]">
          <div>
            <img
              src={getAssetUrl(SITE_CONFIG.assets.logo)}
              alt="HISSUS"
              width="569"
              height="268"
              className="h-16 w-auto brightness-0 invert"
            />
            <p className="mt-8 max-w-xs text-sm leading-relaxed text-zinc-300">
              {t('company.eyebrow')}
            </p>
          </div>
          <nav aria-label={t('nav.primary')} className="flex flex-col items-start gap-2 text-sm">
            {[
              ['services', 'services'],
              ['window-screen-solutions', 'screens'],
              ['about', 'about'],
              ['contact', 'contact'],
            ].map(([path, key]) => (
              <Link
                key={path}
                to={`${prefix}/${path}` as never}
                className="inline-flex items-center hover:underline"
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
          </nav>
          <div>
            <h2 className="font-medium">{t('footer.contactUs')}</h2>
            <dl className="mt-8 space-y-4 text-sm">
              {Object.entries(SITE_CONFIG.contact).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[5rem_1fr] gap-4">
                  <dt className="text-zinc-300">{t(`contactLabels.${key}`)}</dt>
                  <dd className="min-w-0 break-words">
                    {typeof value === 'object' ? (
                      <a
                        href={value.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center hover:underline"
                      >
                        {value.label}
                      </a>
                    ) : key === 'email' || key === 'phone' ? (
                      <a
                        href={`${key === 'email' ? 'mailto' : 'tel'}:${value}`}
                        className="inline-flex items-center hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-8 border-t border-zinc-700 pt-8 text-sm text-zinc-300">
          <p>
            © {new Date().getFullYear()} HISSUS. {t('footer.rights')}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => switchLocale('en')}
              aria-pressed={locale === 'en'}
              className="aria-pressed:underline"
            >
              {t('nav.english')}
            </button>
            <button
              onClick={() => switchLocale('zh-TW')}
              aria-pressed={locale === 'zh-TW'}
              className="aria-pressed:underline"
            >
              {t('nav.chinese')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
