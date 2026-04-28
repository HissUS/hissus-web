import { useTranslation } from 'react-i18next'

export function ProductsPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t('products.title')}</h1>
      <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">{t('common.loading')}</p>
    </div>
  )
}
