import { useTranslation } from 'react-i18next'

const styles = {
  wrapper: 'flex flex-col items-center gap-6',
  contactLinks: 'flex flex-col items-center gap-3 sm:flex-row sm:gap-8',
  link: 'flex min-h-[44px] min-w-[44px] items-center gap-2 text-[#0056b3] hover:underline text-base font-medium',
  socialRow: 'flex items-center gap-4',
  socialLink: 'flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-lg border border-gray-200 px-4 text-sm font-medium text-[#212529] hover:bg-gray-50',
}

export function ContactFooter() {
  const { t } = useTranslation()

  return (
    <div className={styles.wrapper}>
      <div className={styles.contactLinks}>
        <a href={`tel:+14692883098`} className={styles.link} aria-label={t('inquiry.contact.phone')}>
          <span aria-hidden="true">📞</span>
          <span>{t('inquiry.contact.phone')}</span>
        </a>
        <a href={`mailto:hiss.usatx@gmail.com`} className={styles.link} aria-label={t('inquiry.contact.email')}>
          <span aria-hidden="true">✉</span>
          <span>{t('inquiry.contact.email')}</span>
        </a>
      </div>
      <div className={styles.socialRow}>
        <a href="#" className={styles.socialLink} aria-label={t('inquiry.social.line')}>
          <span>{t('inquiry.social.line')}</span>
        </a>
        <a href="#" className={styles.socialLink} aria-label={t('inquiry.social.wechat')}>
          <span>{t('inquiry.social.wechat')}</span>
        </a>
        <a href="#" className={styles.socialLink} aria-label={t('inquiry.social.facebook')}>
          <span>{t('inquiry.social.facebook')}</span>
        </a>
      </div>
    </div>
  )
}
