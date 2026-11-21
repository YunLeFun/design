// =============================================================================
// YunLeFun Design · Single Source of Truth for Design Tokens
// 晴空蓝为主，高饱和纯色点缀
// =============================================================================

export const ylfPalette = {
  blue: '#2563eb',
  sun: '#facc15',
  cyan: '#06b6d4',
  coral: '#ff6b4a',
  pink: '#ec4899',
  green: '#22c55e',
}

export const ylfAccentTones = /** @type {const} */ ([
  'blue',
  'sun',
  'cyan',
  'coral',
  'pink',
  'green',
])

export const ylfStatusMap = /** @type {const} */ ({
  success: 'green',
  warning: 'sun',
  danger: 'coral',
  info: 'cyan',
})

export const ylfStatuses = /** @type {const} */ (['success', 'warning', 'danger', 'info'])

export const ylfProfiles = /** @type {const} */ (['consumer', 'admin', 'editor'])

export const ylfCloudShapes = /** @type {const} */ ([
  'billow',
  'heap',
  'bank',
  'puff',
  'wisp',
])

export const ylfCloudSilhouettes = {
  billow: 'M 58 199 C 26 199 8 185 8 164 C 8 144 22 130 43 128 C 39 102 55 81 79 80 C 94 79 106 85 115 94 C 106 57 129 24 164 23 C 191 22 211 38 220 61 C 232 43 251 36 269 40 C 295 45 310 66 309 90 C 325 80 345 83 357 95 C 367 104 371 117 369 129 C 392 119 417 130 424 151 C 449 147 477 163 477 183 C 477 207 453 218 422 218 C 391 218 367 213 341 216 C 303 222 272 218 246 215 C 211 222 176 217 151 212 C 118 218 84 214 58 199 Z',
  heap: 'M 40 205 C 14 205 4 190 10 174 C 16 158 34 152 52 156 C 50 126 74 106 102 112 C 112 78 150 62 182 76 C 198 44 240 30 274 46 C 302 30 344 38 360 66 C 392 58 424 78 426 108 C 456 110 482 132 480 162 C 486 190 466 208 436 210 C 380 214 330 212 280 214 C 220 216 160 214 110 212 C 84 212 60 208 40 205 Z',
  bank: 'M 30 212 C 10 212 2 200 8 188 C 14 176 30 172 46 176 C 52 156 74 148 94 156 C 108 136 138 132 156 146 C 172 124 208 120 228 138 C 246 118 284 118 300 140 C 318 126 352 128 362 150 C 380 140 410 144 418 162 C 444 158 470 172 474 190 C 478 206 462 214 440 214 C 380 216 300 214 230 216 C 160 218 90 214 30 212 Z',
  puff: 'M 120 210 C 88 210 70 192 76 170 C 82 150 102 142 122 148 C 120 112 150 86 186 90 C 204 60 250 52 278 76 C 300 64 336 74 344 104 C 376 102 404 126 400 156 C 412 182 396 210 366 212 C 300 214 220 214 120 210 Z',
  wisp: 'M 20 200 C 6 200 2 190 10 184 C 18 178 30 178 40 180 C 52 166 80 162 98 170 C 120 156 160 154 182 166 C 206 152 248 150 270 164 C 296 152 336 154 352 168 C 376 160 410 162 426 174 C 452 170 482 178 484 190 C 486 202 470 206 446 206 C 380 208 300 206 230 208 C 160 210 80 206 20 200 Z',
}

export const ylfBrand = {
  light: {
    'brand': 'var(--ylf-palette-blue)',
    'brand-hover': '#1d4ed8',
    'brand-active': '#1e40af',
    'brand-soft': '#eff6ff',
  },
  dark: {
    'brand': '#60a5fa',
    'brand-hover': '#93c5fd',
    'brand-active': '#3b82f6',
    'brand-soft': '#15264a',
  },
}

