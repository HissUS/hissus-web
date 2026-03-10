/**
 * Checks all locale JSON files for missing or extra keys relative to en.json.
 * Warns but does not block the commit (exit 0 even on warnings).
 *
 * To make it blocking, change the final `process.exit(0)` to `process.exit(1)`.
 *
 * Usage: node scripts/check-locales.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const LOCALES_DIR = 'src/locales'
const BASE_FILE = 'en.json'

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? flattenKeys(value, fullKey)
      : [fullKey]
  })
}

const baseContent = JSON.parse(readFileSync(join(LOCALES_DIR, BASE_FILE), 'utf-8'))
const baseKeys = new Set(flattenKeys(baseContent))

const localeFiles = readdirSync(LOCALES_DIR).filter(
  (f) => f.endsWith('.json') && f !== BASE_FILE,
)

if (localeFiles.length === 0) {
  console.log('No locale files to check.')
  process.exit(0)
}

let hasWarnings = false

for (const file of localeFiles) {
  const content = JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf-8'))
  const keys = new Set(flattenKeys(content))

  const missing = [...baseKeys].filter((k) => !keys.has(k))
  const extra = [...keys].filter((k) => !baseKeys.has(k))

  if (missing.length === 0 && extra.length === 0) {
    console.log(`  ✓  ${file}`)
    continue
  }

  hasWarnings = true

  if (missing.length > 0) {
    console.warn(`  ⚠  ${file}: ${missing.length} missing key(s):`)
    missing.forEach((k) => console.warn(`       - ${k}`))
  }
  if (extra.length > 0) {
    console.warn(`  ⚠  ${file}: ${extra.length} extra key(s) not in ${BASE_FILE}:`)
    extra.forEach((k) => console.warn(`       + ${k}`))
  }
}

// Exit 1 (blocking) when there are warnings, 0 when all keys are in sync.
// To make non-blocking, change the line below to: process.exit(0)
if (hasWarnings) {
  console.warn('\n  Locale files are out of sync. Please update the missing translations.')
  process.exit(1)
}

process.exit(0)
