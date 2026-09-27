import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    { input: './components/ai-prompt', name: 'ai-prompt' },
  ],

  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'unplugin-vue-components',
    '@nuxt/kit',
  ],
})
