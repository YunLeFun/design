import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { compile } from 'sass'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(import.meta.dirname, '../packages/ui/styles')
const adaptersDir = resolve(stylesDir, 'adapters')
const tokensCss = await readFile(resolve(stylesDir, 'tokens.css'), 'utf8')
const compatCss = await readFile(resolve(stylesDir, 'compat.css'), 'utf8')
const adminCss = await readFile(resolve(stylesDir, 'admin.css'), 'utf8')
const editorCss = await readFile(resolve(stylesDir, 'editor.css'), 'utf8')
const tdesignAdapterCss = await readFile(resolve(adaptersDir, 'tdesign.css'), 'utf8')
const compiledScss = compile(resolve(stylesDir, 'css-vars.scss')).css

interface ParsedRule {
  layer: string | null
  media?: string
  selector: string
  decls: Record<string, string>
  order: number
}

interface ParsedStylesheet {
  layerOrder: string[]
  rules: ParsedRule[]
}

function splitTopLevelCommas(input: string) {
  const parts: string[] = []
  let depth = 0
  let quote = ''
  let current = ''
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      current += ch
      if (ch === '\\' && i + 1 < input.length) {
        current += input[++i]
        continue
      }
      if (ch === quote)
        quote = ''
      continue
    }
    if (ch === '\'' || ch === '"') {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(')
      depth++
    else if (ch === ')')
      depth = Math.max(0, depth - 1)
    if (ch === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    }
    else {
      current += ch
    }
  }
  if (current.trim())
    parts.push(current.trim())
  return parts
}

function parseDecls(body: string): Record<string, string> {
  const decls: Record<string, string> = {}
  let depth = 0
  let quote = ''
  let start = 0
  for (let i = 0; i <= body.length; i++) {
    const ch = body[i]
    if (quote) {
      if (ch === '\\') {
        i++
        continue
      }
      if (ch === quote)
        quote = ''
      continue
    }
    if (ch === '\'' || ch === '"') {
      quote = ch
      continue
    }
    if (ch === '(')
      depth++
    else if (ch === ')')
      depth = Math.max(0, depth - 1)
    if ((ch === ';' || i === body.length) && depth === 0) {
      const statement = body.slice(start, i).trim()
      start = i + 1
      if (!statement)
        continue
      const colon = statement.indexOf(':')
      if (colon === -1)
        continue
      const prop = statement.slice(0, colon).trim()
      const val = statement.slice(colon + 1).replace(/\s+/g, ' ').trim()
      decls[prop] = val
    }
  }
  return decls
}

function parseStylesheet(source: string): ParsedStylesheet {
  const stripped = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const layerOrder: string[] = []
  const rules: ParsedRule[] = []
  let order = 0

  const registerLayers = (names: string[]) => {
    for (const name of names) {
      if (!layerOrder.includes(name))
        layerOrder.push(name)
    }
  }

  function walk(block: string, layer: string | null, media?: string) {
    let i = 0
    while (i < block.length) {
      while (i < block.length && /\s/.test(block[i]))
        i++
      if (i >= block.length)
        break

      let quote = ''
      let parenDepth = 0
      let headerEnd = i
      let delimiter = ''
      while (headerEnd < block.length) {
        const ch = block[headerEnd]
        if (quote) {
          if (ch === '\\') {
            headerEnd += 2
            continue
          }
          if (ch === quote)
            quote = ''
          headerEnd++
          continue
        }
        if (ch === '\'' || ch === '"') {
          quote = ch
          headerEnd++
          continue
        }
        if (ch === '(')
          parenDepth++
        else if (ch === ')')
          parenDepth = Math.max(0, parenDepth - 1)
        if (parenDepth === 0 && (ch === '{' || ch === ';')) {
          delimiter = ch
          break
        }
        headerEnd++
      }

      const header = block.slice(i, headerEnd).trim()
      if (delimiter === ';') {
        if (header.startsWith('@layer '))
          registerLayers(header.slice(7).split(',').map(name => name.trim()).filter(Boolean))
        i = headerEnd + 1
        continue
      }

      if (delimiter !== '{')
        break

      let braceDepth = 1
      let cursor = headerEnd + 1
      quote = ''
      while (cursor < block.length && braceDepth > 0) {
        const ch = block[cursor]
        if (quote) {
          if (ch === '\\') {
            cursor += 2
            continue
          }
          if (ch === quote)
            quote = ''
          cursor++
          continue
        }
        if (ch === '\'' || ch === '"') {
          quote = ch
        }
        else if (ch === '{') {
          braceDepth++
        }
        else if (ch === '}') {
          braceDepth--
        }
        cursor++
      }
      const body = block.slice(headerEnd + 1, cursor - 1)
      i = cursor

      if (header.startsWith('@layer ')) {
        const name = header.slice(7).trim()
        registerLayers([name])
        walk(body, name, media)
      }
      else if (header.startsWith('@media ')) {
        walk(body, layer, header.slice(7).trim())
      }
      else if (!header.startsWith('@')) {
        const decls = parseDecls(body)
        for (const selector of splitTopLevelCommas(header)) {
          rules.push({
            layer,
            media,
            selector,
            decls,
            order: order++,
          })
        }
      }
    }
  }

  walk(stripped, null)
  return { layerOrder, rules }
}

