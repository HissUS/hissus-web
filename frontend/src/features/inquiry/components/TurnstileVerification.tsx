import { useTranslation } from 'react-i18next'
import { useTurnstile } from '../useTurnstile'

export function TurnstileVerification({
  resetKey,
  onVerify,
}: {
  resetKey: number
  onVerify: (token: string) => void
}) {
  const { t, i18n } = useTranslation()
  const { container, status } = useTurnstile(i18n.language, resetKey, onVerify)
  return (
    <div className="space-y-3" aria-label={t('verification.label')}>
      <p className="text-sm text-gray-600">{t('verification.label')}</p>
      <div ref={container} data-inquiry-verification className="min-h-[65px]" />
      <noscript><p className="text-sm text-gray-600">{t('verification.noScript')}</p></noscript>
      {status !== 'ready' && (
        <p
          role={status === 'loading' ? undefined : 'alert'}
          aria-live="polite"
          className="text-sm text-gray-600"
        >
          {t(`verification.${status}`)}
        </p>
      )}
    </div>
  )
}
