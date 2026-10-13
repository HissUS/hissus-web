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
    <section id="gmp" className="company-section" aria-labelledby="gmp-heading">
      <Reveal className="company-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="company-eyebrow">{t('company.gmpLabel')}</p>
            <h2 id="gmp-heading" className="company-heading mt-8">
              {t('company.gmpTitle')}
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="text-sm font-semibold text-primary">GMP / {t('company.gmpFull')}</p>
            <p className="company-copy mt-4">{t('company.gmpIntro')}</p>
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {items.map(({ key, icon: Icon }, i) => (
            <article key={key} className="border-t border-gray-300 pt-8">
              <div className="flex items-center justify-between text-primary">
                <Icon className="h-8 w-8" strokeWidth={1.25} aria-hidden="true" />
                <span className="text-sm tabular-nums" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-medium">{t(`company.gmp.${key}.title`)}</h3>
              <p className="mt-4 leading-relaxed text-gray-600">{t(`company.gmp.${key}.desc`)}</p>
            </article>
          ))}
        </div>
        <p className="mt-16 max-w-4xl border-l-2 border-primary pl-8 text-sm leading-relaxed text-gray-600">
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
