# 开始使用

YunLeFun UI 是云乐坊应用共享的 Vue 设计体系。稳定组件通过 npm 包统一维护，复杂交互由 Reka UI 提供行为和无障碍能力，视觉由 `--ylf-*` token 驱动。

## 安装

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用入口加载设计 token：

```scss
@use '@yunlefun/ui/styles';
```

Nuxt 项目可以注册组件自动导入：

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
})
```

## 从哪里开始

- 阅读[设计体系架构](/guide/architecture)，了解 Reka UI、YunLeFun 组件与 Registry 的职责。
- 使用 [Registry 分发](/guide/registry)，通过 URL 安装共享 token、`YlfButton` 或 `YlfDialog` 源码。
- 在 [Vue 组件](/vue/)中查看实时 Demo；每个预览都可以独立切换明暗主题和设备宽度。
- 阅读[字体规范](/guide/typography)，按需加载展示字体。
