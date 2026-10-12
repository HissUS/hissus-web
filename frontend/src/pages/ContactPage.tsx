import { useTranslation } from 'react-i18next'
import { FacilityInquiryForm } from '@/features/inquiry'

export function ContactPage() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-4 text-3xl font-bold">{t('company.contactPageTitle')}</h1>
      <p className="mb-8 text-lg text-gray-600">{t('company.contactPageDesc')}</p>
      <FacilityInquiryForm />
    </div>
  )
}
