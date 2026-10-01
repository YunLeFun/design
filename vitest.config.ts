import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vitepress-theme-yunlefun/appearance': resolve(__dirname, 'packages/vitepress-theme-yunlefun/src/appearance.ts'),
      '@yunlefun/ui/*': resolve(__dirname, 'packages/ui/*'),
    },
    dedupe: [
      'vitepress',
      'vue',
      'vue-demi',
      '@vue/runtime-core',
    ],
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
  },
})
