import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './index',
    './auto-import-resolver',
  ],

  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'unplugin-vue-components',
  ],
})