function declarations(source: string, selector: string) {
  const parsed = parseStylesheet(source)
  const merged: Record<string, string> = {}
  let matched = false
  for (const rule of parsed.rules) {
    if (rule.media || rule.selector !== selector)
      continue
    matched = true
    Object.assign(merged, rule.decls)
  }
  if (!matched)
    throw new Error(`Missing theme: ${selector}`)
  return merged
}

interface DomNode {
  root?: boolean
  classes?: string[]
  attrs?: Record<string, string>
}

function matchCompound(compound: string, node: DomNode): number | null {
  let cursor = 0
  let spec = 0
  while (cursor < compound.length) {
    if (compound.startsWith(':root', cursor)) {
      if (!node.root)
        return null
      spec += 1
      cursor += 5
      continue
    }
    if (compound.startsWith(':is(', cursor)) {
      let depth = 1
      let end = cursor + 4
      while (end < compound.length && depth > 0) {
        if (compound[end] === '(')
          depth++
        else if (compound[end] === ')')
          depth--
        end++
      }
      const branches = splitTopLevelCommas(compound.slice(cursor + 4, end - 1))
      let bestBranch = -1
      for (const branch of branches) {
        const branchSpec = matchCompound(branch.trim(), node)
        if (branchSpec !== null && branchSpec > bestBranch)
          bestBranch = branchSpec
      }
      if (bestBranch === -1)
        return null
      spec += bestBranch
      cursor = end
      continue
    }
    if (compound[cursor] === '.') {
      const rest = compound.slice(cursor + 1)
      const nameMatch = rest.match(/^[\w-]+/)
      if (!nameMatch || !node.classes?.includes(nameMatch[0]))
        return null
      spec += 1
      cursor += 1 + nameMatch[0].length
      continue
    }
    if (compound[cursor] === '[') {
      const close = compound.indexOf(']', cursor + 1)
      const expr = compound.slice(cursor + 1, close)
      const eq = expr.indexOf('=')
      if (eq === -1) {
        if (!node.attrs || !(expr.trim() in node.attrs))
          return null
      }
      else {
        const attr = expr.slice(0, eq).trim()
        const expected = expr.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
        if (node.attrs?.[attr] !== expected)
          return null
      }
      spec += 1
      cursor = close + 1
      continue
    }
    return null
  }
  return spec
}

function splitTopLevelWhitespace(input: string) {
  const parts: string[] = []
  let depth = 0
  let quote = ''
  let current = ''
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      current += ch
      if (ch === '\\' && i + 1 < input.length) {
        current += input[++i]
        continue
      }
      if (ch === quote)
        quote = ''
      continue
    }
    if (ch === '\'' || ch === '"') {
      quote = ch
      current += ch
      continue
    }
    if (ch === '(') {
      depth++
    }
    else if (ch === ')') {
      depth = Math.max(0, depth - 1)
    }
    if (/\s/.test(ch) && depth === 0) {
      if (current) {
        parts.push(current)
        current = ''
      }
    }
    else {
      current += ch
    }
  }
  if (current)
    parts.push(current)
  return parts
}

function matchComplex(selector: string, chain: DomNode[], index: number): number | null {
  const parts = splitTopLevelWhitespace(selector.trim())
  const lastSpec = matchCompound(parts[parts.length - 1], chain[index])
  if (lastSpec === null)
    return null
  let totalSpec = lastSpec
  let cursor = parts.length - 2
  let ancestorIdx = index - 1
  while (cursor >= 0) {
    let matched = false
    while (ancestorIdx >= 0) {
      const spec = matchCompound(parts[cursor], chain[ancestorIdx])
      if (spec !== null) {
        totalSpec += spec
        ancestorIdx--
        matched = true
        break
      }
      ancestorIdx--
    }
    if (!matched)
      return null
    cursor--
  }
  return totalSpec
}

