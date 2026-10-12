import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import heroSmall from '@/assets/images/factory/factory-hero-640.webp'
import heroMedium from '@/assets/images/factory/factory-hero-1200.webp'
import heroFull from '@/assets/images/factory/factory-hero-full.webp'
import { useLocale } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'
import { Reveal } from './Reveal'

export function FactoryHero() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <section
      className="factory-hero relative isolate flex min-h-[600px] items-center overflow-hidden bg-gray-950 py-24 text-white sm:min-h-[640px]"
      aria-labelledby="company-hero-heading"
    >
      <img
        src={getAssetUrl(heroFull)}
        srcSet={`${getAssetUrl(heroSmall)} 640w, ${getAssetUrl(heroMedium)} 1200w, ${getAssetUrl(heroFull)} 1672w`}
        sizes="100vw"
        width="1672"
        height="941"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center] animate-in fade-in duration-700"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-gray-950/90 via-gray-950/65 to-gray-950/25"
      />
      <div className="company-container">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-blue-100">
            {t('company.eyebrow')}
          </p>
          <h1 id="company-hero-heading" className="company-title mt-8">
            {t('company.heroTitle')}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/90">
            {t('company.heroDesc')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={`${prefix}/contact` as never} className="company-button company-button-light">
              {t('nav.discuss')}
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to={`${prefix}/services` as never}
              className="inline-flex items-center gap-4 px-2 py-2 text-white underline underline-offset-8"
            >
              {t('company.heroLink')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
      <p className="absolute bottom-4 right-4 rounded bg-gray-950/60 px-3 py-2 text-xs text-white/85">
        {t('company.heroImageNote')}
      </p>
    </section>
  )
}
