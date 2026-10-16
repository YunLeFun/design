import type { Theme } from 'vitepress'
import type { YunlefunBrandIcon, YunlefunBrandImage, YunlefunBrandMark } from 'vitepress-theme-yunlefun/config'
import type { DefineComponent } from 'vue'

export const Layout: DefineComponent
export const YunlefunLogo: DefineComponent<{
  /** Canonical mark; kept for 0.3 call sites. */
  name?: YunlefunBrandMark
  /** Canonical mark, Iconify data or image; takes precedence over `name`. */
  icon?: YunlefunBrandMark | YunlefunBrandIcon | YunlefunBrandImage
  label?: string
}>
export { provideAppearanceTransition, useAppearanceTransition } from './dist/appearance.mjs'
export type { YunlefunBrandIcon, YunlefunBrandImage, YunlefunBrandMark, YunlefunThemeConfig } from './dist/config.mjs'
declare const theme: Theme
export default theme