export const ylfHero = {
  'start': '#2563eb',
  'middle': '#0f74b8',
  'end': '#0369a1',
  'hover-start': '#1d4ed8',
  'hover-middle': '#096ba9',
  'hover-end': '#075985',
  'foreground': '#ffffff',
  'background': 'linear-gradient(115deg, var(--ylf-hero-start), var(--ylf-hero-middle) 58%, var(--ylf-hero-end))',
  'background-hover': 'linear-gradient(115deg, var(--ylf-hero-hover-start), var(--ylf-hero-hover-middle) 58%, var(--ylf-hero-hover-end))',
  'border': 'rgb(255 255 255 / 0.16)',
  'shadow': 'inset 0 1px 0 rgb(255 255 255 / 0.24), 0 12px 26px -14px rgb(3 105 161 / 0.58)',
  'shadow-hover': 'inset 0 1px 0 rgb(255 255 255 / 0.3), 0 14px 30px -14px rgb(3 105 161 / 0.58)',
}

export const ylfAccents = {
  sun: {
    light: {
      base: 'var(--ylf-palette-sun)',
      hover: '#eab308',
      soft: '#fef9c3',
      text: '#854d0e',
      on: '#64380e',
    },
    dark: { soft: '#30290f', text: '#fde047' },
  },
  cyan: {
    light: {
      base: 'var(--ylf-palette-cyan)',
      hover: '#22d3ee',
      soft: '#cffafe',
      text: '#155e75',
      on: '#083e4f',
    },
    dark: { soft: '#10313d', text: '#67e8f9' },
  },
  coral: {
    light: {
      base: 'var(--ylf-palette-coral)',
      hover: '#ff856b',
      soft: '#ffede6',
      text: '#9a3412',
      on: '#551b0a',
    },
    dark: { soft: '#39231f', text: '#fda48c' },
  },
  pink: {
    light: {
      base: 'var(--ylf-palette-pink)',
      hover: '#f472b6',
      soft: '#fce7f3',
      text: '#9d174d',
      on: '#400a2b',
    },
    dark: { soft: '#351e32', text: '#f9a8d4' },
  },
  green: {
    light: {
      base: 'var(--ylf-palette-green)',
      hover: '#4ade80',
      soft: '#dcfce7',
      text: '#166534',
      on: '#124324',
    },
    dark: { soft: '#142e26', text: '#86efac' },
  },
}

export const ylfNeutrals = {
  light: {
    'bg': '#f8fafc',
    'bg-soft': '#f1f5f9',
    'bg-mute': '#e2e8f0',
    'surface': '#ffffff',
    'surface-raised': '#f6f9ff',
    'surface-inset': '#edf2f8',
    'highlight': 'rgba(255, 255, 255, 0.9)',
    'panel': 'rgba(255, 255, 255, 0.96)',
    'edge': 'rgba(30, 64, 115, 0.12)',
    'text': '#0f172a',
    'text-2': '#475569',
    'text-3': '#5a697e',
    'placeholder': 'var(--ylf-c-text-3)',
    'text-on-accent': '#ffffff',
    'border': '#e2e8f0',
    'border-strong': '#cbd5e1',
    'overlay': 'rgba(13, 17, 32, 0.45)',
  },
  dark: {
    'bg': '#0b111c',
    'bg-soft': '#101826',
    'bg-mute': '#22304a',
    'surface': '#141d2b',
    'surface-raised': '#1b2638',
    'surface-inset': '#080d16',
    'highlight': 'rgba(186, 214, 255, 0.1)',
    'panel': 'rgba(20, 29, 43, 0.96)',
    'edge': 'rgba(2, 6, 15, 0.55)',
    'text': '#e7eef8',
    'text-2': '#b9c6d9',
    'text-3': '#8d9db4',
    'placeholder': 'var(--ylf-c-text-3)',
    'text-on-accent': '#0f172a',
    'border': '#24324a',
    'border-strong': '#36486a',
    'overlay': 'rgba(2, 6, 15, 0.72)',
  },
}

export const ylfGlass = {
  light: {
    'glass-bg': 'rgba(255, 255, 255, 0.82)',
    'glass-border': 'rgba(255, 255, 255, 0.7)',
    'glass-blur': 'saturate(160%) blur(16px)',
    'overlay-blur': 'saturate(85%) blur(10px)',
  },
  dark: {
    'glass-bg': 'rgba(20, 29, 43, 0.9)',
    'glass-border': 'rgba(96, 165, 250, 0.18)',
  },
}

export const ylfRadius = {
  '2xs': '4px',
  'xs': '6px',
  'sm': '10px',
  'DEFAULT': '14px',
  'lg': '20px',
  'xl': '28px',
  'pill': '999px',
}

