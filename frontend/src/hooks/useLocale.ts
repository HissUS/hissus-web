import { useNavigate, useParams, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getCountryFromLocale, getLocaleFromCountry } from '../locales/config'
import type { CountryCode } from '../locales/config'

/**
 * Reads $country from the current URL path (if present) and syncs i18n language.
 * English (US) is the default when no country code is in the URL.
 */
export function useLocale() {
  const params = useParams({ strict: false }) as { country?: string }
  const { i18n } = useTranslation()
  const country = params.country as CountryCode | undefined
  const locale = getLocaleFromCountry(country)

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, i18n])

  return { locale, country }
}

/**
 * Returns a function to navigate to the same page in a different locale.
 * Handles adding/removing the /$country prefix automatically.
 *
 * Usage: const switchLocale = useLocaleSwitcher()
 *        switchLocale('tw')        // → /tw/home
 *        switchLocale(undefined)   // → /home  (English)
 */
export function useLocaleSwitcher() {
  const navigate = useNavigate()
  const { pathname } = useRouterState({ select: (s) => s.location })
  const { country: currentCountry } = useLocale()

  return (targetLocale: string | undefined) => {
    const targetCountry =
      targetLocale === undefined || targetLocale === 'en'
        ? undefined
        : getCountryFromLocale(targetLocale)

    // Strip current country prefix if present
    const basePath = currentCountry ? pathname.replace(new RegExp(`^/${currentCountry}`), '') : pathname

    const targetPath = targetCountry ? `/${targetCountry}${basePath}` : basePath
    navigate({ to: targetPath })
  }
}
