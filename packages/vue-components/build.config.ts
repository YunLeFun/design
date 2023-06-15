import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    // ref https://github.com/wobsoriano/vue-sfc-unbuild
    { builder: 'mkdist', input: './src/' },
    { builder: 'mkdist', input: './src/', format: 'cjs', ext: 'cjs' },
    './types',
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