export const ylfShadow = {
  light: {
    'shadow-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.12)',
    'shadow': '0 10px 28px -8px rgba(15, 23, 42, 0.16)',
    'shadow-lg': '0 22px 56px -14px rgba(15, 23, 42, 0.22)',
    'shadow-control': 'inset 0 1px 0 var(--ylf-c-highlight), 0 1px 2px rgba(15, 23, 42, 0.06), 0 3px 6px -4px rgba(15, 23, 42, 0.16)',
    'shadow-inset': 'inset 0 1px 3px rgba(15, 23, 42, 0.08)',
    'shadow-panel': 'inset 0 1px 0 var(--ylf-c-highlight), 0 0 0 1px var(--ylf-c-edge), 0 8px 16px -8px rgba(15, 23, 42, 0.14), 0 28px 64px -20px rgba(24, 52, 102, 0.24)',
    'glow-brand': '0 6px 18px -8px rgba(37, 99, 235, 0.35)',
    'glow-brand-hover': '0 8px 22px -8px rgba(37, 99, 235, 0.4)',
  },
  dark: {
    'shadow-sm': '0 2px 10px -2px rgba(2, 6, 15, 0.55)',
    'shadow': '0 12px 30px -8px rgba(2, 6, 15, 0.6)',
    'shadow-lg': '0 24px 60px -14px rgba(2, 6, 15, 0.65)',
    'shadow-control': 'inset 0 1px 0 var(--ylf-c-highlight), 0 1px 2px rgba(2, 6, 15, 0.3), 0 4px 8px -4px rgba(2, 6, 15, 0.35)',
    'shadow-inset': 'inset 0 1px 4px rgba(2, 6, 15, 0.4)',
    'shadow-panel': 'inset 0 1px 0 var(--ylf-c-highlight), 0 0 0 1px var(--ylf-c-edge), 0 10px 20px -8px rgba(2, 6, 15, 0.4), 0 32px 72px -18px rgba(2, 6, 15, 0.6)',
    'glow-brand': '0 6px 18px -8px rgba(96, 165, 250, 0.3)',
    'glow-brand-hover': '0 8px 22px -8px rgba(96, 165, 250, 0.4)',
  },
}

