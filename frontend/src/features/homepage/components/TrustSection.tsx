import { useTranslation } from 'react-i18next'

const PILLARS = [
  {
    key: 'customTailored',
    icon: '✦',
    titleKey: 'homepage.trust.customTailored.title',
    descKey: 'homepage.trust.customTailored.desc',
  },
  {
    key: 'craftsmanship',
    icon: '◈',
    titleKey: 'homepage.trust.craftsmanship.title',
    descKey: 'homepage.trust.craftsmanship.desc',
  },
  {
    key: 'ecoConscious',
    icon: '◉',
    titleKey: 'homepage.trust.ecoConscious.title',
    descKey: 'homepage.trust.ecoConscious.desc',
  },
]

const styles = {
  section: 'bg-white px-4 py-12 sm:py-16',
  inner: 'mx-auto max-w-7xl',
  heading: 'mb-8 text-center text-3xl font-bold text-gray-900 sm:mb-10 sm:text-4xl',
  grid: 'grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8',
  pillar: 'flex flex-col items-center text-center gap-3',
  icon: 'text-[--primary] text-2xl sm:text-3xl',
  pillarTitle: 'text-base font-semibold text-gray-900',
  pillarDesc: 'text-sm text-gray-600 leading-relaxed',
  narrative: 'mt-10 mx-auto max-w-2xl text-center text-sm leading-relaxed text-gray-500 sm:mt-12',
}

export function TrustSection() {
  const { t } = useTranslation()

  return (
    <section aria-label={t('homepage.trust.heading')} className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t('homepage.trust.heading')}</h2>
        <div className={styles.grid}>
          {PILLARS.map((pillar) => (
            <div key={pillar.key} className={styles.pillar}>
              <span className={styles.icon} aria-hidden="true">
                {pillar.icon}
              </span>
              <p className={styles.pillarTitle}>{t(pillar.titleKey)}</p>
              <p className={styles.pillarDesc}>{t(pillar.descKey)}</p>
            </div>
          ))}
        </div>
        <p className={styles.narrative}>{t('homepage.brand.narrative')}</p>
      </div>
    </section>
  )
}
