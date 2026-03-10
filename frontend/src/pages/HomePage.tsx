import { useTranslation } from 'react-i18next'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Hissus.com</h1>
      <p className="mt-4 text-gray-600">{t('products.realLifeInstall')}</p>
      <button className="mt-6 rounded-md bg-gray-900 px-6 py-2 text-white hover:bg-gray-700">
        {t('common.getQuote')}
      </button>
    </div>
  )
}
