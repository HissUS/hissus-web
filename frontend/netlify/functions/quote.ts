import type { Handler } from '@netlify/functions'
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
  logoUrl?: string
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
    logoUrl,
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
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const apiKey = process.env.RESEND_API_KEY
    const recipientEmail = process.env.QUOTE_RECIPIENT_EMAIL || 'hiss.usatx@gmail.com'

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
      }
    }

    const resend = new Resend(apiKey)

    const { firstName, lastName, email, phone, city, product, message, locale } = JSON.parse(
      event.body || '{}',
    )

    if (!firstName || !lastName || !email || !phone || !city || !product) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      }
    }

    const lang = locale && (locale === 'zh-TW' || locale === 'en') ? locale : 'en'
    const s = lang === 'zh-TW' ? zhTW.quote.email : en.quote.email
    const fullName = `${firstName} ${lastName}`
    const siteUrl = process.env.URL || process.env.DEPLOY_URL || ''
    const logoUrl = siteUrl ? `${siteUrl}/logo.png` : ''
    const safeFullName = escapeHtml(fullName)
    const safeEmail = escapeHtml(email)
    const safePhone = escapeHtml(phone)
    const safeCity = escapeHtml(city)
    const safeProduct = escapeHtml(product)
    const safeMessage = escapeHtml(message || '')

    const rows: [string, string][] = [
      [s.labelName, safeFullName],
      [s.labelEmail, safeEmail],
      [s.labelPhone, safePhone],
      [s.labelCity, safeCity],
      [s.labelProduct, safeProduct],
    ]

    // Admin notification email
    await resend.emails.send({
      from: 'HISS US - Pleated Screen Quote Form <quotes@hissus.com>',
      to: recipientEmail,
      subject: normalizeSubjectValue(fill(s.adminSubject, { name: fullName })),
      html: buildEmailHtml({
        lang,
        badge: s.adminBadge,
        heading: s.adminHeading,
        rows,
        message: safeMessage,
        noneLabel: s.none,
        detailsHeading: s.detailsHeading,
        messageHeading: s.messageHeading,
        footer: s.adminFooter,
      }),
    })

    // User confirmation copy
    await resend.emails.send({
      from: 'HISS US - Pleated Screen Quote Form <quotes@hissus.com>',
      to: email,
      subject: s.userSubject,
      html: buildEmailHtml({
        lang,
        badge: s.userSubject,
        heading: s.userHeading,
        intro: fill(s.userIntro, { name: firstName }),
        rows,
        message: safeMessage,
        noneLabel: s.none,
        detailsHeading: s.detailsHeading,
        messageHeading: s.messageHeading,
        footer: s.userFooter,
      }),
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('FUNCTION ERROR:', err)

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' }),
    }
  }
}
