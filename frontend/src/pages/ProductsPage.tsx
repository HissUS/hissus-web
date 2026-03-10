import { useTranslation } from 'react-i18next'

export function ProductsPage() {
  const { t } = useTranslation()

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('products.title')}</h1>
      <p className="mt-2 text-gray-500">{t('common.loading')}</p>
    </div>
  )
}
