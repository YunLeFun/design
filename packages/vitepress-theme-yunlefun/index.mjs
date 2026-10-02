import DefaultTheme from 'vitepress/theme-without-fonts'
import Layout from './components/Layout.vue'

export { Layout }
export { default as YunlefunLogo } from './components/YunlefunLogo.vue'
export { provideAppearanceTransition, useAppearanceTransition } from 'vitepress-theme-yunlefun/appearance'

export default { extends: DefaultTheme, Layout }
