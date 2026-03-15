import { useMemo } from 'react'
import { CATALOG_DATA } from '@/features/homepage/constants'
import type { CatalogCategory } from './types'

export function useCatalogData(): CatalogCategory[] {
  return useMemo(() => CATALOG_DATA, [])
}
