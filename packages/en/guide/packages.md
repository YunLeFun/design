---
outline: deep
---

# Package responsibilities {#子包职责}

`YunLeFun/design` is a pnpm workspace. Directory names describe responsibilities, but not every directory is an installable npm package.

## Current packages and directories {#当前包和目录}

| Package or directory                                             | Purpose                                                                    | Consumers and current status                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `@yunlefun/ui` · `packages/ui`                                   | Shared colors, font roles, radii, shadows, themes and optional fonts       | Web styling foundations; package exports configured            |
| `@yunlefun/vue` · `packages/vue`                                 | Vue components such as `YlfButton` and `YlfDialog`, plus Nuxt auto imports | Vue/Nuxt applications; build and release scripts configured    |
| `vitepress-theme-yunlefun` · `packages/vitepress-theme-yunlefun` | Shared VitePress theme, Markdown and appearance transitions                | design / docs / wiki; [Integration](/en/guide/vitepress-theme) |
| `@yunlefun/ui-utils` · `packages/utils`                          | Framework independent DOM utilities, mainly `previewElement`               | Experimental source; build, types and exports are incomplete   |
| `@yunlefun/metadata` · `packages/metadata`                       | Generated index of names, titles, descriptions and update dates            | Private internal documentation/build package                   |
| `packages/css`                                                   | Pulse and animation examples; legacy aurora files retained                 | No `package.json`; not an npm package                          |
| `registry.json` and `packages/public/r`                          | Declare and generate source installed by URL                               | A distribution channel for the same implementations            |
| `@yunlefun/design-monorepo`                                      | Workspace dependencies, builds and verification                            | Private root; applications do not install it                   |

Release configuration describes repository capability; it does not establish that the latest local changes are already on npm.

## `@yunlefun/ui`: foundations {#yunlefun-ui-设计基础}

This package uses `packages/ui/tokens/source.mjs` as its single structured source of truth, generating zero-dependency CSS (`tokens.css`, `compat.css`, `admin.css`, `editor.css`, `adapters/{shadcn,nuxt-ui,tdesign}.css`), optional SCSS (`css-vars.scss`), W3C DTCG JSON (`@yunlefun/ui/tokens.json`), browser-safe JS/TS constants (`@yunlefun/ui/tokens`), and a zero-dependency UnoCSS preset (`presetYunlefun()` from `@yunlefun/ui/unocss`). CSS does not need Sass; SCSS does. It contains no Vue components and imports no framework, router, authentication SDK or business API.

```bash
pnpm add @yunlefun/ui
```

```ts
import '@yunlefun/ui/css'
// Optional legacy aliases, grid/sky backgrounds, and Admin / Editor profile layers
// import '@yunlefun/ui/compat.css'
import '@yunlefun/ui/patterns.css'
// import '@yunlefun/ui/admin.css'
// import '@yunlefun/ui/editor.css'
```

For SCSS, install `sass` and use `@use '@yunlefun/ui/styles'`. CSS and SCSS are generated from one structured token source; choose one foundation entry.

The base entry only loads tokens. Opt into `@yunlefun/ui/styles/fonts` for brand display fonts, or host fonts yourself. See [Typography](/en/guide/typography).

`@yunlefun/ui/tokens.json` already exports W3C Design Tokens, while `@yunlefun/ui/tokens` and `@yunlefun/ui/unocss` share those exact definitions with JS/TS and UnoCSS toolchains without duplicating token tables.

## `@yunlefun/vue`: Vue implementation {#yunlefun-vue-vue-组件实现}

Components receive presentation data and interaction state through props, slots, events and `v-model`, using native CSS custom properties with no `sass` dependency. Focus, keyboard and overlay behavior reuse Reka UI where appropriate.

- Import SFCs from paths such as `@yunlefun/vue/components/YlfButton.vue`.
- Nuxt registers components through `@yunlefun/vue/nuxt`; the application explicitly loads tokens (prefer `@yunlefun/ui/css`).
- The root `@yunlefun/vue` entry exports browser-safe types only, not named exports for every `Ylf*` component; Node path helpers such as `componentsDir` live in `@yunlefun/vue/node`.
- Applications install and load `@yunlefun/ui` alongside Vue; the Vue package does not inject styles automatically.

See [Vue components](/en/vue/) for executable integration examples.

## `@yunlefun/ui-utils`: DOM utilities {#yunlefun-ui-utils-小型-dom-工具}

`previewElement` enlarges an element using DOM operations and requires a browser. Framework independent does not mean server executable, nor does it promise complete focus, keyboard or dialog behavior.

Documentation imports source directly. Until packaging, declarations and behavior verification are complete, this is not a required application dependency. Prefer `YlfDialog` for production dialogs.

## `@yunlefun/metadata`: internal index {#yunlefun-metadata-内部文档索引}

Build scripts read metadata in `packages/vue/components/*/index.md` and Git update dates for demos to generate the component index used by navigation and previews.

```bash
pnpm run update
```

Use `run` to distinguish the workspace generator from the package manager dependency update command. This package provides no themes, icons or business data, and is not installed by applications. Add components through source documentation and demos, not by editing generated metadata.

## Styles and Registry {#样式目录与-registry}

Documentation directly imports `packages/css`. Mature effects may become optional `@yunlefun/ui` entries after verification; experimental effects remain examples. Avoid two sets of theme values.

Registry generates `ylf-tokens`, `ylf-button` and `ylf-dialog` from the UI and Vue packages. npm makes centralized upgrades easier. Once Registry source is copied into an application, its maintainers merge subsequent updates. See [Registry distribution](/en/guide/registry).

## Dependencies and business boundaries {#依赖和业务边界}

```text
Application ──→ @yunlefun/ui (styles)
Application ──→ @yunlefun/vue ──→ Reka UI + Vue (interaction)
Documentation ──→ ui + vue + metadata + CSS examples
Registry ──→ generated from authoritative ui / vue source
```

Applications own authentication, permissions, payments, data and analytics. The design system supplies form layouts, loading and error states, and controls. Compositions become shared modules after validation in multiple real scenarios.
