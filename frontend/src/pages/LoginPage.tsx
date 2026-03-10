import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h2 className="text-2xl font-semibold text-gray-900">{t('auth.loginTitle')}</h2>
      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('auth.email')}</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('auth.password')}</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-gray-900 py-2 text-white hover:bg-gray-700"
        >
          {t('auth.login')}
        </button>
      </form>
    </div>
  )
}
