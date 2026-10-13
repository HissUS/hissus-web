import { ClipboardCheck, HardHat, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Reveal } from './Reveal'

const stages = [
  { key: 'planning', icon: ClipboardCheck, services: ['site', 'permits'] },
  { key: 'building', icon: HardHat, services: ['design', 'construction'] },
  { key: 'operations', icon: Settings, services: ['operations', 'quality', 'people'] },
] as const

export function FactoryServices() {
  const { t } = useTranslation()
  return (
    <section className="company-section" aria-labelledby="factory-services-heading">
      <Reveal className="company-container">
        <p className="company-eyebrow">{t('company.coordination.label')}</p>
        <h2 id="factory-services-heading" className="company-heading mt-6 max-w-3xl">
          {t('company.coordination.title')}
        </h2>
        <p className="company-copy mt-6 max-w-3xl">{t('company.coordination.desc')}</p>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {stages.map(({ key, icon: Icon, services }, index) => (
            <li key={key} className="border-t border-gray-300 pt-6">
              <div className="flex items-center justify-between text-primary" aria-hidden="true">
                <Icon className="h-7 w-7" strokeWidth={1.25} />
                <span className="text-sm tabular-nums">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-2xl font-medium">
                {t(`company.coordination.stages.${key}`)}
              </h3>
              <dl className="mt-6 space-y-6">
                {services.map((service) => (
                  <div key={service}>
                    <dt className="font-medium">
                      {t(`company.coordination.services.${service}.title`)}
                    </dt>
                    <dd className="mt-2 leading-relaxed text-gray-600">
                      {t(`company.coordination.services.${service}.desc`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ol>
        <div className="mt-12 border-l-2 border-primary pl-6">
          <h3 className="font-medium">{t('company.scopeTitle')}</h3>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-gray-600">
            {t('company.scopeDesc')}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
