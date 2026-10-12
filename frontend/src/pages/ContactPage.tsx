import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks'
import { FacilityInquiryForm } from '@/features/inquiry'

export function ContactPage() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{t('company.contactPageTitle')}</h1>
      <p className="mb-4 text-lg text-gray-600">{t('company.contactPageDesc')}</p>
      <Link to={`${prefix}/get-a-quote` as never} className="company-text-link mb-8">
        {t('company.quoteLink')}
      </Link>
      <FacilityInquiryForm />
    </div>
  )
}
