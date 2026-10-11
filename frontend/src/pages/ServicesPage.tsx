import { useTranslation } from 'react-i18next'
import { CompanyContact, ExperienceSection, GmpSection } from '@/features/homepage'

export function ServicesPage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="company-section company-hero">
        <div className="company-container">
          <p className="company-eyebrow">{t('company.eyebrow')}</p>
          <h1 className="company-title mt-8 max-w-4xl">{t('company.servicesTitle')}</h1>
          <p className="company-copy mt-8 max-w-3xl">{t('company.servicesDesc')}</p>
        </div>
      </section>
      <section className="company-section">
        <div className="company-container grid gap-8 lg:grid-cols-2 lg:gap-16">
          <h2 className="company-heading">{t('company.scopeTitle')}</h2>
          <p className="company-copy">{t('company.scopeDesc')}</p>
        </div>
      </section>
      <ExperienceSection />
      <GmpSection />
      <CompanyContact />
    </>
  )
}
