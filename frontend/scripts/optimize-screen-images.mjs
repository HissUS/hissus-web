import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
const base = 'src/assets/images'
const entries = ['single_handle', 'multi_handle', 'double_handle', 'windows'].flatMap((directory) =>
  readdirSync(join(base, directory))
    .filter((file) => file.endsWith('.jpg'))
    .map((file) => `${directory}/${file}`),
)
const manifest = {}
let before = 0
let after = 0
for (const file of [...entries, 'belc.jpg']) {
  const input = join(base, file)
  const [width] = execFileSync('magick', [input, '-auto-orient', '-format', '%w %h', 'info:'], {
    encoding: 'utf8',
  })
    .split(' ')
    .map(Number)
  const widths = [
    ...new Set([Math.min(640, width), Math.min(1200, width), Math.min(1800, width)]),
  ].sort((a, b) => a - b)
  const sources = widths.map((size) => {
    const output = file.replace(/\.jpg$/, `-${size}.webp`)
    execFileSync('magick', [
      input,
      '-auto-orient',
      '-resize',
      `${size}x>`,
      '-strip',
      '-quality',
      '84',
      join(base, output),
    ])
    return { file: output, width: size }
  })
  const largest = join(base, sources.at(-1).file)
  const [fullWidth, height] = execFileSync('magick', ['identify', '-format', '%w %h', largest], {
    encoding: 'utf8',
  })
    .split(' ')
    .map(Number)
  manifest[file] = { width: fullWidth, height, sources }
  before += statSync(input).size
  after += statSync(largest).size
}
execFileSync('magick', [
  join(base, 'logo.png'),
  '-define',
  'webp:lossless=true',
  join(base, 'logo.webp'),
])
writeFileSync(join(base, 'screen-image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(
  JSON.stringify({
    sourceImages: entries.length + 1,
    originalBytes: before,
    largestWebpBytes: after,
    reductionPercent: Math.round((1 - after / before) * 100),
  }),
)
