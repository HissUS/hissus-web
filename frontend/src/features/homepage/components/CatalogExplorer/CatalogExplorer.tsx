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
    <section aria-label={t('products.featured.heading')} className="bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <h2 className="text-center text-4xl font-bold text-gray-900">
          {t('products.featured.heading')}
        </h2>

        {/* Category Tabs */}
        <div className="mt-12 flex justify-center gap-8 border-b border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors',
                cat.id === activeId
                  ? 'border-b-2 border-[--primary] text-gray-900'
                  : 'text-gray-500 hover:text-gray-800',
              )}
            >
              {t(cat.nameKey)}
            </button>
          ))}
        </div>

        {/* Gallery + Specs */}
        <div className="mt-10">
          <GalleryCarousel images={active.images} />
          <SpecSection
            specs={active.specs}
            detailsHref={detailsHref}
          />
        </div>
      </div>
    </section>
  )
}
