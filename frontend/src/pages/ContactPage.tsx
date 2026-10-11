import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks'
import { SITE_CONFIG } from '@/config/site'
import { QuotePage } from './QuotePage'

export function ContactPage() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <>
      <section className="company-section company-hero">
        <div className="company-container grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="company-eyebrow">{t('nav.contact')}</p>
            <h1 className="company-title mt-8">{t('company.contactPageTitle')}</h1>
            <p className="company-copy mt-8">{t('company.contactPageDesc')}</p>
          </div>
          <div className="flex flex-col items-start gap-4 lg:self-end">
            <a className="company-text-link break-all" href={`mailto:${SITE_CONFIG.contact.email}`}>
              {SITE_CONFIG.contact.email}
            </a>
            <a className="company-text-link" href={`tel:${SITE_CONFIG.contact.phone}`}>
              {SITE_CONFIG.contact.phone}
            </a>
            <Link to={`${prefix}/get-a-quote` as never} className="company-text-link">
              {t('company.quoteLink')}
            </Link>
          </div>
        </div>
      </section>
      <QuotePage facility />
    </>
  )
}
