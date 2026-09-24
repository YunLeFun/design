# 开始使用

YunLeFun Design 是云乐坊应用共享的设计系统，统一维护设计规范、品牌视觉与 UI 实现。Vue 组件通过 npm 包统一维护，复杂交互由 Reka UI 提供行为和无障碍能力，视觉由 `--ylf-*` token 驱动。

仅接入设计 token 的项目可以使用 CSS 入口，不依赖 Vue 或 Sass；Vue 组件目前以 SFC 分发，构建仍需要 Sass。公共接入范围与发布标准见[公共使用与发布](/guide/adoption)。

## 安装

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用入口加载设计 token，任选 CSS 或 SCSS：

```ts
import '@yunlefun/ui/css'
```

```scss
@use '@yunlefun/ui/styles';
```

Nuxt 项目可以注册组件自动导入：

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/styles'],
})
```

新 CSS 入口及强调样式对应当前源码，使用前需确认安装包已包含这些改动。本地源码可以通过工作区引用或 `pnpm -C packages/ui pack` 试用。

## 从哪里开始

- 阅读 [Design 与 UI](/guide/design-system)，理解设计系统、样式包和组件库的关系。
- 阅读[子包职责](/guide/packages)，区分共享包、实验工具和内部构建工具。
- 阅读[视觉基础](/guide/foundations)，使用晴空蓝主色、字体角色和明暗主题。
- 阅读[色彩与组件](/guide/colors)，复用高饱和纯色 token 与组件的 `tone` 接口。
- 阅读[品牌与界面](/guide/patterns)，了解云景、品牌标志、页面构图与文档体验。
- 在 [Vue 接入](/vue/)中查看显式导入与 Nuxt 模块的完整示例。
- 阅读[设计体系架构](/guide/architecture)，了解 Reka UI、YunLeFun 组件与 Registry 的职责。
- 使用 [Registry 分发](/guide/registry)，通过 URL 安装共享 token、`YlfButton` 或 `YlfDialog` 源码。
- 在 [Vue 组件](/vue/)中查看实时 Demo；每个预览都可以独立切换明暗主题和设备宽度。
- 阅读[字体规范](/guide/typography)，按需加载展示字体。
- 已有应用按[迁移指南](/guide/migration)逐步接入，区分源码更新、包发布与线上部署。
