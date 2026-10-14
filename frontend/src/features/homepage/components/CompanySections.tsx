import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Building2, FileText, Handshake, Hospital, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks'
import { Reveal } from './Reveal'
import { FactoryServiceArea } from './FactoryServiceArea'

export function ExperienceSection() {
  const { t } = useTranslation()
  return (
    <section
      id="experience"
      className="company-section scroll-mt-28 bg-[#faf8f5]"
      aria-labelledby="experience-heading"
    >
      <div id="service-area" className="scroll-mt-28">
        <Reveal className="company-container grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
          <div>
            <p className="company-eyebrow">{t('company.experienceLabel')}</p>
            <h2 id="experience-heading" className="company-heading mt-6">
              {t('company.taiwanExperience.title')}
            </h2>
            <p id="taiwan-texas-experience" className="company-copy mt-6 scroll-mt-28">
              {t('company.taiwanExperience.desc')}
            </p>
            <p className="mt-5 text-base leading-relaxed text-gray-600">
              {t('company.serviceArea.nationwide')}
            </p>
            <ul className="mt-8 grid gap-x-5 gap-y-4 border-t border-[#e4dbd0] pt-6 sm:grid-cols-2">
              {[
                { key: 'hospital', icon: Hospital },
                { key: 'cleanroom', icon: Building2 },
              ].map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-center gap-3 text-sm font-medium text-gray-700">
                  <Icon
                    className="h-5 w-5 shrink-0 text-primary"
                    strokeWidth={1.25}
                    aria-hidden="true"
                  />
                  {t(`company.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <FactoryServiceArea />
        </Reveal>
      </div>
    </section>
  )
}

export function GmpSection() {
  const { t } = useTranslation()
  const items = [
    { key: 'ceiling', icon: ShieldCheck },
    { key: 'transparent', icon: FileText },
    { key: 'savings', icon: Handshake },
  ]
  return (
    <section id="gmp" className="company-section" aria-labelledby="gmp-heading">
      <Reveal className="company-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 text-gray-950 sm:p-10">
            <p className="text-sm font-semibold tracking-widest text-gray-500">
              {t('company.gmpLabel')}
            </p>
            <h2 id="gmp-heading" className="company-heading mt-6">
              {t('company.gmpTitle')}
            </h2>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-4xl font-medium tracking-tight sm:text-5xl">GMP</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{t('company.gmpFull')}</p>
              <p className="mt-6 text-base leading-relaxed text-gray-600">
                {t('company.gmpIntro')}
              </p>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {items.map(({ key, icon: Icon }) => (
              <article key={key} className="flex gap-5 py-7 first:pt-0 last:pb-0 sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.25} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-medium sm:text-2xl">
                    {t(`company.gmp.${key}.title`)}
                  </h3>
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {t(`company.gmp.${key}.desc`)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="mt-8 max-w-5xl text-sm leading-relaxed text-gray-600">
          {t('company.gmpNote')}
        </p>
      </Reveal>
    </section>
  )
}

export function CompanyContact({ compact = false }: { compact?: boolean } = {}) {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''
  return (
    <section
      className={`company-contact ${compact ? 'py-12 sm:py-16' : 'company-section'}`}
      aria-labelledby="company-contact-heading"
    >
      <Reveal className="company-container grid items-end gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          {!compact && (
            <p className="text-sm font-medium tracking-widest">{t('company.contactLabel')}</p>
          )}
          <h2
            id="company-contact-heading"
            className={`company-heading max-w-3xl ${compact ? '' : 'mt-8'}`}
          >
            {t(compact ? 'company.homeContactTitle' : 'company.contactTitle')}
          </h2>
          {!compact && (
            <p className="mt-8 max-w-2xl leading-relaxed text-white/90">
              {t('company.contactDesc')}
            </p>
          )}
        </div>
        <Link
          to={`${prefix}/factory/contact` as never}
          className="company-button company-button-light"
        >
          {t('nav.discuss')}
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </Reveal>
    </section>
  )
}
