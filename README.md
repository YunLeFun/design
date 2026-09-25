# YunLeFun Design

![CI](https://github.com/YunLeFun/design/actions/workflows/ci.yml/badge.svg) · [MIT 许可证](./LICENSE) · [贡献指南](./CONTRIBUTING.md) · [安全报告](./SECURITY.md)

云乐坊设计系统，统一维护设计原则、品牌视觉、交互规范与可复用 UI 实现。默认视觉为**晴空蓝为主，高饱和纯色点缀**。

## Design 与 UI

**Design** 描述产品如何组织信息、表达品牌并提供一致体验；**UI** 是这些设计规则在界面中的实现。仓库名 `design` 表达整个体系，npm 包名表达具体用途。

- [设计体系](./packages/guide/design-system.md)：术语、层次、品牌方向与权威来源。
- [子包职责](./packages/guide/packages.md)：每个包的用途、接入方式与成熟度。
- [视觉基础](./packages/guide/foundations.md)：颜色、字体、布局、交互与明暗主题。
- [色彩与组件](./packages/guide/colors.md)：多巴胺色板、成组 token 与共享组件接口。
- [公共使用与发布](./packages/guide/adoption.md)：接入契约、当前成熟度与发布验收。
- [应用迁移](./packages/guide/migration.md)：主站及其他应用的接入顺序与剩余差异。

## 子包与目录

| 包或目录             | 作用                                | 状态                                    |
| -------------------- | ----------------------------------- | --------------------------------------- |
| `@yunlefun/ui`       | 与 Vue 无关的 CSS / SCSS 和设计变量 | 共享样式包                              |
| `@yunlefun/vue`      | `Ylf*` Vue 组件与 Nuxt 接入         | 共享组件包                              |
| `@yunlefun/ui-utils` | DOM 工具，目前主要是元素预览        | 实验性源码，发布入口尚未完善            |
| `@yunlefun/metadata` | 生成组件索引，支持文档导航和构建    | 源码公开，不发布到 npm                  |
| `packages/css`       | 动画等样式示例                      | 普通目录，不是 npm 包                   |
| Registry             | 从共享源码生成可复制条目            | 分发渠道，目前有 tokens、Button、Dialog |

`@yunlefun/design-monorepo` 设置了 `private: true` 以防止误发到 npm；这不限制仓库源码的 MIT 开源许可。源码中的新主题需要经过包发布和应用升级后才会进入业务站点。

## 使用

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用入口加载共享 token，CSS 与 SCSS 入口任选一个：

```ts
import '@yunlefun/ui/css'
```

```scss
@use '@yunlefun/ui/styles';
```

Vue 组件从明确的子路径导入；Nuxt 可通过模块注册组件。完整示例见[开始使用](./packages/guide/index.md)与 [Vue 接入](./packages/vue/index.md)。

仅使用 CSS token 的项目不需要安装 Vue 或 Sass；Vue SFC 组件仍需要 Sass。当前公开版本为 `@yunlefun/ui@0.0.4` 和 `@yunlefun/vue@0.1.3`；主站已从 npm 包复用共享 token。

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
pnpm ui:verify
```

组件或 token 变更后，由 `pnpm registry:build` 更新分发产物。更多边界见[架构](./packages/guide/architecture.md)与 [Registry 分发](./packages/guide/registry.md)。

## 开源协作与发布

欢迎通过 Issue 和 Pull Request 参与改进。行为规范见[社区行为准则](./CODE_OF_CONDUCT.md)，漏洞请按[安全策略](./SECURITY.md)私下报告。公共组件仍处于早期版本，支持范围和验收要求见[公共使用与发布](./packages/guide/adoption.md)。

维护者通过带 `release-` 前缀的 Git 标签触发 npm Trusted Publishing；两个包共用 [OIDC 发布工作流](./.github/workflows/release.yml)，不使用长期 npm 发布令牌。版本准备、信任关系配置与验证步骤见[发布指南](./RELEASING.md)。
