---
outline: deep
---

# Registry distribution {#registry-分发}

YunLeFun Registry uses the shadcn-vue schema and CLI to distribute editable source to Vue applications. Stable foundations remain centrally maintained through npm; Registry complements `@yunlefun/vue`.

The basic pipeline is ready for release:

| Item         | Contents                                   | Status |
| ------------ | ------------------------------------------ | ------ |
| `ylf-tokens` | Shared themes and brand `--ylf-*` tokens   | stable |
| `ylf-button` | `YlfButton.vue`, depends on shared tokens  | stable |
| `ylf-dialog` | `YlfDialog.vue`, Reka UI and shared tokens | stable |

All three are universal items. They require neither Tailwind nor an initialized `components.json`; explicit targets install into Vue + Vite projects with a `src` directory.

## Install from the online Registry {#从线上-registry-安装}

Install Button:

```bash
pnpm dlx shadcn-vue@2.8.2 add https://ui.yunle.fun/r/ylf-button.json
```

Install Dialog:

```bash
pnpm dlx shadcn-vue@2.8.2 add https://ui.yunle.fun/r/ylf-dialog.json
```

Both install `ylf-tokens` through `registryDependencies`. Load it once:

```ts
import './styles/ylf-tokens.scss'
```

Use the copied components:

```vue
<script setup lang="ts">
import YlfButton from './components/ui/YlfButton.vue'
import YlfDialog from './components/ui/YlfDialog.vue'
</script>

<template>
  <YlfButton variant="accent" tone="sun">
    Start creating
  </YlfButton>
  <YlfDialog title="Confirm publication" description="All visitors will be able to see it." close-label="Close">
    Your creation
  </YlfDialog>
</template>
```

Dialogs without visible titles need a meaningful `accessible-title`, rendered for assistive technology. Set `close-label="Close"` when using English interfaces.

> Universal refers to Tailwind/components.json independence, not arbitrary directory inference. URL installation currently assumes a `src` directory.

## Build and verification {#构建与验证}

Generate Registry JSON:

```bash
pnpm registry:build
```

Run complete local acceptance:

```bash
pnpm registry:verify
```

The verifier creates two temporary Vue + Vite projects, separately installs Button and Dialog by URL with recursive tokens, then runs type checks and production builds. Installed source and tokens are compared byte for byte with authoritative files.

Repeat against the deployed Registry:

```bash
YLF_REGISTRY_BASE_URL=https://ui.yunle.fun/r pnpm registry:verify
```

## Source and generated artifacts {#源码与生成物}

`registry.json` declares relationships; output is generated from package source:

```text
packages/ui/styles/css-vars.scss ───────→ ylf-tokens.json
                                              ↑
packages/vue/components/YlfButton.vue ──→ ylf-button.json
packages/vue/components/YlfDialog.vue ──→ ylf-dialog.json
```

Button and Dialog reuse remote tokens through `registryDependencies`. They do not carry separate copies. Rebuild after editing package source; maintain no Registry specific implementations.

## Release criteria {#发布门槛}

1. shadcn-vue 2.8.2 builds every item and passes schema checks.
2. Button and Dialog install independently by URL into fresh Vue + Vite projects.
3. Dependencies, tokens, Portal, type checks and production builds pass.
4. Dialogs retain accessible names and omit empty `aria-describedby` when no description exists.
5. Generated source matches authoritative package files.
6. Unit tests, documentation and Nuxt 4 integration builds pass.

Future items should prioritize editable Blocks such as Data Table, login, settings and AI conversations. npm remains the preferred channel for basic controls.
