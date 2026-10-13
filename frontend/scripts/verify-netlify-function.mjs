import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import './prepare-inquiry-origins.mjs'

// Optional build-tool verification. Supply Netlify's installed bundler without adding an app dependency.
const modulePath = process.env.NETLIFY_BUNDLER_MODULE
if (!modulePath)
  throw new Error('Set NETLIFY_BUNDLER_MODULE to the installed Netlify bundler dist/main.js path.')
const { zipFunctions } = await import(pathToFileURL(resolve(modulePath)).href)
const basePath = fileURLToPath(new URL('../', import.meta.url))
const output = mkdtempSync(join(tmpdir(), 'hissus-netlify-metadata-'))
const manifestPath = join(output, 'manifest.json')
await zipFunctions(join(basePath, 'netlify/functions'), output, {
  basePath,
  repositoryRoot: resolve(basePath, '..'),
  config: { '*': { nodeBundler: 'esbuild', nodeVersion: '24' } },
  manifest: manifestPath,
})
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
assert.equal(manifest.functions.length, 1, 'Only the quote endpoint should be bundled')
const [quote] = manifest.functions
assert.equal(quote.name, 'quote')
assert.equal(quote.buildData.runtimeAPIVersion, 2, 'The deployed entry must use the modern API')
assert.equal(quote.trafficRules?.action.type, 'rate_limit', 'Netlify must emit the traffic rule')
assert.deepEqual(quote.trafficRules.action.config.rateLimitConfig, {
  windowLimit: 5,
  windowSize: 60,
  algorithm: 'sliding_window',
})
assert.deepEqual(quote.trafficRules.action.config.aggregate.keys, [
  { type: 'ip' },
  { type: 'domain' },
])
assert.ok(quote.routes.some((route) => route.literal === '/.netlify/functions/quote'))
assert.ok(
  quote.routes.every((route) => route.methods.length === 0),
  'The handler must retain 405 responses',
)
console.log(
  JSON.stringify(
    {
      runtimeAPIVersion: quote.buildData.runtimeAPIVersion,
      routes: quote.routes,
      trafficRules: quote.trafficRules,
      manifestPath,
      note: 'Local bundling verified. Deployment registration and live HTTP 429 remain unverified.',
    },
    null,
    2,
  ),
)
