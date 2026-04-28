import { useTranslation } from 'react-i18next'
import { ContactFooter } from './ContactFooter'

const styles = {
  section: 'bg-[#F8F9FA] px-4 py-12 sm:py-16',
  inner: 'mx-auto max-w-2xl text-center',
  heading: 'mb-8 text-2xl font-bold text-[#212529] sm:text-3xl',
}

export function InquiryForm() {
  const { t } = useTranslation()

  return (
    <section aria-label={t('inquiry.section.heading')} className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>{t('inquiry.section.heading')}</h2>
        <ContactFooter />
      </div>
    </section>
  )
}
