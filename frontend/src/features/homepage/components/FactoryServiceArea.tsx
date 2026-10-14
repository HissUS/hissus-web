import { useTranslation } from 'react-i18next'
import mapSmall from '@/assets/images/factory/service-area-map-640.webp'
import mapLarge from '@/assets/images/factory/service-area-map-1000.webp'
import { getAssetUrl } from '@/lib/utils'
import { Reveal } from './Reveal'

export function FactoryServiceArea() {
  const { t } = useTranslation()
  return (
    <section
      id="service-area"
      className="company-section bg-[#faf8f5]"
      aria-labelledby="service-area-heading"
    >
      <Reveal className="company-container grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <div>
          <p className="company-eyebrow">{t('company.serviceArea.label')}</p>
          <h2 id="service-area-heading" className="company-heading mt-6">
            {t('company.serviceArea.title')}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600">
            {t('company.serviceArea.nationwide')}
          </p>
        </div>
        <figure className="min-w-0">
          <img
            src={getAssetUrl(mapLarge)}
            srcSet={`${getAssetUrl(mapSmall)} 640w, ${getAssetUrl(mapLarge)} 1000w`}
            sizes="(min-width: 1024px) 55vw, 100vw"
            width={1000}
            height={667}
            alt={t('company.serviceArea.mapAlt')}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full"
          />
          <figcaption className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full bg-[#cdb69a]" />
              {t('company.serviceArea.texasLegend')}
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-3 w-3 shrink-0 rounded-full border border-[#bda184] bg-white"
              />
              {t('company.serviceArea.usaLegend')}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
