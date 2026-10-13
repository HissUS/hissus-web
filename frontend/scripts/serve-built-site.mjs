import { createServer } from 'node:http'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { parseArgs } from 'node:util'
import seoEdge from '../netlify/edge-functions/seo.ts'

// Local preview of the static Netlify routes; this does not run email Functions.
const { values } = parseArgs({
  options: {
    host: { type: 'string', default: '127.0.0.1' },
    port: { type: 'string', default: '4173' },
  },
})
const root = resolve('dist')
const config = readFileSync('../netlify.toml', 'utf8')
const rules = [...config.matchAll(/\[\[redirects\]\]\n([\s\S]*?)(?=\n\[|$)/g)].map(([, block]) => ({
  from: block.match(/from = "([^"]+)"/)[1],
  to: block.match(/to = "([^"]+)"/)[1],
  status: Number(block.match(/status = (\d+)/)[1]),
  force: /force = true/.test(block),
  tab: block.match(/query = \{ tab = "([^"]+)" \}/)?.[1],
}))
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}
function fileResponse(path, status = 200) {
  const file = resolve(root, '.' + path)
  if (!file.startsWith(root + sep) || !existsSync(file))
    return new Response('Not found', { status: 404 })
  return new Response(readFileSync(file), {
    status,
    headers: { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' },
  })
}
function routeRequest(url) {
  if (!['GET', 'HEAD'].includes(url.method))
    return new Response('Static preview does not run Netlify Functions.', { status: 501 })
  const location = new URL(url.url)
  let match
  let splat = ''
  for (const rule of rules) {
    const star = rule.from.indexOf('*')
    const prefix = star < 0 ? rule.from : rule.from.slice(0, star)
    if (star < 0 ? location.pathname !== prefix : !location.pathname.startsWith(prefix)) continue
    if (rule.tab && rule.tab !== location.searchParams.get('tab')) continue
    match = rule
    splat = star < 0 ? '' : location.pathname.slice(prefix.length)
    break
  }
  const original = resolve(root, '.' + location.pathname)
  if (!match?.force && extname(original) && original.startsWith(root + sep) && existsSync(original))
    return fileResponse(location.pathname)
  if (!match) return fileResponse('/404.html', 404)
  const destination = match.to.replace(':splat', splat)
  if (match.status >= 300 && match.status < 400) {
    const target = new URL(destination, location)
    if (!target.search) target.search = location.search
    return new Response(null, { status: match.status, headers: { Location: target.href } })
  }
  return fileResponse(destination, match.status)
}
const server = createServer(async (incoming, outgoing) => {
  try {
    const url = `http://${incoming.headers.host}${incoming.url}`
    const request = new Request(url, { method: incoming.method })
    const response = await seoEdge(request, { next: async () => routeRequest(request) })
    outgoing.writeHead(response.status, Object.fromEntries(response.headers))
    outgoing.end(incoming.method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()))
  } catch {
    outgoing.writeHead(500)
    outgoing.end('Preview error')
  }
})
server.listen(Number(values.port), values.host, () =>
  console.log(`Static production preview: http://${values.host}:${values.port}`),
)
