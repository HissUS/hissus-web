import { Facebook, Mail, Phone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { useLocale, useLocaleSwitcher } from '@/hooks'
import { COUNTRY_TO_LOCALE, DEFAULT_LOCALE } from '@/locales/config'
import { getAssetUrl } from '@/lib/utils'

type ContactLink = { label: string; href: string }

function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" />
      <path d="M12 6c-3.87 0-7 2.46-7 5.5 0 1.72.93 3.26 2.39 4.29-.16.56-.52 1.84-.59 2.11-.09.34.13.34.27.25.11-.07 1.77-1.17 2.49-1.65.46.08.94.12 1.44.12 3.87 0 7-2.46 7-5.5S15.87 6 12 6z" />
    </svg>
  )
}

function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M9.5 3C6.46 3 4 5.01 4 7.5c0 1.35.65 2.56 1.68 3.41l-.93 2.59 2.87-1.44c.59.16 1.22.24 1.88.24 3.04 0 5.5-2.01 5.5-4.5S12.54 3 9.5 3z" />
      <path d="M14.5 9.5c.33-.04.67-.06 1-.06 3.04 0 5.5 2.01 5.5 4.5 0 1.35-.65 2.56-1.68 3.41l.93 2.59-2.87-1.44c-.59.16-1.22.24-1.88.24-3.04 0-5.5-2.01-5.5-4.5 0-.11 0-.22.01-.33" />
    </svg>
  )
}

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" aria-hidden="true" />,
  email: <Mail className="h-4 w-4" aria-hidden="true" />,
  line: <LineIcon className="h-4 w-4" />,
  wechat: <WeChatIcon className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" aria-hidden="true" />,
}

function isContactLink(value: unknown): value is ContactLink {
  return typeof value === 'object' && value !== null && 'href' in value
}

export function Footer() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const switchLocale = useLocaleSwitcher()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-8">
          
          {/* Logo Section */}
          <div className="flex justify-center sm:justify-start">
            <img
              src={getAssetUrl(SITE_CONFIG.assets.logo)}
              alt="Hissus"
              className="h-18 w-auto brightness-0 invert opacity-80 sm:h-16"
            />
          </div>

          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:text-left">
            {/* Contact */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-100">
                {t('footer.contactUs')}
              </h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(SITE_CONFIG.contact).map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                      {CONTACT_ICONS[key]}
                    </span>
                    <span>
                      {isContactLink(value) ? (
                        <a
                          href={value.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline-offset-2 hover:text-zinc-100 hover:underline"
                        >
                          {value.label}
                        </a>
                      ) : (
                        value
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language Switcher */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-100">
                {t('footer.language')}
              </h3>
              <div className="flex flex-wrap justify-center gap-2 text-sm sm:justify-start">
                <button
                  onClick={() => switchLocale(DEFAULT_LOCALE)}
                  className={`rounded px-2 py-1 ${
                    locale === DEFAULT_LOCALE
                      ? 'bg-zinc-700 font-semibold text-zinc-100'
                      : 'text-zinc-400 hover:text-zinc-100'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                {Object.entries(COUNTRY_TO_LOCALE).map(([code, countryLocale]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(countryLocale)}
                    className={`rounded px-2 py-1 uppercase ${
                      locale === countryLocale
                        ? 'bg-zinc-700 font-semibold text-zinc-100'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                    aria-label={`Switch to ${countryLocale}`}
                  >
                    {"繁體"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          © {year} Hissus. {t('footer.rights')}
        </div>
      </div>
    </footer>
  )
}
