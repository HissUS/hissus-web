import { useTranslation } from 'react-i18next'
import { CompanyContact, FactoryImage, FACTORY_PHOTOS, Reveal } from '@/features/homepage'

export function AboutPage() {
  const { t } = useTranslation()
  return (
    <>
      <section className="company-section company-hero">
        <Reveal className="company-container">
          <p className="company-eyebrow">HISSUS</p>
          <h1 className="company-title mt-8 max-w-4xl">{t('company.aboutTitle')}</h1>
          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <p className="company-copy">{t('company.aboutDesc')}</p>
            <p className="company-copy border-l-2 border-primary pl-8">
              {t('company.aboutPrinciple')}
            </p>
          </div>
          <FactoryImage
            photo={FACTORY_PHOTOS[3]}
            className="mt-16 aspect-[2/1] w-full object-cover"
          />
        </Reveal>
      </section>
      <CompanyContact />
    </>
  )
}
