import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui-wrapper'
import type { CatalogSpec } from './types'

interface SpecSectionProps {
  specs: CatalogSpec[]
  detailsHref: string
}

export function SpecSection({ specs, detailsHref }: SpecSectionProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 sm:place-items-center sm:mx-auto sm:max-w-3xl">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div key={spec.labelKey} className="flex items-center gap-2 text-base font-medium text-gray-700 sm:text-lg">
              <Icon className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />
              <span>{t(spec.labelKey)}</span>
            </div>
          )
        })}
      </dl>

      <div className="mt-6 flex justify-end">
        <Link to={detailsHref as never}>
          <Button variant="outline" className="w-auto">
            {t('common.explore_details')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
