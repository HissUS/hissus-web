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
      <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
        {specs.map((spec) => {
          const Icon = spec.icon
          return (
            <div key={spec.labelKey} className="flex items-center gap-2 text-sm text-gray-600">
              <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <span>{t(spec.labelKey)}</span>
            </div>
          )
        })}
      </dl>

      <div className="mt-5 flex justify-center gap-3 sm:justify-end">
        <Link to={detailsHref as never}>
          <Button variant="outline" className="w-full sm:w-auto">
            {t('common.explore_details')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
