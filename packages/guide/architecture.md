---
outline: deep
---

# 设计体系架构

YunLeFun Design 采用分层实现：Reka UI 负责复杂行为，YunLeFun 提供稳定接口和品牌视觉，业务应用只需要学习 `Ylf*` 组件。

Design 与 UI 的概念边界见[设计体系](/guide/design-system)，所有包的用途和成熟度见[子包职责](/guide/packages)。本页重点说明组件实现与分发边界。

```text
业务应用 / YunLeFun Blocks
          ↓
@yunlefun/vue：YlfButton、YlfDialog、YlfSelect…
          ↓
reka-ui：焦点、键盘、ARIA、Portal、浮层定位
          ↓
Vue / DOM

@yunlefun/ui/styles ── 为所有层提供 --ylf-* design tokens
```

## 各层职责

| 层                | 职责                                     | 稳定性             |
| ----------------- | ---------------------------------------- | ------------------ |
| `@yunlefun/ui`    | 色彩、字体、圆角、阴影、动效与主题 token | 稳定公共接口       |
| `@yunlefun/vue`   | 面向产品的 `Ylf*` 组件接口               | 稳定公共接口       |
| `reka-ui`         | 无样式 primitives 与复杂交互行为         | 内部实现依赖       |
| YunLeFun Registry | 页面片段、业务 Blocks、可复制代码        | 基础分发链路可发布 |

Reka UI 不应直接决定产品视觉，shadcn-vue 的默认 Tailwind 样式也不作为 YunLeFun 的主题来源。可以参考 shadcn-vue 的组合方式和 Registry 协议，但最终代码仍使用 YunLeFun token。

## 组件接口原则

### 常用场景保持简单

一个组件应该用尽量小的接口覆盖大部分产品场景。例如 `YlfSelect` 接收 `options`，调用方不需要理解浮层碰撞、首字母检索或键盘焦点。

```vue
<YlfSelect v-model="color" :options="colors" />
```

### 行为留在 Reka UI

需要焦点陷阱、键盘导航、Portal 或浮层定位时，优先组合 Reka UI primitives，不在 YunLeFun 中重新实现一套行为。

### 视觉只读取 token

组件样式应读取 `--ylf-*`，并提供合理兜底值。明暗主题通过 token 切换，组件内部不维护另一套颜色系统。

```scss
.ylf-example {
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-surface, #fff);
  border-radius: var(--ylf-radius, 14px);
}
```

### 不提前暴露所有 primitive

只有当产品中出现真实的组合需求时，才增加 compound interface 或内部 seam。不要机械地把每个 Reka part 都包装成公开 `Ylf*` 组件。

## 分发策略

基础组件继续通过 `@yunlefun/vue` 发布，以便统一修复行为和无障碍问题：

- Button、Dialog、Select、Checkbox、Tooltip 等基础控件；
- 品牌一致性要求高、调用接口稳定的模块；
- 需要随版本集中升级 Reka UI 的实现。

YunLeFun Registry 已通过共享 token、Button 和基于 Reka UI 的 Dialog 验证[分发链路](/guide/registry)。后续主要用于需要业务方取得源码并继续修改的内容：

- 登录、设置、导航等页面片段；
- Data Table、Date Picker、Command Menu 等组合模块；
- AI 对话、消息列表等产品 Blocks。

同一个基础控件不同时维护 npm 与复制代码两个权威版本。

Registry 从 npm 包对应的同一份源码生成。源码复制到应用后，后续更新由应用维护者合并；npm 用户则通过升级包获得修复。生成物可验证一致，不代表消费项目中的副本会自动同步。

## 文档与预览

组件文档由组件目录中的 `index.md` 与 `demo.vue` 自动生成。Demo 是文档、视觉回归和人工验收的共同样例：

```text
packages/vue/components/button/
├── demo.vue       # 可交互预览与使用示例
└── index.md       # 说明、Props、Slots、Events
```

每个预览支持：

- 独立切换浅色与深色 token，不改变整个文档站主题；
- Reka UI Portal 保留在对应画布内，浮层也继承所选主题；
- 自适应、768px 平板和 390px 手机画布；
- 查看实际 Demo 源码和 GitHub 文件；
- 在渲染失败时保留可见错误信息。

本地运行：

```bash
pnpm docs:dev
```

生产构建：

```bash
pnpm docs:build
```

## 新组件验收清单

1. 公共 props、slots 和 events 使用产品语言，而不是直接泄漏底层实现。
2. 复杂行为复用 Reka UI，并验证键盘操作、焦点顺序和可访问名称。
3. 所有颜色、圆角、阴影与字体来自 `--ylf-*` token。
4. `demo.vue` 能展示主要状态、禁用态和一个真实交互。
5. 在浅色、深色、390px 和 768px 预览中没有溢出或裁切。
6. 测试、类型检查和文档构建通过后再发布。
