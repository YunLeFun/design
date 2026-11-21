import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  buildBaseDarkTokens,
  buildBaseLightTokens,
  buildBrandAccentTokens,
  buildCompatDarkTokens,
  buildCompatLightTokens,
  buildThemeDerivedTokens,
  ylfAccents,
  ylfAtmosphere,
  ylfBrand,
  ylfCloud,
  ylfFocusAndControls,
  ylfGlass,
  ylfHero,
  ylfInteractionAndMotion,
  ylfLayout,
  ylfNeutrals,
  ylfPalette,
  ylfProfileTokens,
  ylfRadius,
  ylfReducedMotion,
  ylfShadow,
  ylfSpace,
  ylfStatusMap,
  ylfTypography,
  ylfZIndex,
} from '../tokens/source.mjs'

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PRINT_WIDTH = 120
const LAYER_ORDER = '@layer ylf.tokens, ylf.compat, ylf.profile, ylf.adapters;'

const LIGHT_BASE_SELECTORS = [':root', '.light', '.ylf-theme-light']
const DARK_BASE_SELECTORS = ['.dark', '.ylf-theme-dark']
const REDUCED_MOTION_SELECTORS = [
  ':root',
  '.light',
  '.dark',
  '.ylf-theme-light',
  '.ylf-theme-dark',
]
const ALL_THEME_BOUNDARY_SELECTORS = [
  ':root',
  '.light',
  '.dark',
  '.ylf-theme-light',
  '.ylf-theme-dark',
  `[data-ylf-profile='admin']`,
  `[data-ylf-profile='editor']`,
  `[data-ylf-admin-theme='light']`,
  `[data-ylf-admin-theme='dark']`,
  `[data-ylf-editor-theme='light']`,
  `[data-ylf-editor-theme='dark']`,
]

function splitTopLevelCommas(input) {
  const parts = []
  let depth = 0
  let quote = ''
  let escaped = false
  let current = ''
  for (const ch of input) {
    if (escaped) {
      current += ch
      escaped = false
      continue
    }
    if (quote) {
      current += ch
      if (ch === '\\')
        escaped = true
      else if (ch === quote)
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
      parts.push(current)
      current = ''
    }
    else {
      current += ch
    }
  }
  if (current)
    parts.push(current)
  return parts
}

