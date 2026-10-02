---
outline: deep
---

# Get started {#开始使用}

Use the native VitePress language menu to switch between Simplified Chinese and English. Guidelines, component documentation, preview controls and interactive examples have corresponding versions. Switching retains the current page and section, along with the global appearance preference. The brand appears as “云乐坊” in Chinese and “YunLeFun” in English.

YunLeFun Design is the shared design system for YunLeFun applications. It brings together design guidelines, brand visuals and UI implementation. Vue components are maintained through npm; Reka UI supplies complex behavior and accessibility primitives, while `--ylf-*` tokens define their appearance.

Projects that only need design tokens can use the CSS entry without Vue or Sass. Vue components are distributed as SFCs and require Sass in the consuming build. See [Public use and releases](/en/guide/adoption) for the supported scope and release criteria.

## Installation {#安装}

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

Load the design tokens once in your application. Choose either CSS or SCSS:

```ts
import '@yunlefun/ui/css'
```

```scss
@use '@yunlefun/ui/styles';
```

Nuxt can register component auto imports:

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/styles'],
})
```

Check that your installed release includes the CSS entry and accent styles described here. Try local source through workspace dependencies or `pnpm -C packages/ui pack`.

## Where to begin {#从哪里开始}

- Read [Design and UI](/en/guide/design-system) to understand the design system, styles and component library.
- Read [Package responsibilities](/en/guide/packages) to distinguish public packages, experiments and internal tools.
- Use [Visual foundations](/en/guide/foundations) for sky blue, font roles and light/dark themes.
- Read [Colors and components](/en/guide/colors) for the vivid palette and shared `tone` interface.
- Explore [Brand and interfaces](/en/guide/patterns) for cloud scenes, the logo, composition and documentation.
- Follow [Vue integration](/en/vue/) for explicit imports and a complete Nuxt example.
- Read [Component architecture](/en/guide/architecture) for the responsibilities of Reka UI, YunLeFun and Registry.
- Use [Registry distribution](/en/guide/registry) to install token, Button or Dialog source by URL.
- Explore the live [Vue component demos](/en/vue/); each preview has its own theme and viewport controls.
- Try the [AG-UI examples](/en/guide/ag-ui) for streaming chat, tool approval, interrupt/resume and error retry, with live protocol events.
- Read [Typography](/en/guide/typography) to load display fonts on demand.
- Read [Admin guidelines](/en/guide/admin) for neutral surfaces and responsive control density in management tables, filters and forms.
- Move existing applications through the [Migration guide](/en/guide/migration), tracking source changes, package releases and deployment separately.
