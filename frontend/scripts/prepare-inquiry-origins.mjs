import { mkdirSync, writeFileSync } from 'node:fs'

// Netlify supplies these public addresses during builds. Its function runtime may omit them.
// Bundle only normalized origins; never copy the rest of the environment into this file.
export function prepareInquiryOrigins(environment = process.env) {
  const origins = new Set()
  for (const name of ['URL', 'DEPLOY_PRIME_URL', 'DEPLOY_URL']) {
    const value = environment[name]
    if (!value) continue
    try {
      const url = new URL(value.trim())
      if (url.protocol === 'https:' || url.protocol === 'http:') origins.add(url.origin)
    } catch {
      // Invalid configuration grants no additional access.
    }
  }
  mkdirSync(new URL('../.netlify/', import.meta.url), { recursive: true })
  writeFileSync(
    new URL('../.netlify/inquiry-origins.json', import.meta.url),
    `${JSON.stringify([...origins])}\n`,
  )
}

prepareInquiryOrigins()