function matchSingleOuterCall(value) {
  const fnPrefix = value.match(/^([a-z-]+)\(/i)
  if (!fnPrefix || !value.endsWith(')'))
    return undefined
  let depth = 0
  let quote = ''
  let escaped = false
  for (let i = fnPrefix[1].length; i < value.length; i++) {
    const ch = value[i]
    if (escaped) {
      escaped = false
      continue
    }
    if (quote) {
      if (ch === '\\')
        escaped = true
      else if (ch === quote)
        quote = ''
      continue
    }
    if (ch === '\'' || ch === '"') {
      quote = ch
      continue
    }
    if (ch === '(') {
      depth++
    }
    else if (ch === ')') {
      depth--
      if (depth === 0) {
        return i === value.length - 1
          ? [
              fnPrefix[1],
              value.slice(fnPrefix[1].length + 1, -1),
            ]
          : undefined
      }
    }
  }
  return undefined
}

function packCommaItems(items, continuationIndent = '    ') {
  const lines = []
  let current = ''
  for (let i = 0; i < items.length; i++) {
    const item = items[i].trim()
    const suffix = i < items.length - 1
      ? ','
      : ''
    const token = `${item}${suffix}`
    if (!current) {
      current = `${continuationIndent}${token}`
    }
    else {
      const candidate = `${current} ${token}`
      if (candidate.length <= PRINT_WIDTH) {
        current = candidate
      }
      else {
        lines.push(current)
        current = `${continuationIndent}${token}`
      }
    }
  }
  if (current)
    lines.push(current)
  return lines
}

function formatDecl(prop, value, indent = '  ') {
  const inline = `${indent}${prop}: ${value};`
  if (inline.length <= PRINT_WIDTH)
    return inline

  const fnCall = matchSingleOuterCall(value)
  if (fnCall) {
    const [fnName, inner] = fnCall
    const args = splitTopLevelCommas(inner)
    if (args.length > 1) {
      const wrappedArgs = args.map((arg, i) => `${indent}  ${arg.trim()}${i < args.length - 1
        ? ','
        : ''}`).join('\n')
      return `${indent}${prop}: ${fnName}(\n${wrappedArgs}\n${indent});`
    }
  }

  // Greedy line-packing for comma-separated property values matching Prettier (printWidth: 120).
  const parts = splitTopLevelCommas(value)
  if (parts.length > 1) {
    const lines = packCommaItems(parts, `${indent}  `)
    return `${indent}${prop}:\n${lines.join('\n')};`
  }

  return inline
}

function formatBlock(selectors, entries, baseIndent = '') {
  const selectorList = Array.isArray(selectors)
    ? selectors
    : [selectors]
  const selectorText = selectorList.map(sel => `${baseIndent}${sel}`).join(',\n')
  const declIndent = `${baseIndent}  `
  const lines = Object.entries(entries).map(([prop, value]) => formatDecl(prop, value, declIndent))
  return `${selectorText} {\n${lines.join('\n')}\n${baseIndent}}`
}

function wrapLayer(layerName, blocks) {
  return `@layer ${layerName} {\n${blocks.join('\n\n')}\n}`
}

function buildToneBlocks(baseIndent = '  ') {
  const blocks = [
    formatBlock(`[data-ylf-tone='blue']`, buildBrandAccentTokens(), baseIndent),
  ]
  for (const tone of Object.keys(ylfAccents)) {
    blocks.push(formatBlock(`[data-ylf-tone='${tone}']`, {
      '--ylf-accent': `var(--ylf-accent-${tone})`,
      '--ylf-accent-hover': `var(--ylf-accent-${tone}-hover)`,
      '--ylf-accent-soft': `var(--ylf-accent-${tone}-soft)`,
      '--ylf-accent-text': `var(--ylf-accent-${tone}-text)`,
      '--ylf-accent-on': `var(--ylf-accent-${tone}-on)`,
    }, baseIndent))
  }
  return blocks
}

function renderTokensCss() {
  const light = buildBaseLightTokens()
  const dark = buildBaseDarkTokens()
  const reduced = Object.fromEntries(Object.entries(ylfReducedMotion).map(([key, value]) => [`--ylf-${key}`, value]))

  return `${[
    `/* =============================================================================\n * YunLeFun Design · 晴空蓝为主，高饱和纯色点缀（自动生成，请勿手改）\n * 源文件：packages/ui/tokens/source.mjs\n * ============================================================================= */`,
    LAYER_ORDER,
    wrapLayer('ylf.tokens', [
      formatBlock(LIGHT_BASE_SELECTORS, light, '  '),
      formatBlock(DARK_BASE_SELECTORS, dark, '  '),
      `  @media (prefers-reduced-motion: reduce) {\n${formatBlock(REDUCED_MOTION_SELECTORS, reduced, '    ')}\n  }`,
      ...buildToneBlocks('  '),
    ]),
  ].join('\n\n')}\n`
}

function renderCompatCss() {
  return `${[
    `/* =============================================================================\n * YunLeFun Design · Deprecated Compatibility Aliases（自动生成，请勿手改）\n * 源文件：packages/ui/tokens/source.mjs\n * ============================================================================= */`,
    LAYER_ORDER,
    wrapLayer('ylf.compat', [
      formatBlock(LIGHT_BASE_SELECTORS, buildCompatLightTokens(), '  '),
      formatBlock(DARK_BASE_SELECTORS, buildCompatDarkTokens(), '  '),
    ]),
  ].join('\n\n')}\n`
}

function renderCssVarsScss() {
  const light = buildBaseLightTokens()
  const dark = buildBaseDarkTokens()
  const reduced = Object.fromEntries(Object.entries(ylfReducedMotion).map(([key, value]) => [`--ylf-${key}`, value]))

  return `${[
    `/* =============================================================================\n * YunLeFun Design —— 晴空蓝为主，高饱和纯色点缀（自动生成，请勿手改）\n * 源文件：packages/ui/tokens/source.mjs\n * ============================================================================= */`,
    LAYER_ORDER,
    wrapLayer('ylf.tokens', [
      formatBlock(LIGHT_BASE_SELECTORS, light, '  '),
      formatBlock(DARK_BASE_SELECTORS, dark, '  '),
      `  @media (prefers-reduced-motion: reduce) {\n${formatBlock(REDUCED_MOTION_SELECTORS, reduced, '    ')}\n  }`,
      ...buildToneBlocks('  '),
    ]),
    wrapLayer('ylf.compat', [
      formatBlock(LIGHT_BASE_SELECTORS, buildCompatLightTokens(), '  '),
      formatBlock(DARK_BASE_SELECTORS, buildCompatDarkTokens(), '  '),
    ]),
  ].join('\n\n')}\n`
}

function prefixMap(prefix, record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [`${prefix}${key}`, value]))
}

function renderAdminCss() {
  const admin = ylfProfileTokens.admin
  const semanticProfile = {
    '--ylf-c-bg': 'var(--ylf-admin-bg)',
    '--ylf-c-bg-soft': 'var(--ylf-admin-raised)',
    '--ylf-c-bg-mute': 'var(--ylf-admin-raised)',
    '--ylf-c-surface': 'var(--ylf-admin-surface)',
    '--ylf-c-surface-raised': 'var(--ylf-admin-raised)',
    '--ylf-c-surface-inset': 'var(--ylf-admin-inset)',
    '--ylf-c-panel': 'var(--ylf-admin-surface)',
    '--ylf-c-text': 'var(--ylf-admin-fg)',
    '--ylf-c-text-2': 'var(--ylf-admin-muted)',
    '--ylf-c-text-3': 'var(--ylf-admin-placeholder)',
    '--ylf-c-placeholder': 'var(--ylf-admin-placeholder)',
    '--ylf-c-border': 'var(--ylf-admin-border)',
    '--ylf-c-border-strong': 'var(--ylf-admin-border-strong)',
    '--ylf-font-body': 'var(--ylf-admin-font)',
    '--ylf-radius': 'var(--ylf-admin-radius)',
    '--ylf-radius-sm': 'var(--ylf-radius-xs, 6px)',
    '--ylf-radius-lg': 'var(--ylf-admin-panel-radius)',
    '--ylf-control-h-sm': 'var(--ylf-admin-control-sm)',
    '--ylf-control-h': 'var(--ylf-admin-control)',
    '--ylf-control-h-lg': 'var(--ylf-admin-control-lg)',
    '--ylf-control-radius': 'var(--ylf-admin-radius)',
    '--ylf-control-radius-sm': 'var(--ylf-admin-radius)',
    '--ylf-panel-radius': 'var(--ylf-admin-panel-radius)',
    '--ylf-control-font-size': 'var(--ylf-text-sm, 0.875rem)',
    '--ylf-control-font-size-sm': 'var(--ylf-text-xs, 0.75rem)',
  }

  return `${[
    `/* YunLeFun Design · Admin profile. Generated from packages/ui/tokens/source.mjs. */`,
    LAYER_ORDER,
    wrapLayer('ylf.profile', [
      formatBlock(':root', prefixMap('--ylf-admin-', admin.base), '  '),
      formatBlock([':root', '.light', '.ylf-theme-light'], prefixMap('--ylf-admin-', admin.light), '  '),
      formatBlock(['.dark', '.ylf-theme-dark'], prefixMap('--ylf-admin-', admin.dark), '  '),
      formatBlock(`[data-ylf-admin-theme='light']`, {
        ...prefixMap('--ylf-admin-', admin.light),
        ...buildThemeDerivedTokens('light'),
      }, '  '),
      formatBlock(`[data-ylf-admin-theme='dark']`, {
        ...prefixMap('--ylf-admin-', admin.dark),
        ...buildThemeDerivedTokens('dark'),
      }, '  '),
      `  @media (max-width: 767.9px), (pointer: coarse) {\n${formatBlock(':root', prefixMap('--ylf-admin-', admin.coarse), '    ')}\n  }`,
      formatBlock([
        `[data-ylf-profile='admin']`,
        `[data-ylf-profile='admin'] :is(.light, .dark, .ylf-theme-light, .ylf-theme-dark, [data-ylf-admin-theme])`,
      ], semanticProfile, '  '),
    ]),
  ].join('\n\n')}\n`
}

