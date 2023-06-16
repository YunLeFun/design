# @yunlefun/vue-components

## Usage

```bash
pnpm add -D @yunlefun/vue-components
```

### Add auto import resolver for vue components

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { componentsDir } from '@yunlefun/vue-components'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: ['src/components', componentsDir],
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
    }),
  ]
})
```

You can use `<YlfXxx />` components in your vue files directly.
