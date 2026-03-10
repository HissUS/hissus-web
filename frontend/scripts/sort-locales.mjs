/**
 * Deep-sorts all keys in a locale JSON file alphabetically.
 * Called by lint-staged — receives file path(s) as CLI arguments.
 *
 * Usage: node scripts/sort-locales.mjs src/locales/zh-TW.json
 */
import { readFileSync, writeFileSync } from 'fs'

function deepSort(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return obj
  return Object.fromEntries(
    Object.entries(obj)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, deepSort(v)]),
  )
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('Usage: sort-locales.mjs <file> [<file>...]')
  process.exit(1)
}

for (const file of files) {
  const raw = readFileSync(file, 'utf-8')
  const sorted = deepSort(JSON.parse(raw))
  const output = JSON.stringify(sorted, null, 2) + '\n'

  if (raw !== output) {
    writeFileSync(file, output)
    console.log(`sorted: ${file}`)
  }
}
