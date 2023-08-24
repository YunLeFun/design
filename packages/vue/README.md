# @yunlefun/vue

Vue toolkit(components/composables) for YunLeFun.

## Usage

```bash
pnpm add -D @yunlefun/vue sass
```

### Use it in Nuxt

```ts
export default defineNuxtConfig({
  modules: [
    // ...
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    // add this line
    '@yunlefun/vue/nuxt',
  ],
})
```

### Add auto import resolver for vue components

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/components.d.ts',
      resolvers: [
        // add @yunlefun/vue auto import resolver
        YlfResolver(),
      ],
      di
    }),
  ]
})
```

You can use `<YlfXxx />` components in your vue files directly.
