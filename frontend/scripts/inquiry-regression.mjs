import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

// Bundle the actual function, including the real Zod schema and locale dictionaries.
const require = createRequire(import.meta.url)
const viteRequire = createRequire(require.resolve('vite/package.json'))
const { buildSync } = viteRequire('esbuild')
const temporary = mkdtempSync(join(tmpdir(), 'hissus-inquiry-'))
const output = join(temporary, 'quote.cjs')
buildSync({
  entryPoints: ['netlify/functions/quote.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: output,
})
const { createInquiryHandler, config } = require(output)
process.on('exit', () => rmSync(temporary, { recursive: true, force: true }))
const valid = {
  firstName: 'Test',
  lastName: 'Visitor',
  email: 'test@example.com',
  phone: '4692883098',
  city: 'Plano',
  product: 'windows',
  message: 'A screen inquiry',
  locale: 'en',
}
const event = (body, extras = {}) => ({
  httpMethod: 'POST',
  headers: { 'content-type': 'application/json', origin: 'https://hissus.com' },
  body: JSON.stringify(body),
  isBase64Encoded: false,
  ...extras,
})
function fixture(results = []) {
  const sent = []
  const handler = createInquiryHandler({
    getConfig: () => ({
      apiKey: 'test-only',
      recipientEmail: 'team@example.com',
      origins: ['https://hissus.com'],
    }),
    sendMail: async (_, mail) => {
      sent.push(mail)
      const result = results.shift()
      if (result instanceof Error) throw result
      return result ?? { error: null, data: { id: 'mock' } }
    },
  })
  return { handler, sent }
}
const run = (handler, input) => handler(input, {}, () => {})

test('screen inquiry notifies team and customer; HTML is escaped', async () => {
  const { handler, sent } = fixture()
  const result = await run(
    handler,
    event({ ...valid, firstName: '<b>Test</b>', message: '<script>alert(1)</script>' }),
  )
  assert.equal(result.statusCode, 200)
  assert.equal(sent.length, 2)
  assert.deepEqual(JSON.parse(result.body), { success: true, confirmationSent: true })
  assert.ok(sent[1].html.includes('&lt;b&gt;Test&lt;/b&gt;'))
  assert.ok(!sent[1].html.includes('<script>'))
  assert.equal(sent[0].replyTo, valid.email)
  assert.equal(sent[1].replyTo, 'team@example.com')
  assert.ok(sent[0].html.includes('Pleated Window Screen'))
})
test('Chinese facility inquiry accepts a company name, international phone and inquiry subject', async () => {
  const { handler, sent } = fixture()
  const result = await run(
    handler,
    event({
      kind: 'facility',
      name: '測試公司 <b>Test</b>',
      subject: '詢問最高限價 <script>test</script>',
      email: valid.email,
      phone: '+886 912 345 678',
      message: '想了解合作方式',
      locale: 'zh-TW',
    }),
  )
  assert.equal(result.statusCode, 200)
  assert.ok(sent[0].html.includes('工廠與設施建置'))
  assert.ok(sent[0].html.includes('lang="zh-TW"'))
  assert.ok(sent[0].html.includes('姓名／公司名稱'))
  assert.ok(sent[0].html.includes('詢問最高限價 &lt;script&gt;test&lt;/script&gt;'))
  assert.ok(sent[1].html.includes('測試公司 &lt;b&gt;Test&lt;/b&gt;'))
  assert.ok(!sent[0].html.includes('專案地點'))
  assert.ok(sent.every((mail) => !mail.subject.includes('\u2014')))
  assert.ok(sent[0].html.includes('工廠與設施詢問表單'))
  assert.ok(sent[1].html.includes('工廠與設施詢問的摘要'))
  assert.ok(!sent[1].html.includes('報價需求的摘要'))
  assert.equal(sent[0].replyTo, valid.email)
})
test('invalid fields, types, product, city, JSON and honeypot are rejected before email', async () => {
  const { handler, sent } = fixture()
  for (const body of [
    {},
    { ...valid, firstName: [] },
    { ...valid, email: 'bad' },
    { ...valid, city: 'Unknown' },
    { ...valid, product: 'arbitrary' },
    { ...valid, phone: 'bad' },
    { ...valid, website: 'bot' },
    { ...valid, message: 'x'.repeat(4001) },
    { ...valid, locale: 'unsupported' },
  ])
    assert.equal((await run(handler, event(body))).statusCode, 400)
  assert.equal((await run(handler, event(valid, { body: '{broken' }))).statusCode, 400)
  assert.equal(sent.length, 0)
})
test('facility input requires only its own bounded name/contact/subject fields', async () => {
  const { handler, sent } = fixture()
  const facility = {
    kind: 'facility',
    name: 'Sample Company',
    email: valid.email,
    phone: '+1 469 288 3098',
    subject: 'Facility setup',
    locale: 'en',
  }
  for (const body of [
    { ...facility, name: '' },
    { ...facility, subject: '' },
    { ...facility, name: [] },
    { ...facility, subject: {} },
    { ...facility, name: 'x'.repeat(161) },
    { ...facility, subject: 'x'.repeat(201) },
    { ...facility, subject: 'line\nbreak' },
    { ...facility, phone: 'bad' },
    { ...facility, email: 'bad' },
    { ...facility, website: 'bot' },
  ])
    assert.equal((await run(handler, event(body))).statusCode, 400)
  assert.equal(sent.length, 0)
  const result = await run(handler, event(facility))
  assert.equal(result.statusCode, 200)
  assert.equal(sent.length, 2)
})
test('method, media type, body size, origin and missing configuration have explicit errors', async () => {
  const { handler, sent } = fixture()
  for (const [extras, status] of [
    [{ httpMethod: 'GET' }, 405],
    [{ headers: { 'content-type': 'text/plain' } }, 415],
    [{ body: 'x'.repeat(22001) }, 413],
    [{ headers: { 'content-type': 'application/json', origin: 'https://untrusted.example' } }, 403],
  ])
    assert.equal((await run(handler, event(valid, extras))).statusCode, status)
  const unavailable = createInquiryHandler({
    getConfig: () => ({ recipientEmail: 'team@example.com', origins: [] }),
    sendMail: async () => {
      throw new Error('must not run')
    },
  })
  assert.equal(
    (await run(unavailable, event(valid, { headers: { 'content-type': 'application/json' } })))
      .statusCode,
    503,
  )
  assert.equal(sent.length, 0)
})
test('provider returned error or exception never claims success', async () => {
  for (const providerFailure of [
    { error: { message: 'mock failure' } },
    new Error('mock failure'),
  ]) {
    const { handler, sent } = fixture([providerFailure])
    const result = await run(handler, event(valid))
    assert.equal(result.statusCode, 502)
    assert.equal(sent.length, 1)
    assert.ok(!result.body.includes('success'))
  }
})
test('confirmation failure reports team receipt without encouraging duplicate mail', async () => {
  const { handler } = fixture([{ error: null }, { error: { message: 'mock failure' } }])
  const result = await run(handler, event(valid))
  assert.deepEqual(JSON.parse(result.body), { success: true, confirmationSent: false })
})
test('Netlify edge limits are declared; this test does not establish deployed enforcement', () => {
  assert.equal(config.rateLimit.windowLimit, 5)
  assert.equal(config.rateLimit.windowSize, 60)
  assert.deepEqual(config.rateLimit.aggregateBy, ['ip', 'domain'])
})
