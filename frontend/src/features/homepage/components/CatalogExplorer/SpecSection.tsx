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
      <dl className="grid grid-cols-3 gap-x-8 gap-y-3">
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

      <div className="mt-5 flex justify-end gap-3">
        <Link to={detailsHref as never}>
          <Button variant="outline">{t('common.explore_details')}</Button>
        </Link>
      </div>
    </div>
  )
}