function renderEditorCss() {
  const editor = ylfProfileTokens.editor
  const semanticProfile = {
    '--ylf-c-bg': 'var(--ylf-editor-bg)',
    '--ylf-c-bg-soft': 'var(--ylf-editor-chrome)',
    '--ylf-c-bg-mute': 'var(--ylf-editor-chrome)',
    '--ylf-c-surface': 'var(--ylf-editor-field)',
    '--ylf-c-surface-raised': 'var(--ylf-editor-panel)',
    '--ylf-c-surface-inset': 'var(--ylf-editor-chrome)',
    '--ylf-c-panel': 'var(--ylf-editor-panel)',
    '--ylf-c-text': 'var(--ylf-editor-fg)',
    '--ylf-c-text-2': 'var(--ylf-editor-muted)',
    '--ylf-c-text-3': 'var(--ylf-editor-muted)',
    '--ylf-c-placeholder': 'var(--ylf-editor-muted)',
    '--ylf-c-border': 'var(--ylf-editor-border)',
    '--ylf-c-border-strong': 'var(--ylf-editor-border)',
    '--ylf-c-brand-soft': 'var(--ylf-editor-selection)',
    '--ylf-shadow-panel': 'var(--ylf-editor-shadow)',
    '--ylf-font-body': 'var(--ylf-editor-font)',
    '--ylf-radius': 'var(--ylf-editor-radius)',
    '--ylf-radius-sm': 'var(--ylf-editor-radius)',
    '--ylf-radius-lg': 'var(--ylf-editor-panel-radius)',
    '--ylf-control-h-sm': 'var(--ylf-editor-control-sm)',
    '--ylf-control-h': 'var(--ylf-editor-control)',
    '--ylf-control-h-lg': 'var(--ylf-editor-row)',
    '--ylf-control-radius': 'var(--ylf-editor-radius)',
    '--ylf-control-radius-sm': 'var(--ylf-editor-radius)',
    '--ylf-panel-radius': 'var(--ylf-editor-panel-radius)',
    '--ylf-control-font-size': 'var(--ylf-editor-text)',
    '--ylf-control-font-size-sm': 'var(--ylf-editor-caption)',
  }

  return `${[
    `/* YunLeFun Design · Editor profile. Generated from packages/ui/tokens/source.mjs. */`,
    LAYER_ORDER,
    wrapLayer('ylf.profile', [
      formatBlock(':root', prefixMap('--ylf-editor-', editor.base), '  '),
      formatBlock([':root', '.light', '.ylf-theme-light'], prefixMap('--ylf-editor-', editor.light), '  '),
      formatBlock(['.dark', '.ylf-theme-dark'], prefixMap('--ylf-editor-', editor.dark), '  '),
      formatBlock(`[data-ylf-editor-theme='light']`, {
        ...prefixMap('--ylf-editor-', editor.light),
        ...buildThemeDerivedTokens('light'),
      }, '  '),
      formatBlock(`[data-ylf-editor-theme='dark']`, {
        ...prefixMap('--ylf-editor-', editor.dark),
        ...buildThemeDerivedTokens('dark'),
      }, '  '),
      `  @media (pointer: coarse) {\n${formatBlock(':root', prefixMap('--ylf-editor-', editor.coarse), '    ')}\n  }`,
      formatBlock([
        `[data-ylf-profile='editor']`,
        `[data-ylf-profile='editor'] :is(.light, .dark, .ylf-theme-light, .ylf-theme-dark, [data-ylf-editor-theme])`,
      ], semanticProfile, '  '),
    ]),
  ].join('\n\n')}\n`
}

