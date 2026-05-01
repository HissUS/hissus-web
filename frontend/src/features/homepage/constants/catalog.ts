import { ArrowLeftRight, Shield, Sun } from 'lucide-react'
import dhScreendoor from '@/assets/images/double_handle/DH_screendoor.jpg'
import mlFullview from '@/assets/images/multi_handle/ML_screendoor_fullview.jpg'
import mlHori from '@/assets/images/multi_handle/ML_screendoor_hori.jpg'
import mlInner from '@/assets/images/multi_handle/ML_screendoor_inner.jpg'
import mlOutter from '@/assets/images/multi_handle/ML_screendoor_outter.jpg'
import mlVert from '@/assets/images/multi_handle/ML_screendoor_vert.jpg'
import shBackyard from '@/assets/images/single_handle/SH_backyard_screendoor.jpg'
import shFront from '@/assets/images/single_handle/SH_front_screendoor.jpg'
import shGarage from '@/assets/images/single_handle/SH_garage_screendoor.jpg'
import shScreendoor from '@/assets/images/single_handle/SH_screendoor.jpg'
import windowsImg from '@/assets/images/windows/windows.jpg'
import type { CatalogCategory } from '../components/CatalogExplorer/types'

const COMMON_SPECS = [
  { icon: Shield, labelKey: 'products.spec.midgeProof' },
  { icon: Sun, labelKey: 'products.spec.uvResistance' },
  { icon: ArrowLeftRight, labelKey: 'products.spec.trackless' },
]

export const CATALOG_DATA: CatalogCategory[] = [
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
      { src: shFront, altKey: 'products.singleHandle' },
      { src: shBackyard, altKey: 'products.singleHandle' },
      { src: shGarage, altKey: 'products.singleHandle' },
      { src: shScreendoor, altKey: 'products.singleHandle' },
    ],
    videos: [{ url: 'https://youtu.be/YDsOInyymZI', titleKey: 'products.singleHandle' }],
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
    images: [{ src: dhScreendoor, altKey: 'products.doubleHandle' }],
    videos: [
      { url: 'https://youtu.be/WVjZmSLttiM', titleKey: 'products.doubleHandle' },
      { url: 'https://youtu.be/f-OyCptcEXI', titleKey: 'products.doubleHandle' },
      { url: 'https://youtu.be/FvmzlKNGlFQ', titleKey: 'products.doubleHandle' },
    ],
    specs: COMMON_SPECS,
  },
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
      { src: mlFullview, altKey: 'products.multiHandle' },
      { src: mlHori, altKey: 'products.multiHandle' },
      { src: mlInner, altKey: 'products.multiHandle' },
      { src: mlOutter, altKey: 'products.multiHandle' },
      { src: mlVert, altKey: 'products.multiHandle' },
    ],
    videos: [
      { url: 'https://youtu.be/-A_QTFndg_A', titleKey: 'products.multiHandle' },
      { url: 'https://youtu.be/3Cwey3f95vk', titleKey: 'products.multiHandle' },
      { url: 'https://youtu.be/EEiIbfY1zBI', titleKey: 'products.multiHandle' },
    ],
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
    images: [{ src: windowsImg, altKey: 'products.windows' }],
    specs: COMMON_SPECS,
  },
]
