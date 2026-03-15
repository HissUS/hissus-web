import type { LucideIcon } from 'lucide-react'

export interface CatalogSpec {
  icon: LucideIcon
  labelKey: string
}

export interface CatalogImage {
  src: string
  altKey: string
}

export interface CatalogCategory {
  id: string
  nameKey: string
  images: CatalogImage[]
  specs: CatalogSpec[]
}
