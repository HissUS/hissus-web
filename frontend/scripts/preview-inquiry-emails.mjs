import { createRequire } from 'node:module'
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import './prepare-inquiry-origins.mjs'

// Use the real handler with an injected sender. No API call or email is sent.
const require = createRequire(import.meta.url)
const viteRequire = createRequire(require.resolve('vite/package.json'))
const { buildSync } = viteRequire('esbuild')
const temporary = mkdtempSync(join(tmpdir(), 'hissus-email-preview-'))
const output = resolve(process.argv[2] || '../docs/email-previews')
mkdirSync(output, { recursive: true })
const manifest = []
try {
  buildSync({
    entryPoints: ['netlify/functions/quote.ts'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: join(temporary, 'quote.cjs'),
  })
  const { createInquiryHandler } = require(join(temporary, 'quote.cjs'))
  for (const locale of ['en', 'zh-TW'])
    for (const kind of ['facility', 'screen']) {
      const messages = []
      const handler = createInquiryHandler({
        getConfig: () => ({
          apiKey: 'preview-only',
          recipientEmail: 'hiss.usatx@gmail.com',
          origins: ['https://hissus.com'],
          turnstileSecret: 'preview-only',
        }),
        verifyToken: async () => ({ success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }),
        sendMail: async (_, mail) => {
          messages.push(mail)
          return { error: null, data: { id: 'preview-not-sent' } }
        },
      })
      const sample = {
        turnstileToken: 'preview-only-token',
        kind,
        locale,
        email: 'client@example.com',
        phone: '4692883098',
        ...(kind === 'facility'
          ? {
              name: locale === 'en' ? 'Sample Manufacturing Co.' : '範例製造公司',
              subject:
                locale === 'en'
                  ? 'Factory setup and GMP cooperation'
                  : '廠房建置與最高限價合作方式',
            }
          : {
              firstName: locale === 'en' ? 'Taylor' : '小明',
              lastName: locale === 'en' ? 'Lee' : '陳',
              city: 'Plano',
              product: 'single-handle',
            }),
        message:
          locale === 'en'
            ? kind === 'facility'
              ? 'We are planning a new facility.\nPlease let us know how to discuss scope, costs, and next steps.'
              : 'We would like a retractable screen for our backyard door.\nPlease let us know about sizing and installation.'
            : kind === 'facility'
              ? '我們正在規劃新的廠房。\n想了解施工範圍、費用及後續洽談方式。'
              : '我們想在後院門安裝捲簾紗門。\n請提供尺寸丈量與安裝的相關資訊。',
      }
      const response = await handler(
        {
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json', origin: 'https://hissus.com' },
          body: JSON.stringify(sample),
          isBase64Encoded: false,
        },
        {},
        () => {},
      )
      if (response.statusCode !== 200 || messages.length !== 2)
        throw new Error('Email preview handler failed')
      for (const [index, audience] of ['team', 'client'].entries()) {
        const mail = messages[index]
        const file = `${kind}-${audience}-${locale}.html`
        writeFileSync(join(output, file), mail.html)
        manifest.push({
          kind,
          audience,
          locale,
          file,
          from: mail.from,
          to: mail.to,
          replyTo: mail.replyTo,
          subject: mail.subject,
        })
      }
    }
  writeFileSync(join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
  const options = manifest
    .map(
      (item) =>
        `<option value="${item.file}">${item.kind === 'facility' ? 'Factory' : 'Windows'} / ${item.audience} / ${item.locale}</option>`,
    )
    .join('')
  writeFileSync(
    join(output, 'index.html'),
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HISSUS email previews</title><style>body{margin:0;font-family:Arial,sans-serif;background:#f0f2f5;color:#1a2b3c}header{padding:24px;background:white}h1{font-size:24px}label{display:block;margin:16px 0}select{padding:12px;max-width:100%;font-size:16px}iframe{border:0;width:100%;height:100vh}</style></head><body><header><h1>HISSUS email previews</h1><p>Sample content rendered from the actual inquiry handler. No email was sent.</p><label for="preview">Choose business, recipient and language</label><select id="preview">${options}</select></header><iframe title="Email preview" src="${manifest[0].file}"></iframe><script>document.querySelector('select').addEventListener('change',event=>document.querySelector('iframe').src=event.target.value)</script></body></html>`,
  )
  console.log(`Rendered ${manifest.length} email previews in ${output}. No email sent.`)
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
