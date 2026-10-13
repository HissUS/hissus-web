import photo1555_640 from '@/assets/images/factory/1555-640.webp'
import photo1555_1200 from '@/assets/images/factory/1555-1200.webp'
import photo1555_1800 from '@/assets/images/factory/1555-1800.webp'
import photo1771_640 from '@/assets/images/factory/1771-640.webp'
import photo1771_1200 from '@/assets/images/factory/1771-1200.webp'
import photo1771_1800 from '@/assets/images/factory/1771-1800.webp'
import photo1801_640 from '@/assets/images/factory/1801-640.webp'
import photo1801_1200 from '@/assets/images/factory/1801-1200.webp'
import photo1801_1800 from '@/assets/images/factory/1801-1800.webp'
import photo1811_640 from '@/assets/images/factory/1811-640.webp'
import photo1811_1200 from '@/assets/images/factory/1811-1200.webp'
import photo1811_1800 from '@/assets/images/factory/1811-1800.webp'
import photo1821_640 from '@/assets/images/factory/1821-640.webp'
import photo1821_1200 from '@/assets/images/factory/1821-1200.webp'
import photo1821_1800 from '@/assets/images/factory/1821-1800.webp'
import photo1366_640 from '@/assets/images/factory/1366-640.webp'
import photo1366_1200 from '@/assets/images/factory/1366-1200.webp'
import photo1366_1800 from '@/assets/images/factory/1366-1800.webp'

export const FACTORY_PHOTOS = [
  {
    id: '1801',
    width: 1800,
    height: 1350,
    src: photo1801_1800,
    sources: [photo1801_640, photo1801_1200, photo1801_1800],
    captionKey: 'company.photos.1801',
  },
  {
    id: '1555',
    width: 1800,
    height: 1350,
    src: photo1555_1800,
    sources: [photo1555_640, photo1555_1200, photo1555_1800],
    captionKey: 'company.photos.1555',
  },
  {
    id: '1821',
    width: 1800,
    height: 1350,
    src: photo1821_1800,
    sources: [photo1821_640, photo1821_1200, photo1821_1800],
    captionKey: 'company.photos.1821',
  },
  {
    id: '1771',
    width: 1800,
    height: 1350,
    src: photo1771_1800,
    sources: [photo1771_640, photo1771_1200, photo1771_1800],
    captionKey: 'company.photos.1771',
  },
  {
    id: '1811',
    width: 1800,
    height: 1350,
    src: photo1811_1800,
    sources: [photo1811_640, photo1811_1200, photo1811_1800],
    captionKey: 'company.photos.1811',
  },
  {
    id: '1366',
    width: 1800,
    height: 2400,
    src: photo1366_1800,
    sources: [photo1366_640, photo1366_1200, photo1366_1800],
    captionKey: 'company.photos.1366',
  },
]

export type FactoryPhoto = (typeof FACTORY_PHOTOS)[number]
