import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getAssetUrl } from '@/lib/utils'
import type { CatalogImage } from './types'

interface GalleryCarouselProps {
  images: CatalogImage[]
}

// Embla loop requires total slide width > viewport width.
// With 3 slides visible, we need at least 2 extra slides as cloning buffer.
// Duplicate the array until we have ≥ 7 slides to guarantee a smooth loop.
function ensureLoopBuffer(imgs: CatalogImage[]): CatalogImage[] {
  if (imgs.length >= 7) return imgs
  const repeated = [...imgs]
  while (repeated.length < 7) repeated.push(...imgs)
  return repeated
}

export function GalleryCarousel({ images }: GalleryCarouselProps) {
  const { t } = useTranslation()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const showArrows = images.length > 3
  const displayImages = showArrows ? ensureLoopBuffer(images) : images

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="group relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="-ml-4 flex">
          {displayImages.map((img, i) => (
            <div key={i} className="min-w-0 basis-1/3 shrink-0 pl-4">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={getAssetUrl(img.src)}
                  alt={t(img.altKey)}
                  className="w-full aspect-4/3 object-cover hover:scale-[1.03] transition-transform duration-300"
                />
                {/* Subtle bottom gradient for depth */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous images"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/60 shadow-md backdrop-blur-md transition-opacity duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next images"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/60 shadow-md backdrop-blur-md transition-opacity duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}
    </div>
  )
}
