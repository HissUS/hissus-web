import { useTranslation } from 'react-i18next'
import type { CatalogSpec } from './types'

interface SpecSectionProps {
  specs: CatalogSpec[]
}

export function SpecSection({ specs }: SpecSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 sm:place-items-center sm:mx-auto sm:max-w-3xl">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div
              key={spec.labelKey}
              className="flex items-center gap-2 text-base font-medium text-gray-700 sm:text-lg"
            >
              <Icon className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
              <span>{t(spec.labelKey)}</span>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
