import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  CompanyContact,
  ExperienceSection,
  GmpSection,
  PhotoPlaceholder,
} from '@/features/homepage'
import { useLocale } from '@/hooks'
import screenImage from '@/assets/images/multi_handle/ML_screendoor_hori.jpg'
import screenImageSmall from '@/assets/images/multi_handle/ML_screendoor_hori-800.webp'
import screenImageLarge from '@/assets/images/multi_handle/ML_screendoor_hori-1600.webp'

export function HomePage() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <>
      <section className="company-hero" aria-labelledby="company-hero-heading">
        <div className="company-container grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div className="py-8 lg:py-16">
            <p className="company-eyebrow">{t('company.eyebrow')}</p>
            <h1 id="company-hero-heading" className="company-title mt-8">
              {t('company.heroTitle')}
            </h1>
            <p className="company-copy mt-8 max-w-xl">{t('company.heroDesc')}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`${prefix}/contact` as never} className="company-button">
                {t('nav.discuss')}
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link to={`${prefix}/services` as never} className="company-text-link">
                {t('company.heroLink')}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <PhotoPlaceholder />
        </div>
      </section>
      <section className="company-section" aria-labelledby="intro-heading">
        <div className="company-container grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="company-eyebrow">{t('company.introLabel')}</p>
            <h2 id="intro-heading" className="company-heading mt-8">
              {t('company.introTitle')}
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="company-copy">{t('company.introDesc')}</p>
            <Link to={`${prefix}/services` as never} className="company-text-link mt-8">
              {t('company.introLink')}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <ExperienceSection />
      <GmpSection />
      <section className="company-section bg-gray-50" aria-labelledby="photo-heading">
        <div className="company-container grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="company-eyebrow">{t('company.photosLabel')}</p>
            <h2 id="photo-heading" className="company-heading mt-8">
              {t('company.photosTitle')}
            </h2>
            <p className="company-copy mt-8">{t('company.photosDesc')}</p>
          </div>
          <PhotoPlaceholder compact />
        </div>
      </section>
      <section className="company-section" aria-labelledby="screens-heading">
        <div className="company-container grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <figure>
            <img
              src={screenImage}
              srcSet={`${screenImageSmall} 800w, ${screenImageLarge} 1600w`}
              sizes="(min-width: 1024px) 50vw, 100vw"
              width="2048"
              height="1536"
              loading="lazy"
              decoding="async"
              alt={t('company.screenAlt')}
              className="aspect-4/3 w-full object-cover"
            />
            <figcaption className="mt-4 text-sm leading-relaxed text-gray-600">
              {t('company.screenCaption')}
            </figcaption>
          </figure>
          <div>
            <p className="company-eyebrow">{t('company.screensLabel')}</p>
            <h2 id="screens-heading" className="company-heading mt-8">
              {t('company.screensTitle')}
            </h2>
            <p className="company-copy mt-8">{t('company.screensDesc')}</p>
            <Link
              to={`${prefix}/window-screen-solutions` as never}
              className="company-text-link mt-8"
            >
              {t('company.screensLink')}
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <CompanyContact />
    </>
  )
}
