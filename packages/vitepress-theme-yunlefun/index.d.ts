import type { Theme } from 'vitepress'
import type { DefineComponent } from 'vue'

export const Layout: DefineComponent
export { provideAppearanceTransition, useAppearanceTransition } from './dist/appearance.mjs'
declare const theme: Theme
export default theme
