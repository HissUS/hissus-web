const PROVIDER_CODES = new Set([
  'validation_error',
  'missing_api_key',
  'invalid_api_key',
  'restricted_api_key',
  'invalid_access',
  'invalid_from_address',
  'invalid_parameter',
  'missing_required_field',
  'rate_limit_exceeded',
  'daily_quota_exceeded',
  'monthly_quota_exceeded',
  'application_error',
  'internal_server_error',
])

/** Only trusted build/runtime configuration defines origins, including immutable deploys. */
export function getAllowedOrigins(
  environment: { URL?: string; DEPLOY_PRIME_URL?: string; DEPLOY_URL?: string },
  buildOrigins: readonly string[] = [],
) {
  const origins = new Set(['https://hissus.com', 'https://www.hissus.com'])
  for (const value of [
    environment.URL,
    environment.DEPLOY_PRIME_URL,
    environment.DEPLOY_URL,
    ...buildOrigins,
  ]) {
    if (!value) continue
    try {
      const url = new URL(value.trim())
      if (url.protocol === 'https:' || url.protocol === 'http:') origins.add(url.origin)
    } catch {
      /* Ignore malformed server settings rather than weakening the origin check. */
    }
  }
  return [...origins]
}

/** Log fixed categories only. Raw provider messages can contain addresses or credentials. */
export function getMailFailureDetails(error: unknown) {
  const value = error && typeof error === 'object' ? (error as Record<string, unknown>) : {}
  const name = typeof value.name === 'string' ? value.name : ''
  const message = typeof value.message === 'string' ? value.message.toLowerCase() : ''
  const providerCode = PROVIDER_CODES.has(name) ? name : 'unknown'
  const providerStatus =
    typeof value.statusCode === 'number' &&
    Number.isInteger(value.statusCode) &&
    value.statusCode >= 100 &&
    value.statusCode <= 599
      ? value.statusCode
      : undefined
  let reason = 'provider_rejected'
  if (
    message.includes('domain') &&
    (message.includes('not verified') || message.includes('verify your domain'))
  )
    reason = 'sender_domain_unverified'
  else if (name === 'invalid_api_key' || name === 'missing_api_key') reason = 'api_key_rejected'
  else if (name === 'restricted_api_key' || name === 'invalid_access')
    reason = 'sending_access_denied'
  else if (name === 'rate_limit_exceeded') reason = 'provider_rate_limited'
  else if (name === 'daily_quota_exceeded' || name === 'monthly_quota_exceeded')
    reason = 'provider_quota_exceeded'
  else if (
    message.includes('only send testing emails') ||
    message.includes('only send emails to your own')
  )
    reason = 'testing_restriction'
  else if (name === 'TimeoutError' || name === 'AbortError') reason = 'mail_timeout'
  else if (error instanceof Error) reason = 'mail_transport_error'
  return { reason, providerCode, ...(providerStatus ? { providerStatus } : {}) }
}
