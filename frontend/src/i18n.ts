import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

// Language is detected from URL $country param via useLocale() hook.
// To add a locale: import the JSON and add an entry to resources.
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-TW': { translation: zhTW },
  },
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh-TW'],
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
