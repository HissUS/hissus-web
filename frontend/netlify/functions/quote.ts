import { inquirySchema } from '../inquiry'
import type { Config, Handler } from '@netlify/functions'
import { Resend } from 'resend'
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
  badge: string
  heading: string
  intro?: string
  rows: [string, string][]
  message: string
  noneLabel: string
  detailsHeading: string
  messageHeading: string
  footer: string
}) {
  const {
    lang,
    badge,
    heading,
    intro,
    rows,
    message,
    noneLabel,
    detailsHeading,
    messageHeading,
    footer,
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
            <td style="background-color:#0d1f3c;padding:36px 40px;border-radius:12px 12px 0 0;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#7fa8d4;font-family:Arial,sans-serif;">${badge}</p>
              <h1 style="margin:0;font-size:26px;color:#ffffff;font-family:Georgia,serif;font-weight:normal;">${heading}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 40px;">
              ${
                intro
                  ? `<p style="margin:0 0 28px 0;font-size:15px;color:#1a2b3c;line-height:1.6;">${intro}</p>`
                  : ''
              }
              <p style="margin:0 0 12px 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#7fa8d4;font-family:Arial,sans-serif;">${detailsHeading}</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid #e8ecf0;border-radius:8px;overflow:hidden;">
                ${rowsHtml}
              </table>

              <p style="margin:0 0 12px 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#7fa8d4;font-family:Arial,sans-serif;">${messageHeading}</p>
              <div style="background-color:#f8fafc;border:1px solid #e8ecf0;border-left:4px solid #0d1f3c;border-radius:0 8px 8px 0;padding:16px 20px;">
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
    apiKey: process.env.RESEND_API_KEY,
    recipientEmail: process.env.QUOTE_RECIPIENT_EMAIL || 'hiss.usatx@gmail.com',
    origins: [
      'https://hissus.com',
      'https://www.hissus.com',
      process.env.URL,
      process.env.DEPLOY_PRIME_URL,
    ].filter((value): value is string => Boolean(value)),
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
    const response = (statusCode: number, body: Record<string, unknown>) => ({
      statusCode,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...(statusCode === 405 ? { Allow: 'POST' } : {}),
      },
      body: JSON.stringify(body),
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
    if (headers.origin && !settings.origins.includes(headers.origin))
      return response(403, { code: 'ORIGIN_DENIED' })
    if (!settings.apiKey) return response(503, { code: 'UNAVAILABLE' })
    const inquiry = parsed.data
    const { email, phone, message, locale: lang, kind } = inquiry
    const dictionary = lang === 'zh-TW' ? zhTW : en
    const s = dictionary.quote.email
    const copy = kind === 'facility' ? dictionary.company.facilityEmail : s
    const fullName =
      inquiry.kind === 'facility' ? inquiry.name : `${inquiry.firstName} ${inquiry.lastName}`
    const rows: [string, string][] = [
      [kind === 'facility' ? dictionary.company.form.name : s.labelName, escapeHtml(fullName)],
      [s.labelEmail, escapeHtml(email)],
      [s.labelPhone, escapeHtml(phone)],
    ]
    if (inquiry.kind === 'facility') {
      rows.push([dictionary.company.form.subject, escapeHtml(inquiry.subject)])
    } else {
      rows.push(
        [s.labelCity, escapeHtml(inquiry.city)],
        [
          s.labelProduct,
          escapeHtml(
            dictionary.products[
              (
                {
                  'single-handle': 'singleHandle',
                  'double-handle': 'doubleHandle',
                  'multi-handle': 'multiHandle',
                  windows: 'windows',
                } as const
              )[inquiry.product]
            ],
          ),
        ],
      )
    }
    const common = {
      lang,
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
        subject: normalizeSubjectValue(fill(copy.adminSubject, { name: fullName })),
        html: buildEmailHtml({
          ...common,
          badge: copy.adminBadge,
          heading: copy.adminHeading,
          footer: copy.adminFooter,
        }),
      })
      if (admin.error) return response(502, { code: 'SEND_FAILED' })
    } catch {
      console.error('Inquiry notification failed')
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
        subject: copy.userSubject,
        html: buildEmailHtml({
          ...common,
          badge: copy.userSubject,
          heading: copy.userHeading,
          intro: fill(copy.userIntro, {
            name: escapeHtml(inquiry.kind === 'facility' ? inquiry.name : inquiry.firstName),
          }),
          footer: copy.userFooter,
        }),
      })
      confirmationSent = !confirmation.error
    } catch {
      console.error('Inquiry confirmation failed')
    }
    return response(200, { success: true, confirmationSent })
  }
}

export const handler = createInquiryHandler()
