---
outline: deep
---

# 子包职责

`YunLeFun/design` 是一个 pnpm 工作区。包的职责与目录名称相关，但不是每个目录都是可安装的 npm 包。

## 当前包和目录

| 包或目录                                   | 作用                                                         | 使用者与当前状态                                 |
| ------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |
| `@yunlefun/ui` · `packages/ui`             | 共享颜色、字体角色、圆角、阴影、主题变量；可选字体加载       | Web 应用的样式基础，已有包导出配置               |
| `@yunlefun/vue` · `packages/vue`           | `YlfButton`、`YlfDialog` 等 Vue 组件，以及 Nuxt 组件自动导入 | Vue / Nuxt 应用，已有构建和发布脚本              |
| `@yunlefun/ui-utils` · `packages/utils`    | 不依赖 Vue 的 DOM 工具，目前主要是 `previewElement`          | 实验性源码工具；尚无完整的构建、类型和包导出配置 |
| `@yunlefun/metadata` · `packages/metadata` | 生成组件名称、标题、说明和更新时间的索引                     | 私有内部包，供文档导航与构建使用                 |
| `packages/css`                             | pulse、animation、aurora 等样式示例和文档站效果              | 没有 `package.json`，不是独立 npm 包             |
| `registry.json` 与 `packages/public/r`     | 声明并生成可通过 URL 安装的组件源码                          | 分发渠道，不是另一套组件实现                     |
| `@yunlefun/design-monorepo`                | 管理构建、验证与工作区依赖                                   | 私有根包，业务应用不安装                         |

表中的“已有发布配置”描述仓库能力，不代表本地最新改动已经发布到 npm。

## `@yunlefun/ui`：设计基础

这个包当前提供 SCSS 文件，业务项目需要 Sass 编译支持。它不包含 Vue 组件，也不导入 Vue、路由、认证 SDK 或业务 API。

```bash
pnpm add @yunlefun/ui
pnpm add -D sass
```

```scss
@use '@yunlefun/ui/styles';
```

基础入口只加载 token。需要品牌展示字体时再选择 `@yunlefun/ui/styles/fonts` 或自行托管字体；字体角色和加载方式见[字体规范](/guide/typography)。

目前 token 直接维护在 SCSS 中，尚无独立的 JSON token 包或原生平台生成器。只有当第二种平台确实需要生成产物时，再考虑独立拆出 tokens 包。

## `@yunlefun/vue`：Vue 组件实现

组件接收展示数据和交互状态，通过 props、slots、events 和 `v-model` 与业务应用协作。焦点管理、键盘操作与浮层行为优先复用 Reka UI。

- 组件源码从 `@yunlefun/vue/components/YlfButton.vue` 等子路径导入。
- Nuxt 通过 `@yunlefun/vue/nuxt` 注册组件；应用仍需主动加载共享 token。
- 根入口当前主要导出类型和组件目录信息，不提供全部 `Ylf*` 组件的命名导出。
- `@yunlefun/ui` 由业务应用一同安装和加载，目前不是 Vue 包自动注入的样式依赖。

可执行的接入示例见 [Vue 组件](/vue/)。

## `@yunlefun/ui-utils`：小型 DOM 工具

`previewElement` 通过 DOM 操作放大预览元素，运行时需要浏览器环境。“与框架无关”不等于可在服务端执行，也不意味着已经拥有完整的焦点、键盘和对话框行为。

当前文档示例直接引用源码。补齐打包入口、类型声明和行为验证之前，不把这个包列为业务应用的必装依赖。需要正式弹窗时优先使用 `YlfDialog`。

## `@yunlefun/metadata`：内部文档索引

构建脚本读取 `packages/vue/components/*/index.md` 的元信息及示例的 Git 更新时间，生成组件索引。文档站据此建立侧边栏、组件说明和预览入口。

```bash
pnpm run update
```

使用 `run` 明确执行工作区生成脚本，避免与包管理器的依赖升级命令混淆。

它不提供主题、图标或用户业务数据，也不要求业务应用安装。新增组件应修改源文档与示例，不手改生成索引。

## 样式目录与 Registry

`packages/css` 当前由文档站直接引用。未来成熟的通用效果可以收敛到 `@yunlefun/ui` 的可选样式子路径，实验效果继续作为示例；不同时维护两份主题值。

Registry 当前生成 `ylf-tokens`、`ylf-button`、`ylf-dialog` 三个条目，源码来自 `ui` 和 `vue` 包。通过 npm 使用组件便于集中升级；通过 Registry 复制源码后，调用方负责合并后续更新。详细边界见 [Registry 分发](/guide/registry)。

## 依赖和业务边界

```text
应用 ──→ @yunlefun/ui（样式）
应用 ──→ @yunlefun/vue ──→ Reka UI + Vue（交互）
文档 ──→ ui + vue + metadata + css 示例
Registry ──→ 从 ui / vue 的权威源码生成
```

业务应用负责登录请求、权限、支付、应用数据和埋点。设计系统提供表单布局、加载状态、错误提示和交互控件；只有在多个真实场景中验证过的组合，才成为通用页面模块。
