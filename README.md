# YunLeFun Design

云乐坊设计系统，统一维护设计原则、品牌视觉、交互规范与可复用 UI 实现。默认视觉为**晴空蓝为主，极光点缀**。

## Design 与 UI

**Design** 描述产品如何组织信息、表达品牌并提供一致体验；**UI** 是这些设计规则在界面中的实现。仓库名 `design` 表达整个体系，npm 包名表达具体用途。

- [设计体系](./packages/guide/design-system.md)：术语、层次、品牌方向与权威来源。
- [子包职责](./packages/guide/packages.md)：每个包的用途、接入方式与成熟度。
- [视觉基础](./packages/guide/foundations.md)：颜色、字体、布局、交互与明暗主题。
- [应用迁移](./packages/guide/migration.md)：主站及其他应用的接入顺序与剩余差异。

## 子包与目录

| 包或目录             | 作用                              | 状态                                    |
| -------------------- | --------------------------------- | --------------------------------------- |
| `@yunlefun/ui`       | 与 Vue 无关的 SCSS 样式和设计变量 | 共享样式包                              |
| `@yunlefun/vue`      | `Ylf*` Vue 组件与 Nuxt 接入       | 共享组件包                              |
| `@yunlefun/ui-utils` | DOM 工具，目前主要是元素预览      | 实验性源码，发布入口尚未完善            |
| `@yunlefun/metadata` | 生成组件索引，支持文档导航和构建  | 私有内部包                              |
| `packages/css`       | 动画、极光等样式示例              | 普通目录，不是 npm 包                   |
| Registry             | 从共享源码生成可复制条目          | 分发渠道，目前有 tokens、Button、Dialog |

`@yunlefun/design-monorepo` 是私有根包，不供业务安装。源码中的新主题需要经过包发布和应用升级后才会进入业务站点。

## 使用

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用样式入口加载共享 token：

```scss
@use '@yunlefun/ui/styles';
```

Vue 组件从明确的子路径导入；Nuxt 可通过模块注册组件。完整示例见[开始使用](./packages/guide/index.md)与 [Vue 接入](./packages/vue/index.md)。

## 开发与文档

文档和 Registry 目前部署在 [ui.yunle.fun](https://ui.yunle.fun)。仓库改名与域名迁移分别管理。

```bash
pnpm install
pnpm docs:dev
```

```bash
pnpm lint
pnpm typecheck
pnpm exec vitest run
pnpm docs:build
```

组件或 token 变更后，由 `pnpm registry:build` 更新分发产物。更多边界见[架构](./packages/guide/architecture.md)与 [Registry 分发](./packages/guide/registry.md)。
