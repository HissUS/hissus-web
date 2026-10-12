import { randomUUID } from 'node:crypto'
import { inquirySchema, getAllowedOrigins, getMailFailureDetails } from '..'
import type { Config, Handler } from '@netlify/functions'
import { Resend } from 'resend'
import buildOrigins from '../../.netlify/inquiry-origins.json'
import en from '../../src/locales/en.json'
import zhTW from '../../src/locales/zh-TW.json'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const fill = (template: string, vars: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')

const normalizeSubjectValue = (value: string) => value.replace(/[\r\n]+/g, ' ').trim()

// ---------------------------------------------------------------------------
// Shared email shell (header + rows table + message block + footer)
// ---------------------------------------------------------------------------
function buildEmailHtml(opts: {
  lang: string
  businessLabel: string
  badge: string
  heading: string
  intro?: string
  rows: [string, string][]
  message: string
  noneLabel: string
  detailsHeading: string
  messageHeading: string
  footer: string
  topicLabel: string
  topic: string
  theme: { header: string; label: string; accent: string; background: string }
}) {
  const {
    lang,
    businessLabel,
    badge,
    heading,
    intro,
    rows,
    message,
    noneLabel,
    detailsHeading,
    messageHeading,
    footer,
    topicLabel,
    topic,
    theme,
  } = opts

  const rowsHtml = rows
    .map(
      ([label, value], i) => `
      <tr style="background-color:${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">
        <td style="padding:12px 16px;font-size:12px;color:#8896a5;width:130px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">${label}</td>
        <td style="padding:12px 16px;font-size:14px;color:#1a2b3c;">${value}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background-color:${theme.header};padding:36px 40px;border-radius:12px 12px 0 0;">
              <p style="margin:0 0 18px 0;font-size:15px;line-height:1.5;font-weight:bold;color:#ffffff;">HISS US · ${businessLabel}</p>
              <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.label};font-family:Arial,sans-serif;">${badge}</p>
              <h1 style="margin:0;font-size:26px;color:#ffffff;font-family:Georgia,serif;font-weight:normal;">${heading}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">
              <div style="margin:0 0 28px 0;padding:16px 20px;background-color:${theme.background};border-left:4px solid ${theme.accent};border-radius:0 8px 8px 0;">
                <p style="margin:0 0 6px 0;font-size:12px;font-weight:bold;color:${theme.accent};">${topicLabel}</p>
                <p style="margin:0;font-size:18px;line-height:1.5;color:#1a2b3c;overflow-wrap:anywhere;">${topic}</p>
              </div>
              ${
                intro
                  ? `<p style="margin:0 0 28px 0;font-size:15px;color:#1a2b3c;line-height:1.6;">${intro}</p>`
                  : ''
              }
              <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.accent};font-family:Arial,sans-serif;">${detailsHeading}</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #e8ecf0;border-radius:8px;overflow:hidden;">
                ${rowsHtml}
              </table>

              <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${theme.accent};font-family:Arial,sans-serif;">${messageHeading}</p>
              <div style="background-color:#f8fafc;border:1px solid #e8ecf0;border-left:4px solid ${theme.accent};border-radius:0 8px 8px 0;padding:16px 20px;">
                <p style="margin:0;font-size:14px;color:#1a2b3c;font-family:Georgia,serif;line-height:1.7;font-style:italic;">${message || noneLabel}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e8ecf0;padding:20px 40px;border-radius:0 0 12px 12px;">
              <p style="margin:0;font-size:12px;color:#a0aec0;text-align:center;">${footer}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
type Mail = { from: string; to: string; replyTo: string; subject: string; html: string }
type MailResult = { error: unknown; data?: unknown }
type Dependencies = {
  getConfig: () => { apiKey?: string; recipientEmail: string; origins: string[] }
  sendMail: (apiKey: string, mail: Mail) => Promise<MailResult>
}

const dependencies: Dependencies = {
  getConfig: () => ({
    apiKey: process.env.RESEND_API_KEY?.trim(),
    recipientEmail: process.env.QUOTE_RECIPIENT_EMAIL?.trim() || 'hiss.usatx@gmail.com',
    origins: getAllowedOrigins(process.env, buildOrigins),
  }),
  sendMail: (apiKey, mail) =>
    new Resend(apiKey).emails.send(mail, { signal: AbortSignal.timeout(8000) }),
}

// Netlify enforces this at the edge after deployment; local code is not DDoS protection.
export const config: Config = {
  rateLimit: { windowLimit: 5, windowSize: 60, aggregateBy: ['ip', 'domain'] },
}

export function createInquiryHandler(deps: Dependencies = dependencies): Handler {
  return async (event) => {
    const requestId = randomUUID()
    const logMailFailure = (phase: 'notification' | 'confirmation', error: unknown) =>
      console.error('Inquiry mail failed', { requestId, phase, ...getMailFailureDetails(error) })
    const response = (statusCode: number, body: Record<string, unknown>) => ({
      statusCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Request-ID': requestId,
        ...(statusCode === 405 ? { Allow: 'POST' } : {}),
      },
      body: JSON.stringify(statusCode >= 400 ? { ...body, requestId } : body),
    })
    if (event.httpMethod !== 'POST') return response(405, { code: 'METHOD_NOT_ALLOWED' })
    const headers = Object.fromEntries(
      Object.entries(event.headers).map(([key, value]) => [key.toLowerCase(), value]),
    )
    if (!headers['content-type']?.toLowerCase().startsWith('application/json'))
      return response(415, { code: 'INVALID_INPUT' })
    // Bound encoded input before decoding and parsing.
    if ((event.body || '').length > 22000) return response(413, { code: 'TOO_LARGE' })
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : event.body || '{}'
    if (Buffer.byteLength(body) > 16384) return response(413, { code: 'TOO_LARGE' })
    let parsed
    try {
      parsed = inquirySchema.safeParse(JSON.parse(body))
    } catch {
      return response(400, { code: 'INVALID_INPUT' })
    }
    if (!parsed.success) return response(400, { code: 'INVALID_INPUT' })
    const settings = deps.getConfig()
    if (headers.origin && !settings.origins.includes(headers.origin)) {
      console.error('Inquiry rejected', { requestId, reason: 'origin_denied' })
      return response(403, { code: 'ORIGIN_DENIED' })
    }
    if (!settings.apiKey) {
      console.error('Inquiry configuration unavailable', { requestId, reason: 'missing_api_key' })
      return response(503, { code: 'UNAVAILABLE' })
    }
    const inquiry = parsed.data
    const { email, phone, message, locale: lang, kind } = inquiry
    const dictionary = lang === 'zh-TW' ? zhTW : en
    const s = dictionary.quote.email
    const copy = kind === 'facility' ? dictionary.company.facilityEmail : s
    const fullName =
      inquiry.kind === 'facility' ? inquiry.name : `${inquiry.firstName} ${inquiry.lastName}`
    const topic =
      inquiry.kind === 'facility'
        ? inquiry.subject
        : dictionary.products[
            (
              {
                'single-handle': 'singleHandle',
                'double-handle': 'doubleHandle',
                'multi-handle': 'multiHandle',
                windows: 'windows',
              } as const
            )[inquiry.product]
          ]
    const rows: [string, string][] = [
      [kind === 'facility' ? dictionary.company.form.name : s.labelName, escapeHtml(fullName)],
      [s.labelEmail, escapeHtml(email)],
      [s.labelPhone, escapeHtml(phone)],
    ]
    if (inquiry.kind === 'facility') {
      rows.push([dictionary.company.form.subject, escapeHtml(inquiry.subject)])
    } else {
      rows.push([s.labelCity, escapeHtml(inquiry.city)], [s.labelProduct, escapeHtml(topic)])
    }
    const common = {
      lang,
      businessLabel: copy.businessLabel,
      topicLabel: copy.topicLabel,
      topic: escapeHtml(topic),
      theme:
        kind === 'facility'
          ? { header: '#103c3a', label: '#b5e8db', accent: '#16665a', background: '#edf7f4' }
          : { header: '#0d1f3c', label: '#a9cff4', accent: '#225f9e', background: '#eef5fc' },
      rows,
      message: escapeHtml(message).replace(/\r?\n/g, '<br />'),
      noneLabel: s.none,
      detailsHeading: s.detailsHeading,
      messageHeading: s.messageHeading,
    }
    const from = 'HISSUS <quotes@hissus.com>'
    try {
      const admin = await deps.sendMail(settings.apiKey, {
        from,
        to: settings.recipientEmail,
        replyTo: email,
        subject: normalizeSubjectValue(fill(copy.adminSubject, { name: fullName, topic })),
        html: buildEmailHtml({
          ...common,
          badge: copy.adminBadge,
          heading: copy.adminHeading,
          footer: copy.adminFooter,
        }),
      })
      if (admin.error) {
        logMailFailure('notification', admin.error)
        return response(502, { code: 'SEND_FAILED' })
      }
    } catch (error) {
      logMailFailure('notification', error)
      return response(502, { code: 'SEND_FAILED' })
    }
    // Once the team has received the inquiry, do not encourage a duplicate submission
    // merely because the optional customer copy fails.
    let confirmationSent = false
    try {
      const confirmation = await deps.sendMail(settings.apiKey, {
        from,
        to: email,
        replyTo: settings.recipientEmail,
        subject: normalizeSubjectValue(fill(copy.userSubject, { topic })),
        html: buildEmailHtml({
          ...common,
          badge: copy.userBadge,
          heading: copy.userHeading,
          intro: fill(copy.userIntro, {
            name: escapeHtml(inquiry.kind === 'facility' ? inquiry.name : inquiry.firstName),
          }),
          footer: copy.userFooter,
        }),
      })
      confirmationSent = !confirmation.error
      if (confirmation.error) logMailFailure('confirmation', confirmation.error)
    } catch (error) {
      logMailFailure('confirmation', error)
    }
    return response(200, { success: true, confirmationSent })
  }
}

export const handler = createInquiryHandler()
