import { useTranslation } from 'react-i18next'
import { getAssetUrl } from '@/lib/utils'
import type { FactoryPhoto } from '../constants'

export function FactoryImage({
  photo,
  priority = false,
  className = '',
  sizes = '(min-width: 1024px) 45vw, 100vw',
}: {
  photo: FactoryPhoto
  priority?: boolean
  className?: string
  sizes?: string
}) {
  const { t } = useTranslation()
  return (
    <img
      src={getAssetUrl(photo.src)}
      srcSet={photo.sources
        .map((src, index) => `${getAssetUrl(src)} ${[640, 1200, 1800][index]}w`)
        .join(', ')}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={t(photo.captionKey)}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  )
}
