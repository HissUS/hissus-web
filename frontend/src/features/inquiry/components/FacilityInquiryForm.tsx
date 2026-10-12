import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui-wrapper'
import { useInquiry } from '../useInquiry'

const inputClass =
  'h-11 rounded-md border px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-primary/40'

export function FacilityInquiryForm() {
  const { t } = useTranslation()
  const inquiry = useInquiry(true)
  return (
    <form onSubmit={inquiry.handleSubmit} className="space-y-6" aria-busy={inquiry.pending}>
      <div hidden aria-hidden="true">
        <label>
          {t('company.honeypot')}
          <input
            name="website"
            value={inquiry.website}
            onChange={(event) => inquiry.setWebsite(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </label>
      </div>
      <fieldset disabled={inquiry.pending} className="space-y-6">
        <legend className="sr-only">{t('company.contactPageTitle')}</legend>
        <label className="flex flex-col">
          <span className="mb-2 font-medium">
            {t('company.form.name')} <span className="text-destructive">*</span>
          </span>
          <input
            className={inputClass}
            name="name"
            autoComplete="name"
            maxLength={160}
            value={inquiry.name}
            onChange={(event) => inquiry.setName(event.target.value)}
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col">
            <span className="mb-2 font-medium">
              {t('quote.phoneNumber')} <span className="text-destructive">*</span>
            </span>
            <input
              className={inputClass}
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={25}
              value={inquiry.phone}
              onChange={(event) => inquiry.setPhone(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-2 font-medium">
              {t('quote.emailAddress')} <span className="text-destructive">*</span>
            </span>
            <input
              className={inputClass}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={inquiry.email}
              onChange={(event) => inquiry.setEmail(event.target.value)}
              required
            />
          </label>
        </div>
        <label className="flex flex-col">
          <span className="mb-2 font-medium">
            {t('company.form.subject')} <span className="text-destructive">*</span>
          </span>
          <input
            className={inputClass}
            name="subject"
            maxLength={200}
            value={inquiry.subject}
            onChange={(event) => inquiry.setSubject(event.target.value)}
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-2 font-medium">{t('quote.messageOptional')}</span>
          <textarea
            name="message"
            className="min-h-30 rounded-md border px-3 py-2 text-base shadow-sm focus:ring-2 focus:ring-primary/40"
            maxLength={4000}
            value={inquiry.message}
            onChange={(event) => inquiry.setMessage(event.target.value)}
          />
        </label>
      </fieldset>
      {inquiry.error && (
        <div role="alert" className="text-base text-destructive">
          {t(inquiry.error)}
        </div>
      )}
      {inquiry.submitted && (
        <div role="status" className="text-base text-green-800">
          {t(inquiry.copyFailed ? 'company.copyFailed' : 'company.sentNotice')}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={inquiry.pending}>
          {t(inquiry.pending ? 'company.sending' : 'company.sendInquiry')}
        </Button>
        <Button type="button" variant="outline" disabled={inquiry.pending} onClick={inquiry.reset}>
          {t('quote.reset')}
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{t('company.privacy')}</p>
    </form>
  )
}
