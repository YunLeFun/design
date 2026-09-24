# YunLeFun Design

云乐坊设计系统，统一维护设计规范、品牌视觉、设计变量与可复用 UI 组件。

## Packages

| Package              | Purpose                             |
| -------------------- | ----------------------------------- |
| `@yunlefun/ui`       | Shared styles and design tokens     |
| `@yunlefun/vue`      | Vue components and Nuxt integration |
| `@yunlefun/ui-utils` | UI utilities                        |

The repository is named `design`; published package names describe their implementation and remain unchanged.

## Install

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

Load the shared design tokens in your application:

```scss
@use '@yunlefun/ui/styles';
```

See the [getting started guide](./packages/guide/index.md) and [design system architecture](./packages/guide/architecture.md) for component usage and integration.

## Documentation

The documentation and component registry are currently served at [ui.yunle.fun](https://ui.yunle.fun).

```bash
pnpm install
pnpm docs:dev
```
