import { Outlet } from '@tanstack/react-router'
import { useLocale } from '../hooks'

export function AuthLayout() {
  useLocale() // syncs i18n language with URL $country param

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </div>
  )
}