function renderShadcnAdapterCss() {
  return `${[
    `/* YunLeFun Design · shadcn / shadcn-vue variable adapter. Generated from packages/ui/tokens/source.mjs. */`,
    LAYER_ORDER,
    wrapLayer('ylf.adapters', [
      formatBlock(ALL_THEME_BOUNDARY_SELECTORS, {
        '--background': 'var(--ylf-c-bg)',
        '--foreground': 'var(--ylf-c-text)',
        '--card': 'var(--ylf-c-surface)',
        '--card-foreground': 'var(--ylf-c-text)',
        '--popover': 'var(--ylf-c-panel)',
        '--popover-foreground': 'var(--ylf-c-text)',
        '--primary': 'var(--ylf-c-brand)',
        '--primary-foreground': 'var(--ylf-c-text-on-accent)',
        '--secondary': 'var(--ylf-c-bg-soft)',
        '--secondary-foreground': 'var(--ylf-c-text)',
        '--muted': 'var(--ylf-c-bg-soft)',
        '--muted-foreground': 'var(--ylf-c-text-2)',
        '--accent': 'var(--ylf-c-bg-mute)',
        '--accent-foreground': 'var(--ylf-c-text)',
        '--destructive': 'var(--ylf-status-danger-text)',
        '--destructive-foreground': 'var(--ylf-c-bg)',
        '--border': 'var(--ylf-c-border)',
        '--input': 'var(--ylf-c-border-strong)',
        '--ring': 'var(--ylf-c-brand)',
        '--radius': 'var(--ylf-radius)',
      }, '  '),
    ]),
  ].join('\n\n')}\n`
}

function renderNuxtUiAdapterCss() {
  return `${[
    `/* YunLeFun Design · Nuxt UI variable adapter. Generated from packages/ui/tokens/source.mjs. */`,
    LAYER_ORDER,
    wrapLayer('ylf.adapters', [
      formatBlock(ALL_THEME_BOUNDARY_SELECTORS, {
        '--ui-primary': 'var(--ylf-c-brand)',
        '--ui-success': 'var(--ylf-status-success-text)',
        '--ui-warning': 'var(--ylf-status-warning-text)',
        '--ui-error': 'var(--ylf-status-danger-text)',
        '--ui-info': 'var(--ylf-status-info-text)',
        '--ui-bg': 'var(--ylf-c-bg)',
        '--ui-bg-muted': 'var(--ylf-c-bg-soft)',
        '--ui-bg-elevated': 'var(--ylf-c-surface)',
        '--ui-bg-accented': 'var(--ylf-c-bg-mute)',
        '--ui-text': 'var(--ylf-c-text)',
        '--ui-text-muted': 'var(--ylf-c-text-2)',
        '--ui-text-dimmed': 'var(--ylf-c-text-3)',
        '--ui-text-toned': 'var(--ylf-c-text-2)',
        '--ui-text-highlighted': 'var(--ylf-c-text)',
        '--ui-border': 'var(--ylf-c-border-strong)',
        '--ui-border-muted': 'var(--ylf-c-border)',
        '--ui-border-accented': 'var(--ylf-c-border-strong)',
        '--ui-radius': 'var(--ylf-radius)',
      }, '  '),
    ]),
  ].join('\n\n')}\n`
}