export const ylfTypography = {
  fontFamily: {
    display: `'Baloo 2', 'ZCOOL KuaiLe', ui-rounded, 'Hiragino Maru Gothic ProN', 'Hiragino Maru Gothic Pro', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Source Han Sans SC', sans-serif`,
    wordmark: 'var(--ylf-font-display)',
    heading: `ui-rounded, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Source Han Sans SC', system-ui, sans-serif`,
    body: `'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif`,
    ui: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif`,
    mono: `'SFMono-Regular', Consolas, 'Liberation Mono', monospace`,
  },
  fontSize: {
    '2xs': '0.6875rem',
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.25rem',
    'xl': '1.5rem',
    '2xl': '2rem',
    'display': 'clamp(2.25rem, 4.5vw, 4rem)',
  },
  lineHeight: {
    heading: '1.25',
    normal: '1.5',
    body: '1.75',
  },
}

export const ylfSpace = {
  '0_5': '2px',
  '1': '4px',
  '1_5': '6px',
  '2': '8px',
  '3': '12px',
  '4': '16px',
  '5': '20px',
  '6': '24px',
  '8': '32px',
  '10': '40px',
  '12': '48px',
  '16': '64px',
}

export const ylfLayout = {
  page: '1200px',
  reading: '720px',
}

export const ylfZIndex = {
  base: '1',
  sticky: '50',
  overlay: '100',
  modal: '101',
  popover: '105',
  tooltip: '110',
  toast: '120',
}

export const ylfFocusAndControls = {
  'ring-width': '2px',
  'ring-offset': '2px',
  'ring-color': 'var(--ylf-c-brand)',
  'disabled-opacity': '0.48',
  'control-h-sm': '34px',
  'control-h': '44px',
  'control-h-lg': '48px',
  'control-h-xl': '56px',
  'control-radius-sm': 'var(--ylf-radius-sm)',
  'control-radius': 'var(--ylf-radius)',
  'panel-radius': 'var(--ylf-radius-lg)',
  'control-font-size-sm': '0.8125rem',
  'control-font-size': '0.9375rem',
}

export const ylfInteractionAndMotion = {
  'touch-target': '44px',
  'viewport-gutter': '16px',
  'duration-press': '100ms',
  'duration-enter': '240ms',
  'duration-exit': '160ms',
  'press-scale': '0.98',
  'hover-lift': '-1px',
  'duration-fast': '160ms',
  'duration-normal': '240ms',
  'duration-slow': '480ms',
  'ease-standard': 'cubic-bezier(0.2, 0, 0, 1)',
  'ease-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'ease-spring': 'linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 19.4%, 1.067, 1.089 24.6%, 1.088 27.4%, 1.061 31.2%, 1.008 38.7%, 0.988 44.4%, 0.999 61.5%, 1)',
}

export const ylfReducedMotion = {
  'duration-press': '0ms',
  'duration-enter': '0ms',
  'duration-exit': '0ms',
  'press-scale': '1',
  'hover-lift': '0px',
  'duration-fast': '0ms',
  'duration-normal': '0ms',
  'duration-slow': '0ms',
}

export const ylfAtmosphere = {
  light: {
    'grid-size': '32px',
    'c-grid': 'rgba(37, 99, 235, 0.06)',
    'c-sky': '#dbeafe',
    'c-cloud': '#ffffff',
  },
  dark: {
    'c-grid': 'rgba(96, 165, 250, 0.08)',
    'c-sky': '#13233a',
    'c-cloud': '#22304a',
  },
}

export const ylfCloud = {
  light: {
    'highlight': '#fffefa',
    'body': '#f2f8ff',
    'shade': '#c6dff5',
    'shadow': '#83addb',
    'rim': '#ffffff',
    'face': '#5a7fae',
    'haze-color': '#9cc6ef',
  },
  dark: {
    'highlight': '#a6bcd8',
    'body': '#3e5679',
    'shade': '#1c2b44',
    'shadow': '#0a1424',
    'rim': '#cfdff2',
    'face': '#0e1a2d',
    'haze-color': '#1f3354',
  },
}

export const ylfCompat = {
  light: {
    'aurora-sky': 'var(--ylf-accent-cyan)',
    'aurora-iris': 'var(--ylf-accent-coral)',
    'aurora-pink': 'var(--ylf-accent-pink)',
    'gradient-aurora': 'linear-gradient(var(--ylf-accent-sun), var(--ylf-accent-sun))',
    'gradient-brand': 'linear-gradient(var(--ylf-c-brand), var(--ylf-c-brand))',
    'c-text-on-aurora': 'var(--ylf-accent-sun-on)',
    'glow-aurora': 'var(--ylf-shadow-sm)',
    'glow-aurora-hover': 'var(--ylf-shadow-sm)',
    'c-primary': 'var(--ylf-c-brand)',
    'c-text-light': 'var(--ylf-c-text-2)',
    'c-text-lighter': 'var(--ylf-c-text-3)',
    'c-text-lightest': 'var(--ylf-c-border-strong)',
    'c-bg-light': 'var(--ylf-c-bg-soft)',
    'c-bg-lighter': 'var(--ylf-c-bg-mute)',
  },
  // Re-declare derived aliases on dark boundaries so local .ylf-theme-dark wrappers resolve dark values.
  dark: {
    'c-success': 'var(--ylf-status-success-text)',
    'c-warning': 'var(--ylf-status-warning-text)',
    'c-danger': 'var(--ylf-status-danger-text)',
    'c-info': 'var(--ylf-status-info-text)',
    'gradient-brand': 'linear-gradient(var(--ylf-c-brand), var(--ylf-c-brand))',
    'glow-aurora': 'var(--ylf-shadow-sm)',
    'glow-aurora-hover': 'var(--ylf-shadow-sm)',
    'c-primary': 'var(--ylf-c-brand)',
    'c-text-light': 'var(--ylf-c-text-2)',
    'c-text-lighter': 'var(--ylf-c-text-3)',
    'c-text-lightest': 'var(--ylf-c-border-strong)',
    'c-bg-light': 'var(--ylf-c-bg-soft)',
    'c-bg-lighter': 'var(--ylf-c-bg-mute)',
  },
}

export const ylfProfileTokens = {
  admin: {
    base: {
      'font': 'var(--ylf-font-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei\', system-ui, sans-serif)',
      'control-sm': '28px',
      'control': '32px',
      'control-lg': '40px',
      'radius': '6px',
      'panel-radius': '10px',
      'icon-gap': '8px',
    },
    coarse: {
      'control-sm': '40px',
      'control': '44px',
      'control-lg': '48px',
    },
    light: {
      'bg': '#f6f7f9',
      'surface': '#ffffff',
      'raised': '#f0f2f5',
      'inset': '#f8f9fb',
      'fg': '#20242c',
      'muted': '#626b78',
      'placeholder': '#656e7b',
      'border': '#e1e5eb',
      'border-strong': '#c7cdd6',
    },
    dark: {
      'bg': '#111318',
      'surface': '#191c22',
      'raised': '#252a33',
      'inset': '#15181e',
      'fg': '#eef1f6',
      'muted': '#aab2c0',
      'placeholder': '#929cac',
      'border': '#303641',
      'border-strong': '#4d5869',
    },
  },
  editor: {
    base: {
      'font': 'var(--ylf-font-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'PingFang SC\', \'Hiragino Sans GB\', \'Microsoft YaHei\', system-ui, sans-serif)',
      'text': '12px',
      'caption': '11px',
      'control-sm': '24px',
      'control': '28px',
      'row': '32px',
      'header': '32px',
      'radius': '5px',
      'panel-radius': '10px',
      'panel-width': '272px',
    },
    coarse: {
      'control-sm': '40px',
      'control': '40px',
      'row': '44px',
      'header': '44px',
    },
    light: {
      bg: '#f6f6f7',
      chrome: '#ebebed',
      panel: '#f6f6f7',
      field: '#ffffff',
      workspace: '#d7d7da',
      fg: '#292a2e',
      muted: '#5c5d65',
      border: 'rgb(25 25 30 / 13%)',
      accent: 'var(--ylf-c-brand, #2563eb)',
      selection: 'color-mix(in srgb, var(--ylf-editor-accent) 10%, transparent)',
      shadow: '0 1px 3px rgb(0 0 0 / 8%), 0 10px 28px -8px rgb(0 0 0 / 18%)',
    },
    dark: {
      bg: '#242426',
      chrome: '#303033',
      panel: '#292a2d',
      field: '#353639',
      workspace: '#202123',
      fg: '#eeeef0',
      muted: '#b1b1b8',
      border: 'rgb(255 255 255 / 11%)',
      accent: 'var(--ylf-c-brand, #60a5fa)',
      selection: 'color-mix(in srgb, var(--ylf-editor-accent) 16%, transparent)',
      shadow: '0 1px 3px rgb(0 0 0 / 20%), 0 10px 28px -8px rgb(0 0 0 / 40%)',
    },
  },
}

// Documented component hook tokens consumed by @yunlefun/vue components.
export const ylfComponentTokenNames = /** @type {const} */ ([
  '--ylf-ai-accent',
  '--ylf-ai-action-size',
  '--ylf-ai-background',
  '--ylf-ai-border',
  '--ylf-ai-columns',
  '--ylf-ai-gap',
  '--ylf-ai-item-gap',
  '--ylf-ai-item-height',
  '--ylf-ai-item-padding',
  '--ylf-ai-logo-size',
  '--ylf-ai-muted',
  '--ylf-ai-name-size',
  '--ylf-ai-radius',
  '--ylf-ai-surface',
  '--ylf-ai-text',
  '--ylf-bottom-menu-c-bg',
  '--ylf-cloud-face-opacity',
  '--ylf-cloud-haze',
  '--ylf-scroll-fade-size',
  '--ylf-scroll-fade-surface',
  '--ylf-segmented-item-size',
])

export function buildBaseLightTokens() {
  const tokens = {}

  for (const [tone, value] of Object.entries(ylfPalette))
    tokens[`--ylf-palette-${tone}`] = value

  tokens['--ylf-spectrum-stops']
    = 'var(--ylf-palette-blue) 0% 16.667%, var(--ylf-palette-cyan) 16.667% 33.333%, var(--ylf-palette-green) 33.333% 50%, var(--ylf-palette-sun) 50% 66.667%, var(--ylf-palette-coral) 66.667% 83.333%, var(--ylf-palette-pink) 83.333% 100%'

  tokens['--ylf-c-brand'] = ylfBrand.light.brand
  tokens['--ylf-c-brand-hover'] = ylfBrand.light['brand-hover']
  tokens['--ylf-c-brand-active'] = ylfBrand.light['brand-active']
  tokens['--ylf-c-brand-soft'] = ylfBrand.light['brand-soft']

  Object.assign(tokens, buildBrandAccentTokens())

  for (const [key, value] of Object.entries(ylfHero))
    tokens[`--ylf-hero-${key}`] = value

  for (const [tone, def] of Object.entries(ylfAccents)) {
    tokens[`--ylf-accent-${tone}`] = def.light.base
    tokens[`--ylf-accent-${tone}-hover`] = def.light.hover
    tokens[`--ylf-accent-${tone}-soft`] = def.light.soft
    tokens[`--ylf-accent-${tone}-text`] = def.light.text
    tokens[`--ylf-accent-${tone}-on`] = def.light.on
  }

  tokens['--ylf-c-feature'] = 'var(--ylf-accent-sun)'
  tokens['--ylf-c-feature-bg'] = 'var(--ylf-accent-sun-soft)'
  tokens['--ylf-c-feature-text'] = 'var(--ylf-c-text)'

  Object.assign(tokens, buildStatusTokens())

  for (const [key, value] of Object.entries(ylfNeutrals.light))
    tokens[`--ylf-c-${key}`] = value

  for (const [key, value] of Object.entries(ylfGlass.light))
    tokens[`--ylf-${key}`] = value

  for (const [key, value] of Object.entries(ylfRadius)) {
    const suffix = key === 'DEFAULT'
      ? ''
      : `-${key}`
    tokens[`--ylf-radius${suffix}`] = value
  }

  for (const [key, value] of Object.entries(ylfShadow.light))
    tokens[`--ylf-${key}`] = value

  for (const [key, value] of Object.entries(ylfTypography.fontFamily))
    tokens[`--ylf-font-${key}`] = value

  for (const [key, value] of Object.entries(ylfTypography.fontSize))
    tokens[`--ylf-text-${key}`] = value

  for (const [key, value] of Object.entries(ylfTypography.lineHeight))
    tokens[`--ylf-leading-${key}`] = value

  for (const [key, value] of Object.entries(ylfSpace))
    tokens[`--ylf-space-${key}`] = value

  for (const [key, value] of Object.entries(ylfLayout))
    tokens[`--ylf-layout-${key}`] = value

  for (const [key, value] of Object.entries(ylfZIndex))
    tokens[`--ylf-z-${key}`] = value

  for (const [key, value] of Object.entries(ylfFocusAndControls))
    tokens[`--ylf-${key}`] = value

  for (const [key, value] of Object.entries(ylfAtmosphere.light))
    tokens[`--ylf-${key}`] = value

  for (const [key, value] of Object.entries(ylfCloud.light))
    tokens[`--ylf-cloud-${key}`] = value

  for (const [key, value] of Object.entries(ylfInteractionAndMotion))
    tokens[`--ylf-${key}`] = value

  return tokens
}

export function buildThemeDerivedTokens(mode) {
  const tokens = {}
  const brand = ylfBrand[mode]
  const neutrals = ylfNeutrals[mode]

  tokens['--ylf-c-brand'] = brand.brand
  tokens['--ylf-c-brand-hover'] = brand['brand-hover']
  tokens['--ylf-c-brand-active'] = brand['brand-active']
  tokens['--ylf-c-brand-soft'] = brand['brand-soft']

  Object.assign(tokens, buildBrandAccentTokens())

  for (const [tone, def] of Object.entries(ylfAccents)) {
    tokens[`--ylf-accent-${tone}-soft`] = def[mode].soft
    tokens[`--ylf-accent-${tone}-text`] = def[mode].text
  }

  Object.assign(tokens, buildStatusTokens())

  tokens['--ylf-c-feature-bg'] = 'var(--ylf-accent-sun-soft)'
  tokens['--ylf-c-feature-text'] = 'var(--ylf-c-text)'
  tokens['--ylf-c-text-on-accent'] = neutrals['text-on-accent']
  tokens['--ylf-c-bg-mute'] = neutrals['bg-mute']
  tokens['--ylf-c-panel'] = neutrals.panel
  tokens['--ylf-c-highlight'] = neutrals.highlight
  tokens['--ylf-c-edge'] = neutrals.edge
  tokens['--ylf-c-overlay'] = neutrals.overlay
  tokens['--ylf-ring-color'] = 'var(--ylf-c-brand)'

  for (const key of ['glass-bg', 'glass-border'])
    tokens[`--ylf-${key}`] = ylfGlass[mode][key]

  for (const [key, value] of Object.entries(ylfShadow[mode]))
    tokens[`--ylf-${key}`] = value

  return tokens
}

export function buildBaseDarkTokens() {
  const tokens = buildThemeDerivedTokens('dark')

  for (const [key, value] of Object.entries(ylfNeutrals.dark))
    tokens[`--ylf-c-${key}`] = value

  for (const [key, value] of Object.entries(ylfAtmosphere.dark))
    tokens[`--ylf-${key}`] = value

  for (const [key, value] of Object.entries(ylfCloud.dark))
    tokens[`--ylf-cloud-${key}`] = value

  return tokens
}

export function buildBrandAccentTokens() {
  return {
    '--ylf-accent-blue': 'var(--ylf-c-brand)',
    '--ylf-accent-blue-hover': 'var(--ylf-c-brand-hover)',
    '--ylf-accent-blue-soft': 'var(--ylf-c-brand-soft)',
    '--ylf-accent-blue-text': 'var(--ylf-c-brand)',
    '--ylf-accent-blue-on': 'var(--ylf-c-text-on-accent)',
    '--ylf-accent': 'var(--ylf-accent-blue)',
    '--ylf-accent-hover': 'var(--ylf-accent-blue-hover)',
    '--ylf-accent-soft': 'var(--ylf-accent-blue-soft)',
    '--ylf-accent-text': 'var(--ylf-accent-blue-text)',
    '--ylf-accent-on': 'var(--ylf-accent-blue-on)',
  }
}

export function buildStatusTokens() {
  const tokens = {}
  for (const [status, tone] of Object.entries(ylfStatusMap)) {
    tokens[`--ylf-status-${status}`] = `var(--ylf-accent-${tone})`
    tokens[`--ylf-status-${status}-hover`] = `var(--ylf-accent-${tone}-hover)`
    tokens[`--ylf-status-${status}-on`] = `var(--ylf-accent-${tone}-on)`
    tokens[`--ylf-status-${status}-soft`] = `var(--ylf-accent-${tone}-soft)`
    tokens[`--ylf-status-${status}-text`] = `var(--ylf-accent-${tone}-text)`
  }
  return tokens
}

export function buildCompatLightTokens() {
  const tokens = {}
  for (const status of ylfStatuses)
    tokens[`--ylf-c-${status}`] = `var(--ylf-status-${status}-text)`
  for (const [key, value] of Object.entries(ylfCompat.light))
    tokens[`--ylf-${key}`] = value
  return tokens
}

export function buildCompatDarkTokens() {
  const tokens = {}
  for (const [key, value] of Object.entries(ylfCompat.dark))
    tokens[`--ylf-${key}`] = value
  return tokens
}

export function buildAllTokenNames() {
  const core = new Set(Object.keys(buildBaseLightTokens()))
  for (const key of Object.keys(ylfProfileTokens.admin.base))
    core.add(`--ylf-admin-${key}`)
  for (const key of Object.keys(ylfProfileTokens.admin.light))
    core.add(`--ylf-admin-${key}`)
  for (const key of Object.keys(ylfProfileTokens.editor.base))
    core.add(`--ylf-editor-${key}`)
  for (const key of Object.keys(ylfProfileTokens.editor.light))
    core.add(`--ylf-editor-${key}`)

  const compat = new Set([
    ...Object.keys(buildCompatLightTokens()),
    ...Object.keys(buildCompatDarkTokens()),
  ])

  const component = new Set(ylfComponentTokenNames)

  return {
    core: [...core].sort(),
    compat: [...compat].sort(),
    component: [...component].sort(),
  }
}