function evaluateCssCascade(sources: string[], chain: DomNode[]): Record<string, string> {
  const parsedSheets = sources.map(parseStylesheet)
  const combinedLayers: string[] = []
  for (const sheet of parsedSheets) {
    for (const name of sheet.layerOrder) {
      if (!combinedLayers.includes(name))
        combinedLayers.push(name)
    }
  }

  let parentComputed: Record<string, string> = {}

  for (let nodeIdx = 0; nodeIdx < chain.length; nodeIdx++) {
    const winning: Array<{ layerRank: number, spec: number, order: number, decls: Record<string, string> }> = []
    let globalOrder = 0
    for (const sheet of parsedSheets) {
      for (const rule of sheet.rules) {
        const ruleOrder = globalOrder++
        if (rule.media)
          continue
        const spec = matchComplex(rule.selector, chain, nodeIdx)
        if (spec === null)
          continue
        const layerRank = rule.layer === null
          ? Number.MAX_SAFE_INTEGER
          : combinedLayers.indexOf(rule.layer)
        winning.push({
          layerRank,
          spec,
          order: ruleOrder,
          decls: rule.decls,
        })
      }
    }
    winning.sort((a, b) => (a.layerRank - b.layerRank) || (a.spec - b.spec) || (a.order - b.order))

    const ownRaw: Record<string, string> = {}
    for (const entry of winning)
      Object.assign(ownRaw, entry.decls)

    const resolveOnNode = (name: string, stack = new Set<string>()): string | undefined => {
      if (!(name in ownRaw))
        return parentComputed[name]
      if (stack.has(name))
        return undefined
      stack.add(name)
      const value = ownRaw[name]
      return replaceVarCalls(value, (ref, fallback) => {
        const resolved = resolveOnNode(ref, new Set(stack))
        return resolved ?? fallback ?? `var(${ref})`
      })
    }

    const nextComputed: Record<string, string> = { ...parentComputed }
    for (const prop of Object.keys(ownRaw)) {
      const resolved = resolveOnNode(prop)
      if (resolved !== undefined)
        nextComputed[prop] = resolved
    }
    parentComputed = nextComputed
  }

  return parentComputed
}

function replaceVarCalls(input: string, resolver: (ref: string, fallback?: string) => string): string {
  let out = ''
  let i = 0
  while (i < input.length) {
    const start = input.indexOf('var(', i)
    if (start === -1) {
      out += input.slice(i)
      break
    }
    out += input.slice(i, start)
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
      const relComma = comma === -1
        ? -1
        : comma - (start + 4)
      const name = (relComma === -1
        ? inner
        : inner.slice(0, relComma)).trim()
      const rawFallback = relComma === -1
        ? undefined
        : inner.slice(relComma + 1).trim()
      const fallback = rawFallback
        ? replaceVarCalls(rawFallback, resolver)
        : undefined
      out += resolver(name, fallback)
      i = cursor
    }
    else {
      out += input.slice(start)
      break
    }
  }
  return out
}

const light = declarations(compiledScss, '.ylf-theme-light')
const dark = {
  ...light,
  ...declarations(compiledScss, '.ylf-theme-dark'),
}
const adminLight = declarations(adminCss, `[data-ylf-admin-theme='light']`)
const adminDark = {
  ...adminLight,
  ...declarations(adminCss, `[data-ylf-admin-theme='dark']`),
}
const editorLight = declarations(editorCss, `[data-ylf-editor-theme='light']`)
const editorDark = {
  ...editorLight,
  ...declarations(editorCss, `[data-ylf-editor-theme='dark']`),
}

function color(tokens: Record<string, string>, name: string): string {
  const value = tokens[name]
  if (!value)
    throw new Error(`Missing token: ${name}`)
  const reference = value.match(/^var\((--[\w-]+)(?:,([^)]+))?\)$/)
  if (!reference)
    return value
  return tokens[reference[1]]
    ? color(tokens, reference[1])
    : (reference[2]?.trim() ?? value)
}

