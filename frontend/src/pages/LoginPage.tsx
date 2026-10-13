import { useTranslation } from 'react-i18next'

export function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="text-2xl font-semibold text-gray-900">{t('auth.loginTitle')}</h1>
      <form className="mt-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
            {t('auth.email')}
          </label>
          <input
            id="login-email"
            autoComplete="username"
            type="email"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
            {t('auth.password')}
          </label>
          <input
            id="login-password"
            autoComplete="current-password"
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
