import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/config', './src/appearance'],
  declaration: true,
  clean: true,
  externals: ['vue', 'vitepress'],
})
