import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
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
