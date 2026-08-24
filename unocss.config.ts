import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'border-main': 'border-$vp-c-divider',
    'bg-main': 'bg-gray-400',
    'bg-base': 'bg-white dark:bg-hex-1a1a1a',
  },
  rules: [
    // 极光签名色 —— 缤纷多彩
    ['bg-aurora', { 'background-image': 'var(--ylf-gradient-aurora)' }],
    ['bg-brand-gradient', { 'background-image': 'var(--ylf-gradient-brand)' }],
    ['text-aurora', {
      'background-image': 'var(--ylf-gradient-aurora)',
      'background-clip': 'text',
      '-webkit-background-clip': 'text',
      'color': 'transparent',
    }],
    // 色染柔影 / 极光辉光
    ['shadow-soft-sm', { 'box-shadow': 'var(--ylf-shadow-sm)' }],
    ['shadow-soft', { 'box-shadow': 'var(--ylf-shadow)' }],
    ['shadow-soft-lg', { 'box-shadow': 'var(--ylf-shadow-lg)' }],
    ['glow-aurora', { 'box-shadow': 'var(--ylf-glow-aurora)' }],
    // 云玻璃
    ['ylf-glass', {
      'background': 'var(--ylf-glass-bg)',
      'backdrop-filter': 'var(--ylf-glass-blur)',
      '-webkit-backdrop-filter': 'var(--ylf-glass-blur)',
      'border': '1px solid var(--ylf-glass-border)',
    }],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  theme: {
    colors: {
      // 锚点：鸢尾紫
      primary: 'var(--ylf-c-brand)',
      brand: {
        DEFAULT: 'var(--ylf-c-brand)',
        hover: 'var(--ylf-c-brand-hover)',
        active: 'var(--ylf-c-brand-active)',
        soft: 'var(--ylf-c-brand-soft)',
      },
      // 极光光谱（冷调三色）
      aurora: {
        sky: 'var(--ylf-aurora-sky)',
        iris: 'var(--ylf-aurora-iris)',
        pink: 'var(--ylf-aurora-pink)',
      },
      // 语义色
      success: 'var(--ylf-c-success)',
      warning: 'var(--ylf-c-warning)',
      danger: 'var(--ylf-c-danger)',
      info: 'var(--ylf-c-info)',
      // 中性
      surface: 'var(--ylf-c-surface)',
    },
    borderRadius: {
      'ylf': 'var(--ylf-radius)',
      'ylf-lg': 'var(--ylf-radius-lg)',
      'ylf-xl': 'var(--ylf-radius-xl)',
      'ylf-pill': 'var(--ylf-radius-pill)',
    },
    fontFamily: {
      mono: 'var(--vt-font-family-mono)',
      display: 'var(--ylf-font-display)',
      heading: 'var(--ylf-font-heading)',
      body: 'var(--ylf-font-body)',
    },
  },
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
