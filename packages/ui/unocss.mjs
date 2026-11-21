import { ylfAccentTones, ylfStatuses, ylfZIndex } from './tokens/source.mjs'

function accentColorEntry(tone) {
  return {
    DEFAULT: `var(--ylf-accent-${tone})`,
    hover: `var(--ylf-accent-${tone}-hover)`,
    soft: `var(--ylf-accent-${tone}-soft)`,
    text: `var(--ylf-accent-${tone}-text)`,
    on: `var(--ylf-accent-${tone}-on)`,
  }
}

function statusColorEntry(status) {
  return {
    DEFAULT: `var(--ylf-status-${status}-text)`,
    base: `var(--ylf-status-${status})`,
    hover: `var(--ylf-status-${status}-hover)`,
    soft: `var(--ylf-status-${status}-soft)`,
    text: `var(--ylf-status-${status}-text)`,
    on: `var(--ylf-status-${status}-on)`,
  }
}

export function presetYunlefun() {
  const paletteColors = Object.fromEntries(ylfAccentTones.map(tone => [tone, `var(--ylf-palette-${tone})`]))
  const accentColors = Object.fromEntries(ylfAccentTones.map(tone => [tone, accentColorEntry(tone)]))
  const statusColors = Object.fromEntries(ylfStatuses.map(status => [status, statusColorEntry(status)]))
  const zIndex = Object.fromEntries(Object.keys(ylfZIndex).map(key => [`ylf-${key}`, `var(--ylf-z-${key})`]))

  return {
    name: 'unocss-preset-yunlefun',
    rules: [
      ['bg-hero', { 'background-image': 'var(--ylf-hero-background)' }],
      ['bg-brand-gradient', { 'background-image': 'var(--ylf-hero-background)' }],
      ['bg-spectrum', { 'background-image': 'linear-gradient(90deg, var(--ylf-spectrum-stops))' }],
      ['shadow-soft-sm', { 'box-shadow': 'var(--ylf-shadow-sm)' }],
      ['shadow-soft', { 'box-shadow': 'var(--ylf-shadow)' }],
      ['shadow-soft-lg', { 'box-shadow': 'var(--ylf-shadow-lg)' }],
      ['shadow-control', { 'box-shadow': 'var(--ylf-shadow-control)' }],
      ['shadow-panel', { 'box-shadow': 'var(--ylf-shadow-panel)' }],
      ['ylf-glass', {
        'background': 'var(--ylf-glass-bg)',
        'backdrop-filter': 'var(--ylf-glass-blur)',
        '-webkit-backdrop-filter': 'var(--ylf-glass-blur)',
        'border': '1px solid var(--ylf-glass-border)',
      }],
    ],
    theme: {
      colors: {
        primary: 'var(--ylf-c-brand)',
        brand: {
          DEFAULT: 'var(--ylf-c-brand)',
          hover: 'var(--ylf-c-brand-hover)',
          active: 'var(--ylf-c-brand-active)',
          soft: 'var(--ylf-c-brand-soft)',
        },
        palette: paletteColors,
        accent: {
          DEFAULT: 'var(--ylf-accent)',
          hover: 'var(--ylf-accent-hover)',
          soft: 'var(--ylf-accent-soft)',
          text: 'var(--ylf-accent-text)',
          on: 'var(--ylf-accent-on)',
          ...accentColors,
        },
        status: statusColors,
        success: statusColors.success,
        warning: statusColors.warning,
        danger: statusColors.danger,
        info: statusColors.info,
        surface: {
          DEFAULT: 'var(--ylf-c-surface)',
          raised: 'var(--ylf-c-surface-raised)',
          inset: 'var(--ylf-c-surface-inset)',
          panel: 'var(--ylf-c-panel)',
        },
        bg: {
          DEFAULT: 'var(--ylf-c-bg)',
          soft: 'var(--ylf-c-bg-soft)',
          mute: 'var(--ylf-c-bg-mute)',
        },
        fg: {
          DEFAULT: 'var(--ylf-c-text)',
          muted: 'var(--ylf-c-text-2)',
          subtle: 'var(--ylf-c-text-3)',
          onAccent: 'var(--ylf-c-text-on-accent)',
        },
        border: {
          DEFAULT: 'var(--ylf-c-border)',
          strong: 'var(--ylf-c-border-strong)',
          edge: 'var(--ylf-c-edge)',
        },
      },
      borderRadius: {
        'ylf-2xs': 'var(--ylf-radius-2xs)',
        'ylf-xs': 'var(--ylf-radius-xs)',
        'ylf-sm': 'var(--ylf-radius-sm)',
        'ylf': 'var(--ylf-radius)',
        'ylf-lg': 'var(--ylf-radius-lg)',
        'ylf-xl': 'var(--ylf-radius-xl)',
        'ylf-pill': 'var(--ylf-radius-pill)',
      },
      fontFamily: {
        mono: 'var(--ylf-font-mono)',
        display: 'var(--ylf-font-display)',
        wordmark: 'var(--ylf-font-wordmark)',
        heading: 'var(--ylf-font-heading)',
        body: 'var(--ylf-font-body)',
        ui: 'var(--ylf-font-ui)',
      },
      zIndex,
    },
  }
}

export default presetYunlefun
