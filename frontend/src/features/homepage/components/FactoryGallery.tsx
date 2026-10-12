import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FACTORY_PHOTOS } from '../constants'
import { useFactoryGallery, useFactoryCarousel } from '../hooks'
import { FactoryImage } from './FactoryImage'
import { Reveal } from './Reveal'

export function FactoryGallery() {
  const { t } = useTranslation()
  const { selected, dialog, open, move, close } = useFactoryGallery()
  const { viewport, position, scroll } = useFactoryCarousel()
  const photo = selected === null ? null : FACTORY_PHOTOS[selected]
  return (
    <section
      id="factory-gallery"
      className="company-section bg-gray-50"
      aria-labelledby="photo-heading"
    >
      <div className="company-container">
        <Reveal className="max-w-3xl">
          <p className="company-eyebrow">{t('company.photosLabel')}</p>
          <h2 id="photo-heading" className="company-heading mt-8">
            {t('company.photosTitle')}
          </h2>
          <p className="company-copy mt-8">{t('company.photosDesc')}</p>
        </Reveal>
        <Reveal className="mt-16">
          <div
            data-factory-carousel
            role="region"
            aria-label={t('company.photosLabel')}
            aria-roledescription={t('gallery.carousel')}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()
                scroll(event.key === 'ArrowLeft' ? 'previous' : 'next')
              }
            }}
          >
            <div ref={viewport} className="overflow-hidden">
              <div className="-ml-8 flex touch-pan-y">
                {FACTORY_PHOTOS.map((item, index) => (
                  <figure
                    key={item.id}
                    className="min-w-0 shrink-0 basis-full pl-8 sm:basis-1/2 lg:basis-1/3"
                  >
                    <button
                      type="button"
                      onClick={(event) => open(index, event.currentTarget)}
                      aria-label={t('company.viewPhoto', { caption: t(item.captionKey) })}
                      className="group relative block w-full overflow-hidden rounded-2xl bg-gray-200"
                    >
                      <FactoryImage
                        photo={item}
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <Expand
                        className="absolute bottom-4 right-4 h-8 w-8 rounded bg-black/60 p-1 text-white"
                        aria-hidden="true"
                      />
                    </button>
                    <figcaption className="mt-4 text-sm leading-relaxed text-gray-600">
                      {t(item.captionKey)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              {(['previous', 'next'] as const).map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => scroll(direction)}
                  disabled={!position[direction]}
                  aria-label={t(`gallery.${direction}`)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-primary hover:text-primary disabled:cursor-default disabled:opacity-35"
                >
                  {direction === 'previous' ? (
                    <ChevronLeft aria-hidden="true" />
                  ) : (
                    <ChevronRight aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <dialog
        ref={dialog}
        className="factory-dialog fixed inset-0 m-auto max-h-[95dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto bg-gray-950 p-4 text-white sm:p-8"
        aria-label={t('company.photosLabel')}
        onCancel={close}
        onClose={close}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            move(-1)
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            move(1)
          }
        }}
      >
        {photo && (
          <>
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={close}
                aria-label={t('gallery.close')}
                className="flex items-center justify-center"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <FactoryImage
              photo={photo}
              sizes="90vw"
              className="max-h-[65dvh] w-full object-contain"
            />
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => move(-1)}
                aria-label={t('gallery.previous')}
                className="shrink-0"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <p aria-live="polite" className="text-center text-sm">
                {t(photo.captionKey)}
                <span className="mt-2 block tabular-nums">
                  {(selected ?? 0) + 1} / {FACTORY_PHOTOS.length}
                </span>
              </p>
              <button
                type="button"
                onClick={() => move(1)}
                aria-label={t('gallery.next')}
                className="shrink-0"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </dialog>
    </section>
  )
}
