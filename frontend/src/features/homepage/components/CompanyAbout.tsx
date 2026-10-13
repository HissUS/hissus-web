import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import aboutSmall from '@/assets/images/factory/company-about-640.webp'
import aboutMedium from '@/assets/images/factory/company-about-1200.webp'
import aboutFull from '@/assets/images/factory/company-about-full.webp'
import { useLocale } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'
import { Reveal } from './Reveal'

export function CompanyAbout() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <section id="about" className="company-about" aria-labelledby="about-heading">
      <div className="company-about-art">
        <img
          src={getAssetUrl(aboutFull)}
          srcSet={`${getAssetUrl(aboutSmall)} 640w, ${getAssetUrl(aboutMedium)} 1200w, ${getAssetUrl(aboutFull)} 1672w`}
          sizes="100vw"
          width="1672"
          height="941"
          alt={t('company.aboutImageAlt')}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-right"
        />
        <div
          className="company-about-blend pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      </div>
      <div className="company-container relative z-10 py-12 sm:py-16 lg:py-24">
        <Reveal className="max-w-2xl lg:max-w-[48%]">
          <p className="company-eyebrow">{t('company.aboutLabel')}</p>
          <h2 id="about-heading" className="company-heading mt-6 whitespace-pre-line">
            {t('company.aboutTitle')}
          </h2>
          <p className="company-copy mt-6">{t('company.aboutDesc')}</p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600">
            {t('company.aboutPrinciple')}
          </p>
          <Link to={`${prefix}/factory/services` as never} className="company-text-link mt-8">
            {t('company.aboutLink')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
