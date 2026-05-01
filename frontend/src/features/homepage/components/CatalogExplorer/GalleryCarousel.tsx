import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getAssetUrl } from '@/lib/utils'
import type { CatalogImage, CatalogVideo } from './types'

interface GalleryCarouselProps {
  images: CatalogImage[]
  videos?: CatalogVideo[]
}

// Embla loop requires total slide width > viewport width.
// With 3 slides visible, we need at least 2 extra slides as cloning buffer.
// Duplicate the array until we have ≥ 7 slides to guarantee a smooth loop.
function ensureLoopBuffer<T>(items: T[]): T[] {
  if (items.length >= 7) return items
  const repeated = [...items]
  while (repeated.length < 7) repeated.push(...items)
  return repeated
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null
    }

    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
  } catch {
    return null
  }

  return null
}

export function GalleryCarousel({ images, videos = [] }: GalleryCarouselProps) {
  const { t } = useTranslation()
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [videoEmblaRef, videoEmblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selectedImage, setSelectedImage] = useState<CatalogImage | null>(null)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const showArrows = images.length > 3
  const displayImages = showArrows ? ensureLoopBuffer(images) : images

  const videoItems = videos
    .map((video) => ({
      ...video,
      id: getYouTubeId(video.url),
    }))
    .filter((video) => video.id)

  const displayVideos = videoItems
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const showVideoArrows = canScrollPrev || canScrollNext

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const scrollVideoPrev = useCallback(() => videoEmblaApi?.scrollPrev(), [videoEmblaApi])
  const scrollVideoNext = useCallback(() => videoEmblaApi?.scrollNext(), [videoEmblaApi])

  useEffect(() => {
    if (!selectedImage) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedImage])

  useEffect(() => {
    if (!videoEmblaApi) return

    const update = () => {
      setCanScrollPrev(videoEmblaApi.canScrollPrev())
      setCanScrollNext(videoEmblaApi.canScrollNext())
    }

    update()
    videoEmblaApi.on('select', update)
    videoEmblaApi.on('reInit', update)

    return () => {
      videoEmblaApi.off('select', update)
      videoEmblaApi.off('reInit', update)
    }
  }, [videoEmblaApi, videoItems.length])

  const canPortal = typeof document !== 'undefined'

  return (
    <>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-md font-semibold text-gray-800">{t('products.gallery.imagesTitle')}</h2>
      </div>
      <div className="group relative min-w-0 max-w-full overflow-x-clip">
        <div className="w-full max-w-full overflow-hidden" ref={emblaRef}>
          <div className="flex min-w-0 w-full px-4">
            {displayImages.map((img, i) => (
              <div
                key={`${img.src}-${i}`}
                className="min-w-0 shrink-0 basis-full px-2 sm:basis-1/2 lg:basis-1/3"
              >
                <button
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  aria-label={t(img.altKey)}
                  className="group/image relative block w-full overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <img
                    src={getAssetUrl(img.src)}
                    alt={t(img.altKey)}
                    className="w-full aspect-4/3 object-cover transition-transform duration-300 group-hover/image:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent" />
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                    {t('products.gallery.zoomHint')}
                  </span>
                  <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/image:bg-black/5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {showArrows && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label="Previous images"
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-md backdrop-blur-md transition-opacity duration-200 opacity-100 md:left-3 md:h-9 md:w-9 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Next images"
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-md backdrop-blur-md transition-opacity duration-200 opacity-100 md:right-3 md:h-9 md:w-9 md:opacity-0 md:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {videoItems.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-md font-semibold text-gray-800">
              {' '}
              {t('products.gallery.videosTitle')}
            </h2>
          </div>
          <div className="group relative mt-3 min-w-0 max-w-full overflow-x-clip">
            <div className="w-full overflow-hidden" ref={videoEmblaRef}>
              <div className="flex px-4">
                {displayVideos.map((video, index) => {
                  const id = video.id as string
                  const isActive = activeVideo === id

                  const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=${
                    isActive ? 0 : 1
                  }&loop=1&playlist=${id}&controls=${isActive ? 1 : 0}&modestbranding=1&rel=0&playsinline=1`

                  return (
                    <div
                      key={`${id}-${index}`}
                      className="shrink-0 basis-full px-2 sm:basis-2/3 lg:basis-1/2"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-black/5 shadow-sm">
                        <div className="relative aspect-video w-full">
                          <iframe
                            className={`h-full w-full ${isActive ? '' : 'pointer-events-none'}`}
                            src={src}
                            title={
                              video.titleKey ? t(video.titleKey) : t('products.gallery.videoTitle')
                            }
                            allow="autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                          />

                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => setActiveVideo(id)}
                              className="absolute inset-0 flex items-center justify-center bg-black/10 text-white hover:bg-black/20"
                            >
                              <span className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold shadow-sm">
                                <Play className="h-3.5 w-3.5" />
                                {t('products.gallery.playHint')}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Arrows */}
            {showVideoArrows && (
              <>
                <button
                  onClick={scrollVideoPrev}
                  disabled={!canScrollPrev}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-md backdrop-blur-md md:opacity-0 md:group-hover:opacity-100
    ${!canScrollPrev ? 'hidden' : ''}`}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>

                <button
                  onClick={scrollVideoNext}
                  disabled={!canScrollNext}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/80 bg-white/70 shadow-md backdrop-blur-md md:opacity-0 md:group-hover:opacity-100
    ${!canScrollNext ? 'hidden' : ''}`}
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

      {selectedImage && canPortal
        ? createPortal(
            <div
              role="presentation"
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label={t(selectedImage.altKey)}
                onClick={(event) => event.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl md:rounded-3xl"
              >
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close enlarged image"
                  className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 md:right-3 md:top-3 md:h-10 md:w-10"
                >
                  <X className="h-5 w-5" />
                </button>
                <img
                  src={getAssetUrl(selectedImage.src)}
                  alt={t(selectedImage.altKey)}
                  className="max-h-[90vh] w-full object-contain"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