function luminance(hex: string) {
  if (!/^#[\da-f]{6}$/i.test(hex))
    throw new Error(`Expected a six-digit color, received ${hex}`)
  const channels = [1, 3, 5].map((offset) => {
    const channel = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(foreground: string, background: string) {
  const values = [
    luminance(foreground),
    luminance(background),
  ].sort((a, b) => b - a)
  return (values[0] + 0.05) / (values[1] + 0.05)
}

describe.each([
  { name: 'light', tokens: light },
  { name: 'dark', tokens: dark },
])('$name color tokens', ({ tokens }) => {
  it('keeps reading text readable across the surface hierarchy', () => {
    for (const background of [
      '--ylf-c-bg',
      '--ylf-c-bg-soft',
      '--ylf-c-bg-mute',
      '--ylf-c-surface',
      '--ylf-c-surface-raised',
      '--ylf-c-surface-inset',
    ]) {
      for (const foreground of ['--ylf-c-text', '--ylf-c-text-2', '--ylf-c-text-3'])
        expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it.each([
    'blue',
    'sun',
    'cyan',
    'coral',
    'pink',
    'green',
  ])('%s supports small text on solid, hover and soft fills', (tone) => {
    const prefix = `--ylf-accent-${tone}`
    for (const [foreground, background] of [
      [`${prefix}-on`, prefix],
      [`${prefix}-on`, `${prefix}-hover`],
      [`${prefix}-text`, `${prefix}-soft`],
      [`${prefix}-text`, '--ylf-c-surface'],
      [`${prefix}-text`, '--ylf-c-bg'],
      ['--ylf-c-text', `${prefix}-soft`],
      ['--ylf-c-text-2', `${prefix}-soft`],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps hero labels readable across normal and hover gradient stops', () => {
    for (const state of ['', 'hover-']) {
      for (const stop of ['start', 'middle', 'end'])
        expect(contrast(color(tokens, '--ylf-hero-foreground'), color(tokens, `--ylf-hero-${state}${stop}`))).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('keeps featured and primary labels readable', () => {
    for (const [foreground, background] of [
      ['--ylf-c-feature-text', '--ylf-c-feature-bg'],
      ['--ylf-c-text-on-accent', '--ylf-c-brand'],
      ['--ylf-c-text-on-accent', '--ylf-c-brand-hover'],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it.each([
    ['success', 'green'],
    ['warning', 'sun'],
    ['danger', 'coral'],
    ['info', 'cyan'],
  ])('%s shares the %s palette and readable foregrounds', (status, tone) => {
    const prefix = `--ylf-status-${status}`
    for (const suffix of ['', '-hover', '-on', '-soft', '-text'])
      expect(color(tokens, `${prefix}${suffix}`)).toBe(color(tokens, `--ylf-accent-${tone}${suffix}`))
    for (const [foreground, background] of [
      [`${prefix}-on`, prefix],
      [`${prefix}-on`, `${prefix}-hover`],
      [`${prefix}-text`, `${prefix}-soft`],
    ]) {
      expect(contrast(color(tokens, foreground), color(tokens, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe.each([
  { name: 'admin light', tokens: adminLight, base: light },
  { name: 'admin dark', tokens: adminDark, base: dark },
])('$name profile contrast', ({ tokens, base }) => {
  it('keeps foreground, muted and placeholder text readable on all admin surfaces', () => {
    const merged = {
      ...base,
      ...tokens,
    }
    for (const background of [
      '--ylf-admin-bg',
      '--ylf-admin-surface',
      '--ylf-admin-raised',
      '--ylf-admin-inset',
    ]) {
      for (const foreground of ['--ylf-admin-fg', '--ylf-admin-muted', '--ylf-admin-placeholder'])
        expect(contrast(color(merged, foreground), color(merged, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe.each([
  { name: 'editor light', tokens: editorLight, base: light },
  { name: 'editor dark', tokens: editorDark, base: dark },
])('$name profile contrast', ({ tokens, base }) => {
  it('keeps foreground, muted and accent readable on editor surfaces', () => {
    const merged = {
      ...base,
      ...tokens,
    }
    for (const background of [
      '--ylf-editor-bg',
      '--ylf-editor-panel',
      '--ylf-editor-chrome',
      '--ylf-editor-field',
      '--ylf-editor-workspace',
    ]) {
      for (const foreground of ['--ylf-editor-fg', '--ylf-editor-muted'])
        expect(contrast(color(merged, foreground), color(merged, background)), `${foreground} on ${background}`).toBeGreaterThanOrEqual(4.5)
    }
    expect(contrast(color(merged, '--ylf-editor-accent'), color(merged, '--ylf-editor-panel'))).toBeGreaterThanOrEqual(4.5)
  })
})

describe('dark theme variable re-declaration invariant', () => {
  it.each([
    { name: 'tokens.css', source: tokensCss },
    { name: 'compat.css', source: compatCss },
    { name: 'css-vars.scss', source: compiledScss },
  ])('$name re-declares every derived token whose dependency changes in dark mode', ({ source }) => {
    const lightDecls = declarations(source, '.ylf-theme-light')
    const darkDecls = declarations(source, '.ylf-theme-dark')
    const baseDarkKeys = new Set(Object.keys(declarations(tokensCss, '.ylf-theme-dark')))

    for (const [token, value] of Object.entries(lightDecls)) {
      if (token in darkDecls)
        continue
      const refs = [
        ...value.matchAll(/var\((--[\w-]+)/g),
      ].map(match => match[1])
      const staleDeps = refs.filter(ref => ref in darkDecls || baseDarkKeys.has(ref))
      expect(staleDeps, `${token} (${value}) depends on dark-overridden tokens but is missing in .ylf-theme-dark`).toEqual([])
    }
  })
})

describe('theme island cascade and layer precedence', () => {
  it('recomputes panel, bg-mute, and status contrast inside isolated admin light and dark islands', () => {
    const adminLightIsland = evaluateCssCascade(
      [tokensCss, adminCss],
      [
        {
          root: true,
          classes: ['dark'],
        },
        {
          attrs: { 'data-ylf-profile': 'admin', 'data-ylf-admin-theme': 'light' },
        },
      ],
    )
    expect(adminLightIsland['--ylf-c-panel']).toBe('#ffffff')
    expect(contrast(adminLightIsland['--ylf-status-danger-text'], adminLightIsland['--ylf-c-panel'])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(adminLightIsland['--ylf-status-warning-text'], adminLightIsland['--ylf-c-panel'])).toBeGreaterThanOrEqual(4.5)

    const adminDarkIsland = evaluateCssCascade(
      [tokensCss, adminCss],
      [
        { root: true },
        {
          attrs: { 'data-ylf-profile': 'admin', 'data-ylf-admin-theme': 'dark' },
        },
      ],
    )
    expect(adminDarkIsland['--ylf-c-panel']).toBe('#191c22')
    expect(adminDarkIsland['--ylf-c-bg-mute']).toBe('#252a33')
    expect(contrast(adminDarkIsland['--ylf-c-text'], adminDarkIsland['--ylf-c-panel'])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(adminDarkIsland['--ylf-status-danger-text'], adminDarkIsland['--ylf-c-panel'])).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps status and panel tokens readable inside isolated editor dark islands', () => {
    const editorDarkIsland = evaluateCssCascade(
      [tokensCss, editorCss],
      [
        { root: true },
        {
          attrs: { 'data-ylf-profile': 'editor', 'data-ylf-editor-theme': 'dark' },
        },
      ],
    )
    expect(editorDarkIsland['--ylf-c-panel']).toBe('#292a2d')
    for (const status of ['success', 'warning', 'danger', 'info'])
      expect(contrast(editorDarkIsland[`--ylf-status-${status}-text`], editorDarkIsland['--ylf-c-panel'])).toBeGreaterThanOrEqual(4.5)
  })

  it('preserves profile precedence regardless of stylesheet import order and supports nested .dark/.light', () => {
    const reversedOrder = evaluateCssCascade(
      [adminCss, tokensCss],
      [
        {
          root: true,
          classes: ['dark'],
          attrs: { 'data-ylf-profile': 'admin' },
        },
      ],
    )
    expect(reversedOrder['--ylf-c-bg']).toBe('#111318')
    expect(reversedOrder['--ylf-c-panel']).toBe('#191c22')

    const nestedDark = evaluateCssCascade(
      [adminCss, tokensCss],
      [
        {
          root: true,
          attrs: { 'data-ylf-profile': 'admin' },
        },
        {
          classes: ['dark'],
        },
      ],
    )
    expect(nestedDark['--ylf-c-bg']).toBe('#111318')
  })

  it('resolves TDesign adapter variables inside nested admin dark islands', () => {
    const tdesignDarkIsland = evaluateCssCascade(
      [tokensCss, adminCss, tdesignAdapterCss],
      [
        { root: true },
        {
          attrs: { 'data-ylf-profile': 'admin', 'data-ylf-admin-theme': 'dark' },
        },
      ],
    )
    expect(tdesignDarkIsland['--td-bg-color-page']).toBe('#111318')
    expect(tdesignDarkIsland['--td-bg-color-container']).toBe('#191c22')
    expect(tdesignDarkIsland['--td-text-color-primary']).toBe('#eef1f6')
  })
})
