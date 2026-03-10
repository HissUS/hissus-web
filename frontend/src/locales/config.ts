/**
 * Country code → i18n locale mapping.
 * English (US) is the default — no country code in URL.
 *
 * To add a new locale:
 *   1. Add entry here: e.g., jp: 'ja-JP'
 *   2. Add JSON file: src/locales/ja-JP.json
 *   3. Register in src/i18n.ts resources
 */
export const COUNTRY_TO_LOCALE = {
  tw: 'zh-TW',
  // jp: 'ja-JP',
  // kr: 'ko-KR',
  // de: 'de-DE',
} as const

export type CountryCode = keyof typeof COUNTRY_TO_LOCALE

export const DEFAULT_LOCALE = 'en'

export const LOCALE_TO_COUNTRY = Object.fromEntries(
  Object.entries(COUNTRY_TO_LOCALE).map(([country, locale]) => [locale, country]),
) as Record<string, CountryCode>

export function getLocaleFromCountry(country?: string): string {
  if (!country) return DEFAULT_LOCALE
  return (COUNTRY_TO_LOCALE as Record<string, string>)[country] ?? DEFAULT_LOCALE
}

export function getCountryFromLocale(locale: string): CountryCode | undefined {
  return LOCALE_TO_COUNTRY[locale]
}
