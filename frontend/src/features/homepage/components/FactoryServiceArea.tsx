import { useTranslation } from 'react-i18next'
import usaSmall from '@/assets/images/factory/service-area-map-640.webp'
import usaLarge from '@/assets/images/factory/service-area-map-1000.webp'
import taiwanSmall from '@/assets/images/factory/taiwan-map-240.webp'
import taiwanLarge from '@/assets/images/factory/taiwan-map-480.webp'
import { getAssetUrl } from '@/lib/utils'

/** Reuse the existing artwork; the line shows the client connection to Texas. */
export function FactoryServiceArea() {
  const { t } = useTranslation()
  return (
    <figure
      role="img"
      aria-label={t('company.connectionMap.alt')}
      className="relative aspect-[8/5] min-w-0 w-full"
    >
      <img
        src={getAssetUrl(taiwanLarge)}
        srcSet={`${getAssetUrl(taiwanSmall)} 240w, ${getAssetUrl(taiwanLarge)} 480w`}
        sizes="(min-width: 1024px) 112px, 18vw"
        width={480}
        height={720}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute left-0 top-[22%] h-auto w-[18%]"
      />
      <img
        src={getAssetUrl(usaLarge)}
        srcSet={`${getAssetUrl(usaSmall)} 640w, ${getAssetUrl(usaLarge)} 1000w`}
        sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 78vw"
        width={1000}
        height={667}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute right-0 top-[7%] h-auto w-[78%]"
      />
      <svg
        viewBox="0 0 1000 625"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M 90 274 C 240 95 390 205 555 420"
          fill="none"
          stroke="#a98d71"
          strokeWidth="1.8"
          strokeDasharray="1 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="90" cy="274" r="5" fill="#a98d71" />
        <circle cx="555" cy="420" r="6" fill="#a98d71" stroke="#fffdf9" strokeWidth="2" />
      </svg>
      <span
        aria-hidden="true"
        className="absolute left-[3%] top-[69%] text-sm font-medium text-gray-600 sm:text-base"
      >
        {t('company.connectionMap.taiwan')}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-[54%] top-[83%] text-sm font-medium text-gray-600 sm:text-base"
      >
        {t('company.connectionMap.texas')}
      </span>
    </figure>
  )
}
