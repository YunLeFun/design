/** Node-only generator. SVG geometry comes from icons; colors come from UI tokens. */
import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { icons } from '@yunlefun/icons'
import postcss from 'postcss'

export function readBrandPalette(css) {
  const light = new Map()
  const dark = new Map()
  postcss.parse(css).walkRules((rule) => {
    const selectors = rule.selectors || []
    const target = selectors.includes(':root') ? light : selectors.includes('.dark') ? dark : undefined
    if (!target)
      return
    rule.walkDecls(/^--ylf-/, decl => target.set(decl.prop, decl.value))
  })
  const resolveColor = (name, values, seen = new Set()) => {
    if (seen.has(name))
      throw new Error(`Circular UI token: ${name}`)
    seen.add(name)
    const value = values.get(name)
    const alias = value?.match(/^var\((--[\w-]+)\)$/)
    const color = alias ? resolveColor(alias[1], values, seen) : value
    if (!color || !/^#[\da-f]{3,8}$/i.test(color))
      throw new Error(`Expected a hex color for ${name}, received ${color}`)
    return color
  }
  const night = new Map([...light, ...dark])
  return {
    light: resolveColor('--ylf-c-brand', light),
    dark: resolveColor('--ylf-c-brand', night),
    background: resolveColor('--ylf-c-bg', night),
  }
}

function svg(viewBox, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${content}</svg>\n`
}

export function renderBrandAssets(name, palette) {
  if (!['brand-mark', 'design-mark'].includes(name))
    throw new Error(`Unsupported site mark: ${name}`)
  const icon = icons.icons[name]
  const width = icon.width || icons.width || 16
  const height = icon.height || icons.height || 16
  const viewBox = `0 0 ${width} ${height}`
  const fit = (size, padding, color) => {
    const scale = (size - padding * 2) / Math.max(width, height)
    return `<g color="${color}" transform="translate(${(size - width * scale) / 2} ${(size - height * scale) / 2}) scale(${scale})">${icon.body}</g>`
  }
  const app = icons.icons[name.replace('-mark', '-app-icon')]
  return {
    mark: svg(viewBox, icon.body),
    light: svg(viewBox, `<g color="${palette.light}">${icon.body}</g>`),
    dark: svg(viewBox, `<g color="${palette.dark}">${icon.body}</g>`),
    favicon: svg('0 0 32 32', `<style>:root{color:${palette.light}}@media(prefers-color-scheme:dark){:root{color:${palette.dark}}}</style>${fit(32, 2, 'inherit')}`),
    raster: svg('0 0 32 32', fit(32, 2, palette.light)),
    app: app
      ? svg(`0 0 ${app.width || icons.width || 16} ${app.height || icons.height || 16}`, app.body)
      : svg('0 0 512 512', `<path fill="${palette.background}" d="M0 0h512v512H0z"/>${fit(512, 64, palette.dark)}`),
  }
}

/** Generated assets are committed; librsvg is needed only when regenerating PNGs. */
export async function generateBrandAssets({ outDir, icon = 'brand-mark', title = 'YunLeFun', png = true }) {
  const css = await readFile(fileURLToPath(import.meta.resolve('@yunlefun/ui/css')), 'utf8')
  const assets = renderBrandAssets(icon, readBrandPalette(css))
  await mkdir(resolve(outDir, 'brand'), { recursive: true })
  for (const [path, content] of Object.entries({
    'brand/brand-mark.svg': assets.mark,
    'brand/brand-mark-dark.svg': assets.light,
    'brand/brand-mark-light.svg': assets.dark,
    'brand/app-icon.svg': assets.app,
    'favicon.svg': assets.favicon,
  }))
    await writeFile(resolve(outDir, path), content)
  if (png) {
    for (const [file, size, input] of [
      ['favicon-16', 16, assets.raster],
      ['favicon-32', 32, assets.raster],
      ['apple-touch-icon', 180, assets.app],
      ['icon-192', 192, assets.app],
      ['icon-512', 512, assets.app],
    ])
      execFileSync('rsvg-convert', ['--width', `${size}`, '--height', `${size}`, '--output', resolve(outDir, `${file}.png`)], { input })
  }
  await writeFile(resolve(outDir, 'site.webmanifest'), `${JSON.stringify({
    name: title,
    short_name: title,
    start_url: '/',
    display: 'standalone',
    icons: png
      ? [192, 512].map(size => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' }))
      : [{ src: '/brand/app-icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }, null, 2)}\n`)
}
