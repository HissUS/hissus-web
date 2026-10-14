import { useTranslation } from 'react-i18next'
import {
  CompanyContact,
  ExperienceSection,
  GmpSection,
  FactoryImage,
  FACTORY_PHOTOS,
  FactoryServices,
  Reveal,
} from '@/features/homepage'

export function ServicesPage() {
  const { t } = useTranslation()
  const entrancePhoto = FACTORY_PHOTOS.find((photo) => photo.id === '1801')!
  return (
    <>
      <section className="company-section company-hero">
        <Reveal className="company-container grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
            <p className="company-eyebrow">{t('company.eyebrow')}</p>
            <h1 className="company-title mt-8 max-w-4xl">{t('company.servicesTitle')}</h1>
            <p className="company-copy mt-8 max-w-3xl">{t('company.servicesDesc')}</p>
          </div>
          <div className="company-service-image relative overflow-hidden">
            <FactoryImage
              photo={entrancePhoto}
              priority
              className="aspect-[4/3] w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="company-service-blend pointer-events-none absolute inset-0"
            />
          </div>
        </Reveal>
      </section>
      <FactoryServices />
      <ExperienceSection />
      <GmpSection />
      <CompanyContact />
    </>
  )
}
