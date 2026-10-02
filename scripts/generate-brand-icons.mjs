import { fileURLToPath } from 'node:url'
import { generateBrandAssets } from 'vitepress-theme-yunlefun/brand-assets'

await generateBrandAssets({
  outDir: fileURLToPath(new URL('../packages/public/', import.meta.url)),
  icon: 'design-mark',
  title: '云乐坊设计',
})
