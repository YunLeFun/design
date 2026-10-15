import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/config', './src/appearance', './src/navigation'],
  declaration: true,
  clean: true,
  externals: ['vue', 'vitepress'],
})
