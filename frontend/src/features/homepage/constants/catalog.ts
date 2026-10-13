import { ArrowLeftRight, Shield, Sun } from 'lucide-react'
import type { CatalogCategory } from '../components/CatalogExplorer/types'

import { screenImage } from './screenImages'

const COMMON_SPECS = [
  { icon: Shield, labelKey: 'products.spec.midgeProof' },
  { icon: Sun, labelKey: 'products.spec.uvResistance' },
  { icon: ArrowLeftRight, labelKey: 'products.spec.trackless' },
]

export const CATALOG_DATA: CatalogCategory[] = [
  {
    id: 'multi-handle',
    nameKey: 'products.multiHandle',
    homepageNameKey: 'products.homepage.multiHandle',
    mobileNameKey: 'products.multiHandleShort',
    summaryKey: 'products.multiHandleSummary',
    descriptionKey: 'products.multiHandleDescription',
    availabilityKey: 'products.page.availability.available',
    statusKey: 'products.page.status.wideSpan',
    images: [
      screenImage('multi_handle/ML_screendoor_fullview.jpg', 'products.photos.mlFullview'),
      screenImage('multi_handle/ML_screendoor_hori.jpg', 'products.photos.mlHori'),
      screenImage('multi_handle/ML_screendoor_inner.jpg', 'products.photos.mlInner'),
      screenImage('multi_handle/ML_screendoor_outter.jpg', 'products.photos.mlOutter'),
      screenImage('multi_handle/ML_screendoor_vert.jpg', 'products.photos.mlVert'),
    ],
    videos: [
      { url: 'https://youtu.be/-A_QTFndg_A', titleKey: 'products.multiHandle' },
      { url: 'https://youtu.be/3Cwey3f95vk', titleKey: 'products.multiHandle' },
      { url: 'https://youtu.be/EEiIbfY1zBI', titleKey: 'products.multiHandle' },
      { url: 'https://youtu.be/k7POp6pt9DE', titleKey: 'products.multiHandle' },
    ],
    specs: COMMON_SPECS,
  },
  {
    id: 'double-handle',
    nameKey: 'products.doubleHandle',
    homepageNameKey: 'products.homepage.doubleHandle',
    mobileNameKey: 'products.doubleHandleShort',
    summaryKey: 'products.doubleHandleSummary',
    descriptionKey: 'products.doubleHandleDescription',
    availabilityKey: 'products.page.availability.available',
    statusKey: 'products.page.status.entry',
    images: [screenImage('double_handle/DH_screendoor.jpg', 'products.photos.dhScreendoor')],
    videos: [
      { url: 'https://youtu.be/WVjZmSLttiM', titleKey: 'products.doubleHandle' },
      { url: 'https://youtu.be/f-OyCptcEXI', titleKey: 'products.doubleHandle' },
      { url: 'https://youtu.be/FvmzlKNGlFQ', titleKey: 'products.doubleHandle' },
    ],
    specs: COMMON_SPECS,
  },
  {
    id: 'single-handle',
    nameKey: 'products.singleHandle',
    homepageNameKey: 'products.homepage.singleHandle',
    mobileNameKey: 'products.singleHandleShort',
    summaryKey: 'products.singleHandleSummary',
    descriptionKey: 'products.singleHandleDescription',
    availabilityKey: 'products.page.availability.available',
    statusKey: 'products.page.status.popular',
    images: [
      screenImage('single_handle/SH_front_screendoor.jpg', 'products.photos.shFront'),
      screenImage('single_handle/SH_backyard_screendoor.jpg', 'products.photos.shBackyard'),
      screenImage('single_handle/SH_garage_screendoor.jpg', 'products.photos.shGarage'),
      screenImage('single_handle/SH_screendoor.jpg', 'products.photos.shScreendoor'),
    ],
    videos: [{ url: 'https://youtu.be/YDsOInyymZI', titleKey: 'products.singleHandle' }],
    specs: COMMON_SPECS,
  },
  {
    id: 'windows',
    nameKey: 'products.windows',
    homepageNameKey: 'products.homepage.windows',
    mobileNameKey: 'products.windowsShort',
    summaryKey: 'products.windowsSummary',
    descriptionKey: 'products.windowsDescription',
    availabilityKey: 'products.page.availability.available',
    statusKey: 'products.page.status.window',
    images: [screenImage('windows/windows.jpg', 'products.photos.windowsImg')],
    videos: [{ url: 'https://youtu.be/E988XNzyi-g', titleKey: 'products.windows' }],
    specs: COMMON_SPECS,
  },
]
