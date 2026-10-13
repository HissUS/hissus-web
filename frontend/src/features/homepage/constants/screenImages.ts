import manifest from '@/assets/images/screen-image-manifest.json'
import type { CatalogImage } from '../components/CatalogExplorer/types'

const assets = import.meta.glob<string>('/src/assets/images/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function screenImage(file: keyof typeof manifest, altKey: string): CatalogImage {
  const image = manifest[file]
  const sources = image.sources.map(({ file, width }) => ({
    src: assets[`/src/assets/images/${file}`],
    width,
  }))
  return { src: sources.at(-1)!.src, altKey, width: image.width, height: image.height, sources }
}
