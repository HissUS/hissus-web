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
            className="grid w-full max-w-5xl grid-cols-2 gap-3 p-1 sm:flex sm:flex-nowrap sm:items-center sm:justify-center sm:gap-4 sm:overflow-x-auto"
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
                  'w-full cursor-pointer flex items-center justify-center whitespace-normal px-2 py-2 sm:px-6 sm:py-2.5 rounded-2xl sm:rounded-full text-center text-sm leading-tight font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--primary]/40 focus-visible:ring-offset-2 sm:whitespace-nowrap sm:w-auto sm:text-base',
                  cat.id === activeId
                    ? 'bg-linear-to-r from-primary to-indigo-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 shadow-sm hover:border-primary/40 hover:text-primary hover:shadow-md',
                )}
              >
                <span className="mr-1.5 text-[0.8em] opacity-80">✦</span>
                <span>{t(cat.homepageNameKey ?? cat.nameKey)}</span>
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
