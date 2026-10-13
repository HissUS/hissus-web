import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { prepareInquiryOrigins } from './prepare-inquiry-origins.mjs'

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
const {
  createInquiryHandler,
  createInquiryFunction,
  config,
  default: netlifyFunction,
  ...otherExports
} = require(output)
const diagnosticsOutput = join(temporary, 'diagnostics.cjs')
buildSync({
  entryPoints: ['netlify/inquiryDiagnostics.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: diagnosticsOutput,
})
const { getAllowedOrigins, getMailFailureDetails } = require(diagnosticsOutput)

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
function fixture(results = [], modern = false) {
  const sent = []
  const handler = (modern ? createInquiryFunction : createInquiryHandler)({
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
  assert.equal(
    sent[0].subject,
    '[HISS US WINDOWS QUOTE] New request - Pleated Window Screen - <b>Test</b> Visitor',
  )
  assert.equal(sent[1].subject, '[HISS US WINDOWS QUOTE] Request received - Pleated Window Screen')
  assert.ok(sent.every((mail) => mail.html.includes('Window & Screen Quote')))
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
  assert.equal(
    sent[0].subject,
    '[HISS US FACILITY INQUIRY] 新需求 - 詢問最高限價 <script>test</script> - 測試公司 <b>Test</b>',
  )
  assert.equal(
    sent[1].subject,
    '[HISS US FACILITY INQUIRY] 已收到您的需求 - 詢問最高限價 <script>test</script>',
  )
  assert.ok(sent.every((mail) => mail.html.includes('工廠與設施建置')))
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
  const getResponse = await run(handler, event(valid, { httpMethod: 'GET' }))
  assert.equal(getResponse.statusCode, 405)
  assert.equal(JSON.parse(getResponse.body).code, 'METHOD_NOT_ALLOWED')
  assert.equal(getResponse.headers.Allow, 'POST')
  for (const [extras, status] of [
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
  assert.equal(typeof netlifyFunction, 'function')
  assert.equal(Object.hasOwn(otherExports, 'handler'), false)
  assert.equal(config.path, '/.netlify/functions/quote')
  assert.equal(config.rateLimit.windowLimit, 5)
  assert.equal(config.rateLimit.windowSize, 60)
  assert.deepEqual(config.rateLimit.aggregateBy, ['ip', 'domain'])
})

const publicRequest = (body, extras = {}) =>
  new Request('https://hissus.com/.netlify/functions/quote', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://hissus.com' },
    body: JSON.stringify(body),
    ...extras,
  })

test('modern public entry preserves validation, method, size, origin and request ID responses', async (context) => {
  context.mock.method(console, 'error', () => {})
  const { handler, sent } = fixture([], true)
  for (const [input, status, code] of [
    [publicRequest({}), 400, 'INVALID_INPUT'],
    [publicRequest(valid, { body: '{' }), 400, 'INVALID_INPUT'],
    [new Request('https://hissus.com/.netlify/functions/quote'), 405, 'METHOD_NOT_ALLOWED'],
    [publicRequest(valid, { method: 'PUT' }), 405, 'METHOD_NOT_ALLOWED'],
    [publicRequest(valid, { body: 'x'.repeat(22001) }), 413, 'TOO_LARGE'],
    [publicRequest(valid, { body: '中'.repeat(6000) }), 413, 'TOO_LARGE'],
    [publicRequest(valid, { headers: { 'content-type': 'text/plain' } }), 415, 'INVALID_INPUT'],
    [
      publicRequest(valid, {
        headers: { 'content-type': 'application/json', origin: 'https://untrusted.example' },
      }),
      403,
      'ORIGIN_DENIED',
    ],
  ]) {
    const result = await handler(input)
    assert.ok(result instanceof Response)
    assert.equal(result.status, status)
    const data = await result.json()
    assert.equal(data.code, code)
    assert.equal(result.headers.get('x-request-id'), data.requestId)
    assert.equal(result.headers.get('cache-control'), 'no-store')
    if (status === 405) assert.equal(result.headers.get('allow'), 'POST')
  }
  // The deployed default export itself rejects empty submissions before provider access.
  assert.equal((await netlifyFunction(publicRequest({}))).status, 400)
  assert.equal(sent.length, 0)
})

test('modern function keeps identical team/customer mail for both businesses and languages', async () => {
  for (const locale of ['en', 'zh-TW']) {
    for (const payload of [
      { ...valid, locale },
      {
        kind: 'facility',
        name: 'Sample <Company>',
        subject: 'Setup & GMP',
        email: valid.email,
        phone: '+886 912 345 678',
        message: '<script>test</script>\nSecond line',
        locale,
      },
    ]) {
      const previous = fixture()
      const modern = fixture([], true)
      const expected = await run(previous.handler, event(payload))
      const actual = await modern.handler(publicRequest(payload))
      assert.equal(actual.status, expected.statusCode)
      assert.deepEqual(await actual.json(), JSON.parse(expected.body))
      assert.deepEqual(modern.sent, previous.sent)
      assert.equal(modern.sent.length, 2)
    }
  }
  for (const failure of [
    { error: { name: 'validation_error', message: 'mock rejection' } },
    new Error('mock transport failure'),
  ]) {
    const { handler, sent } = fixture([failure], true)
    assert.equal((await handler(publicRequest(valid))).status, 502)
    assert.equal(sent.length, 1)
  }
  const partial = fixture([{ error: null }, { error: { message: 'mock failure' } }], true)
  const receipt = await partial.handler(publicRequest(valid))
  assert.equal(receipt.status, 200)
  assert.deepEqual(await receipt.json(), { success: true, confirmationSent: false })
})

test('modern request reader cancels oversized streams before consuming the remaining body', async () => {
  let pulls = 0
  let cancelled = false
  const stream = new ReadableStream({
    pull(controller) {
      pulls++
      controller.enqueue(new Uint8Array(9000))
    },
    cancel() {
      cancelled = true
    },
  })
  const { handler, sent } = fixture([], true)
  const response = await handler(publicRequest(valid, { body: stream, duplex: 'half' }))
  assert.equal(response.status, 413)
  assert.equal(cancelled, true)
  assert.ok(pulls <= 3)
  assert.equal(sent.length, 0)
})

test('Netlify deploy permalink accepts inquiries while unrelated sites remain rejected', async (context) => {
  context.mock.method(console, 'error', () => {})
  const permalink = 'https://6acd53d1b651dd7826ee16cc--hissus.netlify.app'
  const origins = getAllowedOrigins({
    URL: 'https://hissus.netlify.app/',
    DEPLOY_PRIME_URL: 'https://preview--hissus.netlify.app/',
    DEPLOY_URL: `${permalink}/factory/contact`,
  })
  assert.ok(origins.includes(permalink))
  const sent = []
  const handler = createInquiryHandler({
    getConfig: () => ({ apiKey: 'test-only', recipientEmail: 'team@example.com', origins }),
    sendMail: async (_, mail) => {
      sent.push(mail)
      return { error: null }
    },
  })
  const body = {
    kind: 'facility',
    name: 'Sample Company',
    subject: 'Facility setup',
    email: valid.email,
    phone: '+1 469 288 3098',
    locale: 'en',
  }
  const allowed = await run(
    handler,
    event(body, { headers: { 'content-type': 'application/json', origin: permalink } }),
  )
  assert.equal(allowed.statusCode, 200)
  assert.equal(sent.length, 2)
  for (const origin of [
    'https://other.netlify.app',
    'https://fake--hissus.netlify.app',
    `${permalink}.untrusted.example`,
  ]) {
    const denied = await run(
      handler,
      event(body, { headers: { 'content-type': 'application/json', origin } }),
    )
    assert.equal(denied.statusCode, 403)
    assert.equal(JSON.parse(denied.body).code, 'ORIGIN_DENIED')
  }
  assert.equal(sent.length, 2)
})

test('origin configuration normalizes trusted URLs and excludes malformed settings', () => {
  assert.deepEqual(
    getAllowedOrigins({
      URL: 'not a URL',
      DEPLOY_URL: 'file:///tmp/test',
      DEPLOY_PRIME_URL: 'https://hissus.com/',
    }),
    ['https://hissus.com', 'https://www.hissus.com'],
  )
})

test('default handler accepts bundled deploy origins without runtime URL variables', async (context) => {
  context.mock.method(console, 'error', () => {})
  const permalink = 'https://6acd57786add24678df4fcf9--hissus.netlify.app'
  const bundledOutput = join(temporary, 'build-origins-quote.cjs')
  try {
    prepareInquiryOrigins({
      URL: 'https://hissus.netlify.app/',
      DEPLOY_PRIME_URL: 'https://hissus.com/',
      DEPLOY_URL: `${permalink}/`,
      RESEND_API_KEY: 'not-to-be-bundled',
    })
    assert.deepEqual(
      JSON.parse(
        readFileSync(new URL('../.netlify/inquiry-origins.json', import.meta.url), 'utf8'),
      ),
      ['https://hissus.netlify.app', 'https://hissus.com', permalink],
    )
    buildSync({
      entryPoints: ['netlify/functions/quote.ts'],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      outfile: bundledOutput,
    })
    assert.equal(readFileSync(bundledOutput, 'utf8').includes('not-to-be-bundled'), false)
  } finally {
    prepareInquiryOrigins()
  }
  const names = ['URL', 'DEPLOY_PRIME_URL', 'DEPLOY_URL', 'RESEND_API_KEY']
  const previous = names.map((name) => [name, process.env[name]])
  context.after(() => {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  })
  for (const name of names) delete process.env[name]
  const { createInquiryHandler: createBundledHandler } = require(bundledOutput)
  const handler = createBundledHandler()
  for (const body of [
    valid,
    {
      kind: 'facility',
      name: 'Sample Co.',
      subject: 'Setup',
      email: valid.email,
      phone: valid.phone,
    },
  ]) {
    for (const origin of [permalink, 'https://hissus.netlify.app', 'https://hissus.com']) {
      const response = await run(
        handler,
        event(body, { headers: { 'content-type': 'application/json', origin } }),
      )
      // Reaching missing-key validation proves the origin was accepted without sending mail.
      assert.equal(response.statusCode, 503)
      assert.equal(JSON.parse(response.body).code, 'UNAVAILABLE')
    }
    const denied = await run(
      handler,
      event(body, {
        headers: { 'content-type': 'application/json', origin: 'https://other.netlify.app' },
      }),
    )
    assert.equal(denied.statusCode, 403)
  }
})

test('provider rejection logs only safe categories and a correlatable request ID', async (context) => {
  const entries = []
  context.mock.method(console, 'error', (...args) => entries.push(args))
  const { handler } = fixture([
    {
      error: {
        name: 'validation_error',
        statusCode: 403,
        message:
          'The hissus.com domain is not verified. Customer private@example.com, credential example-private-token.',
      },
    },
  ])
  const result = await run(handler, event(valid))
  assert.equal(result.statusCode, 502)
  const requestId = JSON.parse(result.body).requestId
  assert.match(requestId, /^[0-9a-f-]{36}$/)
  assert.equal(result.headers['X-Request-ID'], requestId)
  assert.deepEqual(entries[0][1], {
    requestId,
    phase: 'notification',
    reason: 'sender_domain_unverified',
    providerCode: 'validation_error',
    providerStatus: 403,
  })
  const logs = JSON.stringify(entries)
  assert.equal(
    logs.includes('private@example.com') ||
      logs.includes('example-private-token') ||
      logs.includes(valid.email) ||
      logs.includes(valid.phone),
    false,
  )
  assert.equal(result.body.includes('domain') || result.body.includes('credential'), false)
})

test('diagnostics distinguish access, quota, transport and timeout without exposing raw errors', () => {
  for (const [name, reason] of [
    ['invalid_api_key', 'api_key_rejected'],
    ['restricted_api_key', 'sending_access_denied'],
    ['rate_limit_exceeded', 'provider_rate_limited'],
    ['daily_quota_exceeded', 'provider_quota_exceeded'],
    ['TimeoutError', 'mail_timeout'],
  ]) {
    assert.equal(getMailFailureDetails({ name, message: 'private-token' }).reason, reason)
  }
  const unknown = getMailFailureDetails({
    name: 'private@example.com',
    message: 'private-token',
    statusCode: 999,
  })
  assert.deepEqual(unknown, { reason: 'provider_rejected', providerCode: 'unknown' })
  assert.equal(getMailFailureDetails(new TypeError('private-token')).reason, 'mail_transport_error')
})