function renderTDesignAdapterCss() {
  const statusEntries = {}
  for (const [td, ylf] of [
    ['success', 'success'],
    ['warning', 'warning'],
    ['error', 'danger'],
  ]) {
    statusEntries[`--td-${td}-color`] = `var(--ylf-status-${ylf}-text)`
    statusEntries[`--td-${td}-color-hover`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 88%, var(--ylf-c-text))`
    statusEntries[`--td-${td}-color-active`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 76%, var(--ylf-c-text))`
    statusEntries[`--td-${td}-color-focus`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 20%, var(--ylf-c-surface))`
    statusEntries[`--td-${td}-color-disabled`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 35%, var(--ylf-c-surface))`
    statusEntries[`--td-${td}-color-light`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 9%, var(--ylf-admin-surface, var(--ylf-c-surface)))`
    statusEntries[`--td-${td}-color-light-hover`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 12%, var(--ylf-status-${ylf}-soft))`
    statusEntries[`--td-${td}-color-1`] = `var(--ylf-status-${ylf}-soft)`
    statusEntries[`--td-${td}-color-3`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 30%, var(--ylf-c-surface))`
    statusEntries[`--td-${td}-color-4`] = `color-mix(in srgb, var(--ylf-status-${ylf}-text) 45%, var(--ylf-c-surface))`
  }

  const shared = {
    '--td-brand-color': 'var(--ylf-c-brand)',
    '--td-brand-color-hover': 'var(--ylf-c-brand-hover)',
    '--td-brand-color-active': 'var(--ylf-c-brand-active)',
    '--td-brand-color-focus': 'color-mix(in srgb, var(--ylf-c-brand) 20%, var(--ylf-c-surface))',
    '--td-brand-color-disabled': 'color-mix(in srgb, var(--ylf-c-brand) 35%, var(--ylf-c-surface))',
    '--td-brand-color-light': 'color-mix(in srgb, var(--ylf-c-brand) 9%, var(--ylf-admin-surface, var(--ylf-c-surface)))',
    '--td-brand-color-light-hover': 'color-mix(in srgb, var(--ylf-c-brand) 15%, var(--ylf-admin-surface, var(--ylf-c-surface)))',
    '--td-text-color-brand': 'var(--ylf-c-brand)',
    '--td-text-color-link': 'var(--ylf-c-brand)',
    ...statusEntries,
    '--td-bg-color-page': 'var(--ylf-admin-bg, var(--ylf-c-bg))',
    '--td-bg-color-container': 'var(--ylf-admin-surface, var(--ylf-c-surface))',
    '--td-bg-color-container-hover': 'var(--ylf-admin-raised, var(--ylf-c-surface-raised))',
    '--td-bg-color-container-active': 'var(--ylf-admin-border, var(--ylf-c-border))',
    '--td-bg-color-container-select': 'var(--ylf-admin-surface, var(--ylf-c-surface))',
    '--td-bg-color-secondarycontainer': 'var(--ylf-admin-inset, var(--ylf-c-surface-inset))',
    '--td-bg-color-secondarycontainer-hover': 'var(--ylf-admin-raised, var(--ylf-c-surface-raised))',
    '--td-bg-color-secondarycontainer-active': 'var(--ylf-admin-border-strong, var(--ylf-c-border-strong))',
    '--td-bg-color-component': 'var(--ylf-admin-raised, var(--ylf-c-bg-soft))',
    '--td-bg-color-component-hover': 'var(--ylf-admin-border-strong, var(--ylf-c-border-strong))',
    '--td-bg-color-component-active': 'var(--ylf-c-text-3)',
    '--td-bg-color-secondarycomponent': 'var(--ylf-admin-border, var(--ylf-c-border))',
    '--td-bg-color-secondarycomponent-hover': 'var(--ylf-admin-border-strong, var(--ylf-c-border-strong))',
    '--td-bg-color-secondarycomponent-active': 'var(--ylf-c-text-3)',
    '--td-bg-color-component-disabled': 'var(--ylf-admin-inset, var(--ylf-c-surface-inset))',
    '--td-bg-color-specialcomponent': 'var(--ylf-admin-surface, var(--ylf-c-surface))',
    '--td-text-color-primary': 'var(--ylf-admin-fg, var(--ylf-c-text))',
    '--td-text-color-secondary': 'var(--ylf-admin-muted, var(--ylf-c-text-2))',
    '--td-text-color-placeholder': 'var(--ylf-admin-placeholder, var(--ylf-c-placeholder))',
    '--td-text-color-disabled': 'color-mix(in srgb, var(--ylf-c-text-3) 55%, var(--ylf-c-surface))',
    '--td-text-color-anti': 'var(--ylf-c-text-on-accent)',
    '--td-text-color-watermark': 'color-mix(in srgb, var(--ylf-c-text) 10%, transparent)',
    '--td-border-level-1-color': 'var(--ylf-admin-border, var(--ylf-c-border))',
    '--td-component-stroke': 'var(--ylf-admin-border, var(--ylf-c-border))',
    '--td-border-level-2-color': 'var(--ylf-admin-border-strong, var(--ylf-c-border-strong))',
    '--td-component-border': 'var(--ylf-admin-border-strong, var(--ylf-c-border-strong))',
    '--td-mask-active': 'var(--ylf-c-overlay)',
    '--td-mask-disabled': 'color-mix(in srgb, var(--ylf-c-surface) 60%, transparent)',
    '--td-mask-background': 'var(--ylf-c-panel)',
    '--td-mask-gradient': 'transparent',
    '--td-shadow-1': 'var(--ylf-shadow-sm)',
    '--td-shadow-2': 'var(--ylf-shadow)',
    '--td-shadow-3': 'var(--ylf-shadow-lg)',
    '--td-shadow-inset-top': 'inset 0 0.5px 0 var(--ylf-c-border)',
    '--td-shadow-inset-right': 'inset 0.5px 0 0 var(--ylf-c-border)',
    '--td-shadow-inset-bottom': 'inset 0 -0.5px 0 var(--ylf-c-border)',
    '--td-shadow-inset-left': 'inset -0.5px 0 0 var(--ylf-c-border)',
    '--td-table-shadow-color': 'var(--ylf-c-edge)',
    '--td-scrollbar-color': 'color-mix(in srgb, var(--ylf-c-text-3) 25%, transparent)',
    '--td-scrollbar-hover-color': 'color-mix(in srgb, var(--ylf-c-text-3) 45%, transparent)',
    '--td-scroll-track-color': 'var(--ylf-c-surface)',
    '--td-comp-size-xs': 'var(--ylf-admin-control-sm, var(--ylf-control-h-sm))',
    '--td-comp-size-s': 'var(--ylf-admin-control-sm, var(--ylf-control-h-sm))',
    '--td-comp-size-m': 'var(--ylf-admin-control, var(--ylf-control-h))',
    '--td-comp-size-l': 'var(--ylf-admin-control-lg, var(--ylf-control-h-lg))',
    '--td-radius-small': 'var(--ylf-radius-2xs, 4px)',
    '--td-radius-default': 'var(--ylf-admin-radius, var(--ylf-radius-xs))',
    '--td-radius-medium': 'var(--ylf-radius-xs, 6px)',
    '--td-radius-large': 'var(--ylf-radius-sm)',
    '--td-radius-extraLarge': 'var(--ylf-radius)',
    '--td-radius-round': 'var(--ylf-radius-pill)',
    '--td-font-family': 'var(--ylf-admin-font, var(--ylf-font-ui))',
    '--td-font-family-medium': 'var(--ylf-admin-font, var(--ylf-font-ui))',
    '--td-font-family-code': 'var(--ylf-font-mono)',
  }

  return `${[
    `/* YunLeFun Design · TDesign variable adapter. Generated from packages/ui/tokens/source.mjs. */`,
    LAYER_ORDER,
    wrapLayer('ylf.adapters', [
      formatBlock([
        ...ALL_THEME_BOUNDARY_SELECTORS,
        `[theme-mode='light']`,
        `[theme-mode='dark']`,
      ], shared, '  '),
      formatBlock([
        ':root',
        '.light',
        '.ylf-theme-light',
        `[data-ylf-admin-theme='light']`,
        `[data-ylf-editor-theme='light']`,
        `[theme-mode='light']`,
      ], { 'color-scheme': 'light' }, '  '),
      formatBlock([
        '.dark',
        '.ylf-theme-dark',
        `[data-ylf-admin-theme='dark']`,
        `[data-ylf-editor-theme='dark']`,
        `[theme-mode='dark']`,
      ], { 'color-scheme': 'dark' }, '  '),
      formatBlock('.t-tooltip--default', {
        '--td-gray-color-13': 'var(--ylf-c-text)',
        '--td-gray-color-9': 'var(--ylf-c-text-2)',
        '--td-text-color-anti': 'var(--ylf-c-surface)',
      }, '  '),
    ]),
  ].join('\n\n')}\n`
}

function stripScssLineComments(source) {
  let out = ''
  let i = 0
  let quote = ''
  let inBlockComment = false

  while (i < source.length) {
    const ch = source[i]
    const next = source[i + 1]

    if (inBlockComment) {
      out += ch
      if (ch === '*' && next === '/') {
        out += '/'
        inBlockComment = false
        i += 2
        continue
      }
      i++
      continue
    }

    if (quote) {
      out += ch
      if (ch === '\\' && i + 1 < source.length) {
        out += source[i + 1]
        i += 2
        continue
      }
      if (ch === quote)
        quote = ''
      i++
      continue
    }

    if (ch === '\'' || ch === '"') {
      quote = ch
      out += ch
      i++
      continue
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true
      out += '/*'
      i += 2
      continue
    }

    if (source.slice(i, i + 4).toLowerCase() === 'url(') {
      let end = i + 4
      let urlQuote = ''
      while (end < source.length) {
        const uch = source[end]
        if (urlQuote) {
          if (uch === '\\' && end + 1 < source.length) {
            end += 2
            continue
          }
          if (uch === urlQuote)
            urlQuote = ''
        }
        else if (uch === '\'' || uch === '"') {
          urlQuote = uch
        }
        else if (uch === ')') {
          end++
          break
        }
        end++
      }
      out += source.slice(i, end)
      i = end
      continue
    }

    if (ch === '/' && next === '/') {
      out = out.replace(/[ \t]+$/, '')
      while (i < source.length && source[i] !== '\n')
        i++
      if (i < source.length && out.length > 0 && !out.endsWith('\n'))
        out += '\n'
      i++
      continue
    }

    out += ch
    i++
  }

  return out.replace(/^\n+/, '')
}

function minifyCss(css) {
  const literals = []
  const stashLiteral = (value) => {
    const token = `__YLF_LIT_${literals.length}__`
    literals.push(value)
    return token
  }

  let sanitized = ''
  let i = 0
  while (i < css.length) {
    const ch = css[i]
    const next = css[i + 1]

    if (ch === '/' && next === '*') {
      const end = css.indexOf('*/', i + 2)
      i = end === -1
        ? css.length
        : end + 2
      continue
    }

    if (ch === '\'' || ch === '"') {
      const quote = ch
      let end = i + 1
      while (end < css.length) {
        if (css[end] === '\\' && end + 1 < css.length) {
          end += 2
          continue
        }
        if (css[end] === quote) {
          end++
          break
        }
        end++
      }
      sanitized += stashLiteral(css.slice(i, end))
      i = end
      continue
    }

    if (css.slice(i, i + 4).toLowerCase() === 'url(') {
      let end = i + 4
      let urlQuote = ''
      while (end < css.length) {
        const uch = css[end]
        if (urlQuote) {
          if (uch === '\\' && end + 1 < css.length) {
            end += 2
            continue
          }
          if (uch === urlQuote)
            urlQuote = ''
        }
        else if (uch === '\'' || uch === '"') {
          urlQuote = uch
        }
        else if (uch === ')') {
          end++
          break
        }
        end++
      }
      sanitized += stashLiteral(css.slice(i, end))
      i = end
      continue
    }

    sanitized += ch
    i++
  }

  const minified = sanitized
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .replace(/:\s+/g, ':')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/;\}/g, '}')
    .trim()
    .replace(/@media\(/g, '@media (')
    .replace(/\)and\(/g, ') and (')

  return minified.replace(/__YLF_LIT_(\d+)__/g, (_, index) => literals[Number(index)])
}

function toDtcgTokens() {
  const wrap = ($type, $value, $description) => ({
    $type,
    $value,
    ...($description
      ? { $description }
      : {}),
  })
  const mapGroup = (obj, $type) => Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      wrap($type, value),
    ]),
  )

  const accent = {
    blue: {
      light: {
        base: wrap('color', '{brand.light.brand}'),
        hover: wrap('color', '{brand.light.brand-hover}'),
        soft: wrap('color', '{brand.light.brand-soft}'),
        text: wrap('color', '{brand.light.brand}'),
        on: wrap('color', '{neutral.light.text-on-accent}'),
      },
      dark: {
        base: wrap('color', '{brand.dark.brand}'),
        hover: wrap('color', '{brand.dark.brand-hover}'),
        soft: wrap('color', '{brand.dark.brand-soft}'),
        text: wrap('color', '{brand.dark.brand}'),
        on: wrap('color', '{neutral.dark.text-on-accent}'),
      },
    },
  }
  for (const [tone, def] of Object.entries(ylfAccents)) {
    accent[tone] = {
      light: mapGroup(def.light, 'color'),
      dark: mapGroup(def.dark, 'color'),
    }
  }

  const status = {}
  for (const [name, tone] of Object.entries(ylfStatusMap)) {
    status[name] = {
      base: wrap('color', `{accent.${tone}.light.base}`),
      hover: wrap('color', `{accent.${tone}.light.hover}`),
      on: wrap('color', `{accent.${tone}.light.on}`),
      soft: wrap('color', `{accent.${tone}.light.soft}`),
      text: wrap('color', `{accent.${tone}.light.text}`),
    }
  }

  return {
    $schema: 'https://tr.designtokens.org/format/',
    palette: mapGroup(ylfPalette, 'color'),
    brand: {
      light: mapGroup(ylfBrand.light, 'color'),
      dark: mapGroup(ylfBrand.dark, 'color'),
    },
    hero: {
      'start': wrap('color', ylfHero.start),
      'middle': wrap('color', ylfHero.middle),
      'end': wrap('color', ylfHero.end),
      'hover-start': wrap('color', ylfHero['hover-start']),
      'hover-middle': wrap('color', ylfHero['hover-middle']),
      'hover-end': wrap('color', ylfHero['hover-end']),
      'foreground': wrap('color', ylfHero.foreground),
      'border': wrap('color', ylfHero.border),
      'shadow': wrap('shadow', ylfHero.shadow),
      'shadow-hover': wrap('shadow', ylfHero['shadow-hover']),
    },
    accent,
    status,
    neutral: {
      light: mapGroup(ylfNeutrals.light, 'color'),
      dark: mapGroup(ylfNeutrals.dark, 'color'),
    },
    glass: {
      light: {
        'glass-bg': wrap('color', ylfGlass.light['glass-bg']),
        'glass-border': wrap('color', ylfGlass.light['glass-border']),
        'glass-blur': wrap('other', ylfGlass.light['glass-blur']),
        'overlay-blur': wrap('other', ylfGlass.light['overlay-blur']),
      },
      dark: mapGroup(ylfGlass.dark, 'color'),
    },
    radius: mapGroup(ylfRadius, 'dimension'),
    shadow: {
      light: mapGroup(ylfShadow.light, 'shadow'),
      dark: mapGroup(ylfShadow.dark, 'shadow'),
    },
    typography: {
      fontFamily: mapGroup(ylfTypography.fontFamily, 'fontFamily'),
      fontSize: mapGroup(ylfTypography.fontSize, 'dimension'),
      lineHeight: mapGroup(ylfTypography.lineHeight, 'number'),
    },
    space: mapGroup(ylfSpace, 'dimension'),
    layout: mapGroup(ylfLayout, 'dimension'),
    zIndex: mapGroup(ylfZIndex, 'number'),
    focusAndControls: {
      'ring-width': wrap('dimension', ylfFocusAndControls['ring-width']),
      'ring-offset': wrap('dimension', ylfFocusAndControls['ring-offset']),
      'ring-color': wrap('color', ylfFocusAndControls['ring-color']),
      'disabled-opacity': wrap('number', Number(ylfFocusAndControls['disabled-opacity'])),
      'control-h-sm': wrap('dimension', ylfFocusAndControls['control-h-sm']),
      'control-h': wrap('dimension', ylfFocusAndControls['control-h']),
      'control-h-lg': wrap('dimension', ylfFocusAndControls['control-h-lg']),
      'control-h-xl': wrap('dimension', ylfFocusAndControls['control-h-xl']),
      'control-radius-sm': wrap('dimension', ylfFocusAndControls['control-radius-sm']),
      'control-radius': wrap('dimension', ylfFocusAndControls['control-radius']),
      'panel-radius': wrap('dimension', ylfFocusAndControls['panel-radius']),
      'control-font-size-sm': wrap('dimension', ylfFocusAndControls['control-font-size-sm']),
      'control-font-size': wrap('dimension', ylfFocusAndControls['control-font-size']),
    },
    motion: {
      'touch-target': wrap('dimension', ylfInteractionAndMotion['touch-target']),
      'viewport-gutter': wrap('dimension', ylfInteractionAndMotion['viewport-gutter']),
      'duration-press': wrap('duration', ylfInteractionAndMotion['duration-press']),
      'duration-enter': wrap('duration', ylfInteractionAndMotion['duration-enter']),
      'duration-exit': wrap('duration', ylfInteractionAndMotion['duration-exit']),
      'duration-fast': wrap('duration', ylfInteractionAndMotion['duration-fast']),
      'duration-normal': wrap('duration', ylfInteractionAndMotion['duration-normal']),
      'duration-slow': wrap('duration', ylfInteractionAndMotion['duration-slow']),
      'press-scale': wrap('number', Number(ylfInteractionAndMotion['press-scale'])),
      'hover-lift': wrap('dimension', ylfInteractionAndMotion['hover-lift']),
      'ease-standard': wrap('cubicBezier', ylfInteractionAndMotion['ease-standard']),
      'ease-bounce': wrap('cubicBezier', ylfInteractionAndMotion['ease-bounce']),
      'ease-spring': wrap('other', ylfInteractionAndMotion['ease-spring']),
    },
    atmosphere: {
      light: {
        'grid-size': wrap('dimension', ylfAtmosphere.light['grid-size']),
        'c-grid': wrap('color', ylfAtmosphere.light['c-grid']),
        'c-sky': wrap('color', ylfAtmosphere.light['c-sky']),
        'c-cloud': wrap('color', ylfAtmosphere.light['c-cloud']),
      },
      dark: mapGroup(ylfAtmosphere.dark, 'color'),
    },
    cloud: {
      light: mapGroup(ylfCloud.light, 'color'),
      dark: mapGroup(ylfCloud.dark, 'color'),
    },
    profiles: {
      admin: {
        base: {
          'font': wrap('fontFamily', ylfProfileTokens.admin.base.font),
          'control-sm': wrap('dimension', ylfProfileTokens.admin.base['control-sm']),
          'control': wrap('dimension', ylfProfileTokens.admin.base.control),
          'control-lg': wrap('dimension', ylfProfileTokens.admin.base['control-lg']),
          'radius': wrap('dimension', ylfProfileTokens.admin.base.radius),
          'panel-radius': wrap('dimension', ylfProfileTokens.admin.base['panel-radius']),
          'icon-gap': wrap('dimension', ylfProfileTokens.admin.base['icon-gap']),
        },
        coarse: mapGroup(ylfProfileTokens.admin.coarse, 'dimension'),
        light: mapGroup(ylfProfileTokens.admin.light, 'color'),
        dark: mapGroup(ylfProfileTokens.admin.dark, 'color'),
      },
      editor: {
        base: {
          'font': wrap('fontFamily', ylfProfileTokens.editor.base.font),
          'text': wrap('dimension', ylfProfileTokens.editor.base.text),
          'caption': wrap('dimension', ylfProfileTokens.editor.base.caption),
          'control-sm': wrap('dimension', ylfProfileTokens.editor.base['control-sm']),
          'control': wrap('dimension', ylfProfileTokens.editor.base.control),
          'row': wrap('dimension', ylfProfileTokens.editor.base.row),
          'header': wrap('dimension', ylfProfileTokens.editor.base.header),
          'radius': wrap('dimension', ylfProfileTokens.editor.base.radius),
          'panel-radius': wrap('dimension', ylfProfileTokens.editor.base['panel-radius']),
          'panel-width': wrap('dimension', ylfProfileTokens.editor.base['panel-width']),
        },
        coarse: mapGroup(ylfProfileTokens.editor.coarse, 'dimension'),
        light: {
          bg: wrap('color', ylfProfileTokens.editor.light.bg),
          chrome: wrap('color', ylfProfileTokens.editor.light.chrome),
          panel: wrap('color', ylfProfileTokens.editor.light.panel),
          field: wrap('color', ylfProfileTokens.editor.light.field),
          workspace: wrap('color', ylfProfileTokens.editor.light.workspace),
          fg: wrap('color', ylfProfileTokens.editor.light.fg),
          muted: wrap('color', ylfProfileTokens.editor.light.muted),
          border: wrap('color', ylfProfileTokens.editor.light.border),
          accent: wrap('color', ylfProfileTokens.editor.light.accent),
          selection: wrap('color', ylfProfileTokens.editor.light.selection),
          shadow: wrap('shadow', ylfProfileTokens.editor.light.shadow),
        },
        dark: {
          bg: wrap('color', ylfProfileTokens.editor.dark.bg),
          chrome: wrap('color', ylfProfileTokens.editor.dark.chrome),
          panel: wrap('color', ylfProfileTokens.editor.dark.panel),
          field: wrap('color', ylfProfileTokens.editor.dark.field),
          workspace: wrap('color', ylfProfileTokens.editor.dark.workspace),
          fg: wrap('color', ylfProfileTokens.editor.dark.fg),
          muted: wrap('color', ylfProfileTokens.editor.dark.muted),
          border: wrap('color', ylfProfileTokens.editor.dark.border),
          accent: wrap('color', ylfProfileTokens.editor.dark.accent),
          selection: wrap('color', ylfProfileTokens.editor.dark.selection),
          shadow: wrap('shadow', ylfProfileTokens.editor.dark.shadow),
        },
      },
    },
  }
}

export async function renderArtifacts() {
  const tokensCss = renderTokensCss()
  const compatCss = renderCompatCss()
  const cssVarsScss = renderCssVarsScss()
  const adminCss = renderAdminCss()
  const editorCss = renderEditorCss()
  const shadcnCss = renderShadcnAdapterCss()
  const nuxtUiCss = renderNuxtUiAdapterCss()
  const tdesignCss = renderTDesignAdapterCss()

  const [patternsRaw, fontsRaw] = await Promise.all([
    readFile(resolve(pkgRoot, 'styles/patterns.scss'), 'utf8'),
    readFile(resolve(pkgRoot, 'styles/fonts.scss'), 'utf8'),
  ])
  const patternsCss = stripScssLineComments(patternsRaw)
  const fontsCss = stripScssLineComments(fontsRaw)
  const tokensJson = `${JSON.stringify(toDtcgTokens(), null, 2)}\n`

  return {
    files: {
      'styles/tokens.css': tokensCss,
      'styles/compat.css': compatCss,
      'styles/css-vars.scss': cssVarsScss,
      'styles/admin.css': adminCss,
      'styles/editor.css': editorCss,
      'styles/adapters/shadcn.css': shadcnCss,
      'styles/adapters/nuxt-ui.css': nuxtUiCss,
      'styles/adapters/tdesign.css': tdesignCss,
    },
    distFiles: {
      'dist/index.css': `${minifyCss(cssVarsScss)}\n`,
      'dist/tokens.css': `${minifyCss(tokensCss)}\n`,
      'dist/compat.css': `${minifyCss(compatCss)}\n`,
      'dist/admin.css': `${minifyCss(adminCss)}\n`,
      'dist/editor.css': `${minifyCss(editorCss)}\n`,
      'dist/patterns.css': `${minifyCss(patternsCss)}\n`,
      'dist/fonts.css': `${minifyCss(fontsCss)}\n`,
      'dist/adapters/shadcn.css': `${minifyCss(shadcnCss)}\n`,
      'dist/adapters/nuxt-ui.css': `${minifyCss(nuxtUiCss)}\n`,
      'dist/adapters/tdesign.css': `${minifyCss(tdesignCss)}\n`,
      'dist/tokens.json': tokensJson,
    },
    tokensJson,
  }
}

async function main() {
  const { files, distFiles } = await renderArtifacts()
  const all = {
    ...files,
    ...distFiles,
  }
  await Promise.all(Object.entries(all).map(async ([rel, content]) => {
    const abs = resolve(pkgRoot, rel)
    await mkdir(dirname(abs), { recursive: true })
    await writeFile(abs, content, 'utf8')
  }))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main()
