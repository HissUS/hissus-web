import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Building2, FileText, Handshake, Hospital, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks'
import { Reveal } from './Reveal'

export function ExperienceSection() {
  const { t } = useTranslation()
  return (
    <section
      id="experience"
      className="company-section bg-gray-50"
      aria-labelledby="experience-heading"
    >
      <Reveal className="company-container grid gap-16 lg:grid-cols-2">
        <div>
          <p className="company-eyebrow">{t('company.experienceLabel')}</p>
          <h2 id="experience-heading" className="company-heading mt-8">
            {t('company.experienceTitle')}
          </h2>
          <p className="company-copy mt-8">{t('company.experienceDesc')}</p>
        </div>
        <div className="self-end">
          {[
            { key: 'hospital', icon: Hospital },
            { key: 'cleanroom', icon: Building2 },
          ].map(({ key, icon: Icon }) => (
            <div key={key} className="flex items-center gap-8 border-b border-gray-300 py-8">
              <Icon
                className="h-8 w-8 shrink-0 text-primary"
                strokeWidth={1.25}
                aria-hidden="true"
              />
              <h3 className="text-xl font-medium">{t(`company.${key}`)}</h3>
            </div>
          ))}
          <p className="mt-8 text-sm leading-relaxed text-gray-600">
            {t('company.experienceNote')}
          </p>
        </div>
      </Reveal>
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
    <section id="gmp" className="company-section bg-blue-50/60" aria-labelledby="gmp-heading">
      <Reveal className="company-container">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-10">
            <p className="text-sm font-semibold tracking-widest text-blue-100">
              {t('company.gmpLabel')}
            </p>
            <h2 id="gmp-heading" className="company-heading mt-6">
              {t('company.gmpTitle')}
            </h2>
            <div className="mt-8 border-t border-white/20 pt-8">
              <p className="text-4xl font-medium tracking-tight sm:text-5xl">GMP</p>
              <p className="mt-3 text-sm leading-relaxed text-blue-100">
                {t('company.gmpFull')}
              </p>
              <p className="mt-6 text-base leading-relaxed text-slate-200">
                {t('company.gmpIntro')}
              </p>
            </div>
          </div>
          <div className="divide-y divide-blue-200/70">
            {items.map(({ key, icon: Icon }) => (
              <article key={key} className="flex gap-5 py-7 first:pt-0 last:pb-0 sm:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200/70 bg-white text-primary sm:h-14 sm:w-14">
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
        <p className="mt-8 max-w-5xl text-sm leading-relaxed text-slate-600">
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
