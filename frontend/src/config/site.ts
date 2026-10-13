import heroImage from '@/assets/images/belc-1800.webp'
import heroSmall from '@/assets/images/belc-640.webp'
import heroMedium from '@/assets/images/belc-1200.webp'
import logoImg from '@/assets/images/logo.webp'

export const SITE_CONFIG = {
  name: 'Hissus',
  assets: {
    logo: logoImg,
    heroImage,
    heroSources: [
      { src: heroSmall, width: 640 },
      { src: heroMedium, width: 1200 },
      { src: heroImage, width: 1800 },
    ],
  },
  contact: {
    phone: '+14692883098',
    email: 'hiss.usatx@gmail.com',
    line: 'markou071',
    wechat: 'markou071',
    facebook: {
      label: 'Hiss US',
      href: 'https://www.facebook.com/hiss.eagle.2025/',
    },
    address: {
      label: '3901 E Plano Pkwy, Plano, TX 75074',
      href: 'https://maps.app.goo.gl/RwLDLXJGf9L9YTd39',
      postal: {
        streetAddress: '3901 E Plano Pkwy',
        addressLocality: 'Plano',
        addressRegion: 'TX',
        postalCode: '75074',
        addressCountry: 'US',
      },
    },
  },
}
