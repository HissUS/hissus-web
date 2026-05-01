import type { LucideIcon } from 'lucide-react'

export interface CatalogSpec {
  icon: LucideIcon
  labelKey: string
}

export interface CatalogImage {
  src: string
  altKey: string
}

export interface CatalogVideo {
  url: string
  titleKey?: string
}

export interface CatalogCategory {
  id: string
  nameKey: string
  homepageNameKey?: string
  mobileNameKey?: string
  summaryKey?: string
  descriptionKey?: string
  availabilityKey?: string
  statusKey?: string
  images: CatalogImage[]
  videos?: CatalogVideo[]
  specs: CatalogSpec[]
}
