import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks'
import { Reveal } from './Reveal'

export function FactorySteps() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <section className="company-section" aria-labelledby="factory-steps-heading">
      <Reveal className="company-container">
        <p className="company-eyebrow">{t('company.startLabel')}</p>
        <h2 id="factory-steps-heading" className="company-heading mt-6">
          {t('company.startTitle')}
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {(['needs', 'scope', 'approach'] as const).map((step, index) => (
            <li key={step} className="border-t border-gray-300 pt-6">
              <span className="text-sm font-semibold tabular-nums text-primary" aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className="mt-4 text-xl font-medium">{t(`company.start.${step}.title`)}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-gray-600">
                {t(`company.start.${step}.desc`)}
              </p>
            </li>
          ))}
        </ol>
        <Link to={`${prefix}/factory/services` as never} className="company-text-link mt-8">
          {t('company.startLink')}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  )
}
