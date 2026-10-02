---
outline: deep
---

# Shared VitePress theme {#vitepress-共享主题}

`vitepress-theme-yunlefun` gives design, the public developer docs and the internal Wiki one documentation style. Each site owns its content and navigation.

## Theme responsibilities {#主题分工}

| Layer               | Responsibility                                                                                                             | Source                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Foundations         | Sky/night colors, text, surfaces, radii, shadows and spacing                                                               | `@yunlefun/ui`             |
| Documentation theme | Cyan anchors and cyan/yellow title rule, navigation, Markdown, scrolling tables, code, callouts and appearance transitions | `vitepress-theme-yunlefun` |
| Site                | Homepage, navigation, sidebar, languages and business components                                                           | design / docs / wiki       |

Cyan and yellow mark titles; primary actions and links retain brand blue. Documents use system fonts. Sites may opt into brand display fonts.

## Install and integrate {#安装与接入}

The first version is distributed as an npm-format tarball on GitHub Releases:

```sh
pnpm add -D https://github.com/YunLeFun/design/releases/download/theme-v0.2.0/vitepress-theme-yunlefun-0.2.0.tgz
```

In `.vitepress/theme/index.ts`:

```ts
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'

export default Theme
```

In `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import { withYunlefun, yunlefunMarkdown } from 'vitepress-theme-yunlefun/config'

export default defineConfig(withYunlefun({
  lang: 'en',
  title: 'YunLeFun Docs',
  markdown: { config: md => md.use(yunlefunMarkdown) },
}))
```

`withYunlefun` preserves existing Vite plugins and bundles the installed Vue theme for server rendering. CSS uses compiled design tokens, requires no Sass and downloads no fonts.

## Native features {#保留原生功能}

Navigation, search, sidebars, outlines, languages, code groups and copying use the default VitePress theme. Use native `locales` for Chinese and English. The theme does not translate content. Optional `zhThemeConfig` supplies Chinese interface labels.

Supported: VitePress 1.6.4 and 2.0.0-alpha.16/17, with Vue 3.5. Both client and server builds are verified across the three sites.

## Extend your site {#扩展站点}

```vue
<script setup lang="ts">
import { Layout } from 'vitepress-theme-yunlefun'
</script>

<template>
  <Layout>
    <template #doc-before>
      <p>A site-specific notice</p>
    </template>
  </Layout>
</template>
```

Default theme slots and scoped data are forwarded. The cloud scene and component demos stay in design; site directories stay in docs and wiki.

Custom appearance controls can call `toggleAppearance()` or `setAppearance(dark)` from `useAppearanceTransition()` in `vitepress-theme-yunlefun/appearance`. They share the header's state, respect reduced motion and remain still on initial load.

## Upgrade and maintain {#升级与维护}

Edit shared document styling in `packages/vitepress-theme-yunlefun` and foundation tokens in `packages/ui`. Upgrade all sites to the same version and commit lockfiles. The first release uses a fixed GitHub Release URL; npm versions can replace it after initial npm publication is authorized.

## Canonical brand assets

Configure `themeConfig.brand: { icon: "brand-mark", hero: true }` to render the shared logo in navigation and the native home hero. Design uses `design-mark`. Omit the native `logo` and `hero.image` options when using this API. Custom native slots still override the defaults.

Geometry comes from `@yunlefun/icons`; colors follow `--ylf-c-brand` from `@yunlefun/ui`. The [icon catalog](https://icons.yunle.fun/) and [design system](https://ui.yunle.fun/) remain independent repositories connected by dependencies and links.

```js
import { generateBrandAssets } from 'vitepress-theme-yunlefun/brand-assets'

await generateBrandAssets({ outDir: 'docs/public', icon: 'brand-mark', title: 'YunLeFun' })
```

Run this Node-only helper when updating icons; commit the generated files. PNG generation requires `rsvg-convert` (librsvg). SVG-only tooling can pass `png: false`.
