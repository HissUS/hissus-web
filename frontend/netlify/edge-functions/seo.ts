/** Host-aware indexing policy also covers immutable production deploy permalinks. */
export default async function seo(request: Request, context: { next: () => Promise<Response> }) {
  const url = new URL(request.url)
  // Preserve the email/API routing and response contracts.
  if (url.pathname.startsWith('/.netlify/') || url.pathname.startsWith('/api/'))
    return context.next()
  if (url.hostname === 'www.hissus.com') {
    url.hostname = 'hissus.com'
    url.protocol = 'https:'
    return Response.redirect(url, 301)
  }
  const response = await context.next()
  if (url.hostname === 'hissus.com') return response
  const headers = new Headers(response.headers)
  headers.set('X-Robots-Tag', 'noindex, nofollow')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
