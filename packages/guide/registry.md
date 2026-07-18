---
outline: deep
---

# Registry Pilot

Registry pilot 是一次小范围链路验证：先让一个代表性组件能够从 Registry URL 安装到真实 Vue 项目，再决定是否扩大到 Blocks 和复杂组合组件。它不是把整个组件库立即改成复制源码模式。

当前 pilot 选择 `YlfButton`，因为它依赖少，却能同时验证：

- `shadcn-vue` Registry schema 与 universal item 安装；
- 从现有 `YlfButton.vue` 生成分发内容，不维护第二份组件源码；
- YunLeFun SCSS 与 `--ylf-*` token 随组件落入业务项目；
- 文档站静态托管 `/r/*.json`；
- 安装后的类型检查和生产构建。

> 当前状态：**实验性 pilot**。npm 包仍是稳定基础组件的首选分发方式。

## 从线上 Registry 安装

在采用 `src` 目录的 Vue + Vite 项目根目录运行，不需要先引入 Tailwind 或初始化 `components.json`：

```bash
pnpm dlx shadcn-vue@2.8.0 add https://ui.yunle.fun/r/ylf-button.json
```

CLI 会把 `YlfButton.vue` 写入 `src/components/ui`，并把 token 写入 `src/styles/ylf-tokens.scss`。在应用入口加载一次 token：

这里的 universal 表示安装不依赖 Tailwind 和 `components.json`，不表示能自动适配任意项目目录。Nuxt 与自定义 source directory 暂不在本轮 pilot 范围内。

```ts
import './styles/ylf-tokens.scss'
```

然后直接使用复制到项目中的组件：

```vue
<script setup lang="ts">
import YlfButton from './components/ui/YlfButton.vue'
</script>

<template>
  <YlfButton variant="aurora">
    开始创作
  </YlfButton>
</template>
```

## 本地验证

启动文档站前会自动构建 Registry：

```bash
pnpm docs:dev
```

也可以只生成 JSON：

```bash
pnpm registry:build
```

执行完整的 URL 安装与消费项目生产构建验收：

```bash
pnpm registry:verify
```

部署后可传入线上 Registry URL，重复执行同一套安装与构建验收：

```bash
YLF_REGISTRY_URL=https://ui.yunle.fun/r/ylf-button.json pnpm registry:verify
```

本地 URL 为 `http://localhost:5173/r/ylf-button.json`。生成文件位于 `packages/public/r`，部署文档站后会原样发布。

## 源码与生成物

`registry.json` 只声明分发关系，组件源码仍来自包内的权威文件：

```text
packages/vue/components/YlfButton.vue ──┐
                                       ├─ shadcn-vue build → packages/public/r/ylf-button.json
packages/ui/styles/css-vars.scss ──────┘
```

因此修改按钮或 token 后重新构建即可，不需要同步维护 Registry 专用副本。

## Pilot 通过标准

1. Registry JSON 可由 `shadcn-vue 2.8.0` 构建并被 URL 安装。
2. 作为 universal item 安装时不要求 Tailwind 或 `components.json`，文件只写入约定的 `src` 目录。
3. token 文件安装到明确路径，明暗主题和组件兜底值都可工作。
4. 在最小 Vue + Vite 项目中通过类型检查和生产构建。
5. Registry 生成物与包内权威源码保持一致。

通过后，下一项应选择基于 Reka UI 的 `Dialog`，用于验证 npm 依赖、Portal、焦点管理和键盘交互。再之后才评估 Data Table、登录页等真正适合复制源码的 Blocks。
