import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useLocale } from '@/hooks'
import { useCatalogData } from './useCatalogData'
import { GalleryCarousel } from './GalleryCarousel'
import { SpecSection } from './SpecSection'

export function CatalogExplorer() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  const categories = useCatalogData()
  const [activeId, setActiveId] = useState(categories[0].id)
  const active = categories.find((c) => c.id === activeId) ?? categories[0]

  const detailsHref = `${prefix}/products?tab=${active.id}`

  return (
    <section
      aria-label={t('products.featured.heading')}
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#F8F9FA] py-12 sm:py-16"
    >
      <div className="w-full max-w-none px-3 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          {t('products.featured.heading')}
        </h2>

        <div className="mt-6 flex w-full justify-center sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          <div
            role="tablist"
            aria-label={t('products.featured.heading')}
            className="grid w-full max-w-5xl grid-cols-2 gap-3 border-b border-gray-200 pb-2 sm:flex sm:flex-nowrap sm:items-center sm:justify-center sm:gap-5 sm:overflow-x-auto"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={cat.id === activeId}
                onClick={() => {
                  if (cat.id === activeId) return
                  setActiveId(cat.id)
                }}
                className={cn(
                  'w-full whitespace-nowrap px-1 pb-2 text-center text-xs font-semibold tracking-wide text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]/40 focus-visible:ring-offset-2 sm:w-auto sm:text-left sm:pb-3 sm:text-sm',
                  cat.id === activeId
                    ? 'border-b-2 border-primary text-gray-900'
                    : 'border-b-2 border-transparent hover:text-gray-800',
                )}
              >
                {t(cat.homepageNameKey ?? cat.nameKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-10 animate-in fade-in duration-700 delay-300 fill-mode-both">
          <GalleryCarousel images={active.images} videos={active.videos} />
          <SpecSection specs={active.specs} detailsHref={detailsHref} />
        </div>
      </div>
    </section>
  )
}
