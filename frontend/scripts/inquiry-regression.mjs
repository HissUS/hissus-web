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

const verificationOutput = join(temporary, 'turnstile.cjs')
buildSync({
  entryPoints: ['netlify/turnstile.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: verificationOutput,
})
const { verifyTurnstileToken } = require(verificationOutput)

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
  body: JSON.stringify({ turnstileToken: 'test-human-token', ...body }),
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
      turnstileSecret: 'test-secret',
    }),
    verifyToken: async () => ({ success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }),
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
test('Chinese facility inquiry accepts a company name, 10-digit phone and inquiry subject', async () => {
  const { handler, sent } = fixture()
  const result = await run(
    handler,
    event({
      kind: 'facility',
      name: '測試公司 <b>Test</b>',
      subject: '詢問最高限價 <script>test</script>',
      email: valid.email,
      phone: valid.phone,
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
    phone: valid.phone,
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
test('email pause switch blocks both forms before any provider call', async () => {
  const handler = createInquiryHandler({
    getConfig: () => ({
      apiKey: 'test-only',
      recipientEmail: 'team@example.com',
      origins: ['https://hissus.com'],
      emailsEnabled: false,
    }),
    sendMail: async () => {
      throw new Error('sending is paused: provider must not be called')
    },
  })
  for (const body of [
    valid,
    {
      kind: 'facility',
      name: 'Test Company',
      subject: 'Facility setup',
      email: valid.email,
      phone: valid.phone,
      locale: 'en',
    },
  ]) {
    const result = await run(handler, event(body))
    assert.equal(result.statusCode, 503)
    assert.equal(JSON.parse(result.body).code, 'UNAVAILABLE')
    assert.ok(JSON.parse(result.body).requestId)
  }
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
    body: JSON.stringify({ turnstileToken: 'test-human-token', ...body }),
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
        phone: valid.phone,
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
    getConfig: () => ({
      apiKey: 'test-only',
      recipientEmail: 'team@example.com',
      origins,
      turnstileSecret: 'test-secret',
    }),
    verifyToken: async () => ({
      success: true,
      hostname: new URL(permalink).hostname,
      action: 'hissus_inquiry',
    }),
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
    phone: valid.phone,
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

test('missing Turnstile proof blocks both businesses before verification or mail', async (context) => {
  context.mock.method(console, 'error', () => {})
  const { handler, sent } = fixture()
  for (const payload of [
    { ...valid, turnstileToken: '' },
    {
      kind: 'facility',
      name: 'Sample Co.',
      subject: 'Setup',
      email: valid.email,
      phone: valid.phone,
      turnstileToken: '',
    },
  ]) {
    const result = await run(handler, event(payload))
    assert.equal(result.statusCode, 403)
    assert.equal(JSON.parse(result.body).code, 'VERIFICATION_REQUIRED')
  }
  assert.equal(sent.length, 0)
})

test('server rejects failed, expired/replayed, wrong-action and wrong-host tokens before mail', async (context) => {
  context.mock.method(console, 'error', () => {})
  for (const proof of [
    { success: false },
    { success: false, 'error-codes': ['timeout-or-duplicate'] },
    { success: true, hostname: 'hissus.com', action: 'another_form' },
    { success: true, hostname: 'untrusted.example', action: 'hissus_inquiry' },
    { success: true, hostname: 'www.hissus.com', action: 'hissus_inquiry' },
    { success: true },
    null,
  ]) {
    let sends = 0
    const handler = createInquiryHandler({
      getConfig: () => ({
        apiKey: 'test-only',
        recipientEmail: 'team@example.com',
        origins: ['https://hissus.com', 'https://www.hissus.com'],
        turnstileSecret: 'server-secret',
      }),
      verifyToken: async () => proof,
      sendMail: async () => {
        sends++
        return { error: null }
      },
    })
    const result = await run(handler, event(valid))
    assert.equal(result.statusCode, 403)
    assert.equal(JSON.parse(result.body).code, 'VERIFICATION_REQUIRED')
    assert.equal(sends, 0)
    assert.ok(!result.body.includes('test-human-token'))
    assert.ok(!result.body.includes('server-secret'))
  }
})

test('missing server secret and verification outages fail closed without sending', async (context) => {
  context.mock.method(console, 'error', () => {})
  for (const turnstileSecret of [undefined, 'server-secret']) {
    const handler = createInquiryHandler({
      getConfig: () => ({
        apiKey: 'test-only',
        recipientEmail: 'team@example.com',
        origins: ['https://hissus.com'],
        turnstileSecret,
      }),
      verifyToken: async () => {
        throw new Error('mock outage')
      },
      sendMail: async () => {
        throw new Error('mail must not run')
      },
    })
    const result = await run(handler, event(valid))
    assert.equal(result.statusCode, 503)
    assert.equal(
      JSON.parse(result.body).code,
      turnstileSecret ? 'VERIFICATION_UNAVAILABLE' : 'UNAVAILABLE',
    )
  }
})

test('a verified single-use token sends once; replay cannot send another notification', async (context) => {
  context.mock.method(console, 'error', () => {})
  const seen = new Set()
  const sent = []
  const handler = createInquiryFunction({
    getConfig: () => ({
      apiKey: 'test-only',
      recipientEmail: 'team@example.com',
      origins: ['https://hissus.com'],
      turnstileSecret: 'server-secret',
    }),
    verifyToken: async (secret, token) => {
      assert.equal(secret, 'server-secret')
      if (seen.has(token)) return { success: false }
      seen.add(token)
      return { success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }
    },
    sendMail: async (_, mail) => {
      sent.push(mail)
      return { error: null }
    },
  })
  assert.equal((await handler(publicRequest(valid))).status, 200)
  assert.equal(sent.length, 2)
  assert.equal((await handler(publicRequest(valid))).status, 403)
  assert.equal(sent.length, 2)
})

test('actual verification client posts proof only to Cloudflare with a bounded timeout', async (context) => {
  const proof = { success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }
  const fetchMock = context.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify')
    assert.equal(options.method, 'POST')
    assert.equal(options.headers['Content-Type'], 'application/x-www-form-urlencoded')
    assert.equal(options.body.get('secret'), 'mock-server-secret')
    assert.equal(options.body.get('response'), 'mock-human-token')
    assert.ok(options.signal instanceof AbortSignal)
    return Response.json(proof)
  })
  assert.deepEqual(await verifyTurnstileToken('mock-server-secret', 'mock-human-token'), proof)
  fetchMock.mock.mockImplementation(async () => new Response('', { status: 503 }))
  await assert.rejects(verifyTurnstileToken('mock-server-secret', 'mock-human-token'))
})

const facilityPayload = {
  kind: 'facility',
  name: 'Sample Co.',
  subject: 'Factory setup',
  email: valid.email,
  phone: valid.phone,
  locale: 'en',
}
const inquiries = [valid, facilityPayload]
const secureSettings = {
  apiKey: 'test-only',
  recipientEmail: 'team@example.com',
  origins: ['https://hissus.com', 'https://www.hissus.com'],
  turnstileSecret: 'server-secret',
}

test('both forms reject missing, malformed, failed, expired and wrong-host/action tokens through both adapters', async (context) => {
  const logs = []
  context.mock.method(console, 'error', (...args) => logs.push(args))
  const cases = [
    [undefined, undefined, 403],
    ['', undefined, 403],
    ['   ', undefined, 403],
    [null, undefined, 400],
    [123, undefined, 400],
    [{}, undefined, 400],
    [[], undefined, 400],
    ['x'.repeat(2049), undefined, 400],
    ['private-token', { success: false, 'error-codes': ['invalid-input-response'] }, 403],
    ['private-token', { success: false, 'error-codes': ['timeout-or-duplicate'] }, 403],
    ['private-token', { success: 'true', hostname: 'hissus.com', action: 'hissus_inquiry' }, 403],
    ['private-token', { success: true, hostname: 'hissus.com', action: 'another_form' }, 403],
    [
      'private-token',
      { success: true, hostname: 'untrusted.example', action: 'hissus_inquiry' },
      403,
    ],
    ['private-token', { success: true, hostname: 'www.hissus.com', action: 'hissus_inquiry' }, 403],
    ['private-token', { success: true }, 403],
    ['private-token', null, 403],
    ['private-token', 'private-response', 403],
  ]
  for (const modern of [false, true]) {
    for (const [token, proof, status] of cases) {
      let sends = 0
      let verifies = 0
      const handler = (modern ? createInquiryFunction : createInquiryHandler)({
        getConfig: () => secureSettings,
        verifyToken: async () => {
          verifies++
          return proof
        },
        sendMail: async () => {
          sends++
          return { error: null }
        },
      })
      for (const payload of inquiries) {
        const body = JSON.stringify({
          ...payload,
          turnstileToken: token,
          verified: true,
          success: true,
          captchaVerified: true,
          'cf-turnstile-response': 'forged',
        })
        const response = modern
          ? await handler(publicRequest(payload, { body }))
          : await run(handler, event(payload, { body }))
        assert.equal(modern ? response.status : response.statusCode, status)
        const data = modern ? await response.json() : JSON.parse(response.body)
        assert.equal(data.code, status === 400 ? 'INVALID_INPUT' : 'VERIFICATION_REQUIRED')
        assert.deepEqual(Object.keys(data).sort(), ['code', 'requestId'])
      }
      assert.equal(sends, 0)
      assert.equal(verifies, proof === undefined ? 0 : 2)
    }
  }
  const output = JSON.stringify(logs)
  for (const privateValue of [
    'private-token',
    'server-secret',
    'private-response',
    valid.email,
    valid.phone,
  ])
    assert.equal(output.includes(privateValue), false)
})

test('actual Siteverify outages, bad JSON and missing secret never send for either business', async (context) => {
  context.mock.method(console, 'error', () => {})
  const fetchMock = context.mock.method(globalThis, 'fetch')
  for (const modern of [false, true]) {
    for (const secret of [undefined, 'server-secret']) {
      for (const failure of [
        () => new Response('', { status: 503 }),
        () => new Response('{broken'),
        () => {
          throw new DOMException('private-timeout', 'TimeoutError')
        },
        () => {
          throw new TypeError('private-network-error')
        },
      ]) {
        let sends = 0
        let verifies = 0
        fetchMock.mock.mockImplementation(async () => {
          verifies++
          return failure()
        })
        const handler = (modern ? createInquiryFunction : createInquiryHandler)({
          getConfig: () => ({ ...secureSettings, turnstileSecret: secret }),
          sendMail: async () => {
            sends++
            return { error: null }
          },
        })
        for (const payload of inquiries) {
          const response = modern
            ? await handler(publicRequest(payload))
            : await run(handler, event(payload))
          assert.equal(modern ? response.status : response.statusCode, 503)
          const data = modern ? await response.json() : JSON.parse(response.body)
          assert.equal(data.code, secret ? 'VERIFICATION_UNAVAILABLE' : 'UNAVAILABLE')
          assert.deepEqual(Object.keys(data).sort(), ['code', 'requestId'])
        }
        assert.equal(sends, 0)
        assert.equal(verifies, secret ? 2 : 0)
      }
    }
  }
})

test('real verification path rejects same-form, cross-form and simultaneous replay for both forms', async (context) => {
  context.mock.method(console, 'error', () => {})
  const fetchMock = context.mock.method(globalThis, 'fetch')
  for (const firstPayload of inquiries) {
    const seen = new Set()
    let sends = 0
    fetchMock.mock.mockImplementation(async (url, options) => {
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify')
      assert.equal(options.body.get('secret'), 'server-secret')
      const token = options.body.get('response')
      if (seen.has(token))
        return Response.json({ success: false, 'error-codes': ['timeout-or-duplicate'] })
      seen.add(token)
      return Response.json({ success: true, hostname: 'hissus.com', action: 'hissus_inquiry' })
    })
    const handler = createInquiryFunction({
      getConfig: () => secureSettings,
      sendMail: async () => {
        sends++
        return { error: null }
      },
    })
    assert.equal((await handler(publicRequest(firstPayload))).status, 200)
    assert.equal(sends, 2)
    for (const payload of inquiries)
      assert.equal((await handler(publicRequest(payload))).status, 403)
    assert.equal(sends, 2)
    const responses = await Promise.all(
      inquiries.map((payload) =>
        handler(publicRequest({ ...payload, turnstileToken: 'another-token' })),
      ),
    )
    assert.deepEqual(responses.map((response) => response.status).sort(), [200, 403])
    assert.equal(sends, 4)
  }
})

test('proof hostname must match request URL, irrespective of forged or omitted Origin/Host', async (context) => {
  context.mock.method(console, 'error', () => {})
  let sends = 0
  const handler = createInquiryFunction({
    getConfig: () => secureSettings,
    verifyToken: async () => ({ success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }),
    sendMail: async () => {
      sends++
      return { error: null }
    },
  })
  for (const payload of inquiries) {
    for (const origin of [undefined, 'https://hissus.com']) {
      const response = await handler(
        new Request('https://www.hissus.com/.netlify/functions/quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            host: 'hissus.com',
            ...(origin ? { origin } : {}),
          },
          body: JSON.stringify({
            ...payload,
            turnstileToken: 'private-token',
            hostname: 'hissus.com',
          }),
        }),
      )
      assert.equal(response.status, 403)
      assert.equal((await response.json()).code, 'VERIFICATION_REQUIRED')
    }
  }
  assert.equal(sends, 0)
  // A missing Origin never skips proof verification, but a valid server-verified token works.
  for (const payload of inquiries)
    assert.equal(
      (await handler(publicRequest(payload, { headers: { 'Content-Type': 'application/json' } })))
        .status,
      200,
    )
  assert.equal(sends, 4)
})

test('factory phone accepts only exactly ten ASCII digits before any provider access', async () => {
  let verifies = 0
  let sends = 0
  const handler = createInquiryFunction({
    getConfig: () => secureSettings,
    verifyToken: async () => {
      verifies++
      return { success: true, hostname: 'hissus.com', action: 'hissus_inquiry' }
    },
    sendMail: async () => {
      sends++
      return { error: null }
    },
  })
  for (const phone of [
    '',
    '123456789',
    '12345678901',
    '469-288-3098',
    '(469)2883098',
    '+14692883098',
    '469288309a',
    ' 4692883098',
    '4692883098 ',
    '４６９２８８３０９８',
    4692883098,
    null,
    [],
    {},
  ]) {
    const result = await handler(publicRequest({ ...facilityPayload, phone }))
    assert.equal(result.status, 400, String(phone))
    assert.equal((await result.json()).code, 'INVALID_INPUT')
  }
  assert.equal(verifies, 0)
  assert.equal(sends, 0)
  assert.equal(
    (await handler(publicRequest({ ...facilityPayload, phone: '0123456789' }))).status,
    200,
  )
  assert.equal(verifies, 1)
  assert.equal(sends, 2)
})
