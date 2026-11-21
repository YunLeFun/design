import type { Preset } from 'unocss'
import type { Theme } from 'unocss/preset-uno'
import { access, readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'
import { renderArtifacts } from '../packages/ui/scripts/build.mjs'
import {
  ylfAccentTones,
  ylfCompatTokenNames,
  ylfComponentTokenNames,
  ylfProfiles,
  ylfStatuses,
  ylfTokenNames,
  ylfTokens,
} from '../packages/ui/tokens/index.mjs'
import { presetYunlefun } from '../packages/ui/unocss.mjs'

const uiRoot = resolve(import.meta.dirname, '../packages/ui')
const vueComponentsDir = resolve(import.meta.dirname, '../packages/vue/components')

function parseBalancedVarCalls(css: string) {
  const calls: Array<{ name: string, fallback?: string }> = []
  let index = 0
  while (index < css.length) {
    const start = css.indexOf('var(', index)
    if (start === -1)
      break
    let depth = 1
    let cursor = start + 4
    let commaIndex = -1
    while (cursor < css.length && depth > 0) {
      const ch = css[cursor]
      if (ch === '(') {
        depth++
      }
      else if (ch === ')') {
        depth--
      }
      else if (ch === ',' && depth === 1 && commaIndex === -1) {
        commaIndex = cursor
      }
      cursor++
    }
    if (depth === 0) {
      const inner = css.slice(start + 4, cursor - 1)
      const relComma = commaIndex === -1 ? -1 : commaIndex - (start + 4)
      const name = (relComma === -1 ? inner : inner.slice(0, relComma)).trim()
      const fallback = relComma === -1 ? undefined : inner.slice(relComma + 1).trim()
      if (name.startsWith('--ylf-'))
        calls.push({ name, fallback })
    }
    index = start + 4
  }
  return calls
}

function replaceBalancedVarRefs(input: string, resolver: (ref: string, fallback?: string) => string): string {
  let out = ''
  let index = 0
  while (index < input.length) {
    const start = input.indexOf('var(', index)
    if (start === -1) {
      out += input.slice(index)
      break
    }
    out += input.slice(index, start)
    let depth = 1
    let cursor = start + 4
    let comma = -1
    while (cursor < input.length && depth > 0) {
      const ch = input[cursor]
      if (ch === '(')
        depth++
      else if (ch === ')')
        depth--
      else if (ch === ',' && depth === 1 && comma === -1)
        comma = cursor
      cursor++
    }
    if (depth === 0) {
      const inner = input.slice(start + 4, cursor - 1)
      const relComma = comma === -1 ? -1 : comma - (start + 4)
      const ref = (relComma === -1 ? inner : inner.slice(0, relComma)).trim()
      const fallback = relComma === -1 ? undefined : inner.slice(relComma + 1).trim()
      out += resolver(ref, fallback)
      index = cursor
    }
    else {
      out += input.slice(start)
      break
    }
  }
  return out
}

function resolveCanonicalLightValue(map: Record<string, string>, token: string, seen = new Set<string>()): string | undefined {
  const raw = map[token]
  if (!raw || seen.has(token))
    return undefined
  seen.add(token)
  return replaceBalancedVarRefs(raw, (ref, fallback) => {
    const resolved = resolveCanonicalLightValue(map, ref, new Set(seen))
    return resolved ?? fallback ?? `var(${ref})`
  })
}

function normalizeCssValue(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/#ffffff\b/gi, '#fff')
    .replace(/#000000\b/g, '#000')
    .trim()
}

describe('design token single source of truth', () => {
  it('keeps every generated stylesheet synced with packages/ui/tokens/source.mjs', async () => {
    const { files } = await renderArtifacts()
    for (const [relPath, expected] of Object.entries(files)) {
      const actual = await readFile(resolve(uiRoot, relPath), 'utf8')
      expect(actual, `${relPath} drifted from token source`).toBe(expected)
    }
  })

  it('produces valid W3C DTCG tokens JSON and JS exports', async () => {
    const { tokensJson } = await renderArtifacts()
    const dtcg = JSON.parse(tokensJson)

    expect(dtcg.$schema).toBe('https://tr.designtokens.org/format/')
    expect(dtcg.palette.blue).toEqual({ $type: 'color', $value: '#2563eb' })
    expect(dtcg.zIndex.modal).toEqual({ $type: 'number', $value: '101' })
    expect(dtcg.radius['2xs']).toEqual({ $type: 'dimension', $value: '4px' })
    expect(dtcg.profiles.admin.light.placeholder.$value).toBe('#656e7b')

    expect(ylfAccentTones).toEqual(['blue', 'sun', 'cyan', 'coral', 'pink', 'green'])
    expect(ylfStatuses).toEqual(['success', 'warning', 'danger', 'info'])
    expect(ylfProfiles).toEqual(['consumer', 'admin', 'editor'])
    expect(ylfTokens.light['--ylf-c-brand']).toBe('var(--ylf-palette-blue)')
    expect(ylfTokens.compat.dark['--ylf-c-primary']).toBe('var(--ylf-c-brand)')
  })

  it('exports a clean UnoCSS preset synced with shared tokens', () => {
    const preset: Preset<Theme> = presetYunlefun()
    expect(preset.name).toBe('unocss-preset-yunlefun')
    expect(preset.theme.colors.primary).toBe('var(--ylf-c-brand)')
    expect((preset.theme.colors.danger as Record<string, string>).DEFAULT).toBe('var(--ylf-status-danger-text)')
    expect((preset.theme.colors.danger as Record<string, string>).base).toBe('var(--ylf-status-danger)')
    expect(preset.theme.fontFamily.mono).toBe('var(--ylf-font-mono)')
    expect(preset.theme.borderRadius['ylf-xs']).toBe('var(--ylf-radius-xs)')
    expect(preset.theme.zIndex['ylf-modal']).toBe('var(--ylf-z-modal)')
    expect(preset.rules.some(([name]) => name === 'bg-brand-gradient')).toBe(true)
    expect(preset.rules.some(([name]) => name === 'bg-aurora')).toBe(false)
  })

  it('keeps the legacy SCSS entrypoint compilable for downstream Sass consumers', () => {
    const result = compile(resolve(uiRoot, 'styles/index.scss'))
    expect(result.css).toContain('--ylf-c-brand')
    expect(result.css).toContain('--ylf-c-primary')
    expect(result.css).toContain('--ylf-z-modal')
  })
})

describe('vue SFC zero-Sass and token contract audit', () => {
  it('uses plain CSS without SCSS mixins or lang="scss" in all Ylf* components', async () => {
    const entries = await readdir(vueComponentsDir)
    const vueFiles = entries.filter(name => /^Ylf.*\.vue$/.test(name)).sort()
    expect(vueFiles.length).toBeGreaterThanOrEqual(30)

    const hasLegacyMixin = await access(resolve(vueComponentsDir, '_navigation.scss')).then(() => true, () => false)
    expect(hasLegacyMixin).toBe(false)

    for (const file of vueFiles) {
      const source = await readFile(resolve(vueComponentsDir, file), 'utf8')
      expect(source, `${file} must not declare lang="scss"`).not.toMatch(/<style[^>]*lang=["']scss["']/)
    }
  })

  it('references only registered --ylf-* tokens with accurate fallback values', async () => {
    const entries = await readdir(vueComponentsDir)
    const vueFiles = entries.filter(name => /^Ylf.*\.vue$/.test(name)).sort()
    const allowedVars = new Set([...ylfTokenNames, ...ylfCompatTokenNames, ...ylfComponentTokenNames])
    const canonicalLight: Record<string, string> = { ...ylfTokens.light, ...ylfTokens.compat.light }

    for (const file of vueFiles) {
      const source = await readFile(resolve(vueComponentsDir, file), 'utf8')
      const templateMatch = source.match(/<template\b[^>]*>([\s\S]*)<\/template>/)
      if (templateMatch) {
        for (const { name } of parseBalancedVarCalls(templateMatch[1]))
          expect(allowedVars.has(name), `${file} <template> references unregistered token ${name}`).toBe(true)
      }
      for (const styleMatch of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
        const calls = parseBalancedVarCalls(styleMatch[1])
        for (const { name, fallback } of calls) {
          expect(allowedVars.has(name), `${file} references unregistered token ${name}`).toBe(true)
          if (!fallback || fallback.includes('var(') || ['inherit', 'transparent', 'none'].includes(fallback))
            continue
          const canonical = resolveCanonicalLightValue(canonicalLight, name)
          if (canonical) {
            expect(normalizeCssValue(fallback), `${file}: ${name} fallback drifted`).toBe(normalizeCssValue(canonical))
          }
        }
      }
    }
  })
})
