import type { Theme } from 'vitepress'
import type { DefineComponent } from 'vue'

export const Layout: DefineComponent
export const YunlefunLogo: DefineComponent<{ name?: 'brand-mark' | 'design-mark', label?: string }>
export { provideAppearanceTransition, useAppearanceTransition } from './dist/appearance.mjs'
export type { YunlefunThemeConfig } from './dist/config.mjs'
declare const theme: Theme
export default theme
