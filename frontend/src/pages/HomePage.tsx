import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  CompanyContact,
  FactorySteps,
  FactoryGallery,
  FactoryHero,
  Reveal,
} from '@/features/homepage'
import { useLocale } from '@/hooks'

export function HomePage() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <>
      <FactoryHero />
      <section className="py-12 sm:py-16" aria-labelledby="intro-heading">
        <Reveal className="company-container grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="company-eyebrow">{t('company.introLabel')}</p>
            <h2 id="intro-heading" className="company-heading mt-4">
              {t('company.introTitle')}
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="company-copy">{t('company.introDesc')}</p>
            <Link to={`${prefix}/factory/about` as never} className="company-text-link mt-8">
              {t('company.introLink')}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
      <FactoryGallery />
      <FactorySteps />
      <CompanyContact compact />
    </>
  )
}
