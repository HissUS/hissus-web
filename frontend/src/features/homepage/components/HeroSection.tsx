import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { SITE_CONFIG } from '@/config/site'
import { Button } from '@/components/ui-wrapper'
import { useLocale } from '@/hooks'
import { getAssetUrl } from '@/lib/utils'

const styles = {
  section:
    'relative min-h-[520px] sm:min-h-[600px] flex items-center justify-center overflow-hidden',
  image: 'absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700',
  overlay: 'absolute inset-0 bg-linear-to-b from-transparent to-black/40',
  content: 'relative z-10 text-center px-4 max-w-3xl mx-auto',
  title: 'text-3xl sm:text-5xl font-bold tracking-tight text-white',
  subtitle: 'mt-4 text-base sm:text-xl text-white/90 max-w-2xl mx-auto',
  cta: 'mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4',
}

export function HeroSection() {
  const { t } = useTranslation()
  const { country } = useLocale()
  const prefix = country ? `/${country}` : ''

  return (
    <section aria-label={t('homepage.hero.title')} className={styles.section}>
      <img
        src={getAssetUrl(SITE_CONFIG.assets.heroImage)}
        alt=""
        aria-hidden="true"
        className={styles.image}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{t('homepage.hero.title')}</h1>
        <p className={styles.subtitle}>{t('homepage.hero.subtitle')}</p>
        <div className={styles.cta}>
          <Link to={`${prefix}/get-a-quote` as never}>
            <Button variant="default" size="lg" className="w-full sm:w-auto">
              {t('nav.getQuote')}
            </Button>
          </Link>
          <Link to={`${prefix}/products` as never}>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-white bg-transparent text-white hover:bg-white/10 hover:text-white sm:w-auto"
            >
              {t('homepage.hero.explore')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
