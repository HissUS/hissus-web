export const INQUIRY_ACTION = 'hissus_inquiry'
export type TurnstileResult = { success?: boolean; hostname?: string; action?: string }

/** Only the server sends its secret to Cloudflare. Tokens are single-use and expire. */
export async function verifyTurnstileToken(
  secret: string,
  token: string,
): Promise<TurnstileResult> {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('Verification provider unavailable')
  return response.json()
}
