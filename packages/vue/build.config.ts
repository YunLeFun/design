import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    { input: './src/ag-ui', name: 'ag-ui' },
    { input: './components/ai-prompt', name: 'ai-prompt' },
  ],

  declaration: true,
  // The build script cleans once, then emits SFC types before export validation.
  clean: false,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'unplugin-vue-components',
    '@nuxt/kit',
  ],
})
