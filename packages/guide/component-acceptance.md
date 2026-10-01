---
outline: deep
---

# 组件验收

2026-10-01，`@yunlefun/vue@0.4.0` 完成当前 15 个 Reka UI 封装的基础验收。范围是现有组件的公开接口、键盘与焦点、可访问名称、明暗主题和分发；组件新增仍按实际产品需求决定。

## 验收环境与结果

- Chromium，桌面 1280px、平板 768px、手机 390px；每个组件分别检查浅色与深色，共 90 个组合场景。
- 对组件预览运行 axe 的 WCAG 2 A、AA 与 WCAG 2.1 AA 规则；另外检查展开后的 Dialog、Popover、Select、Dropdown Menu 和 Tooltip。
- 真实浏览器验证键盘选值、禁用项跳过、Dialog 焦点陷阱、Escape 关闭、触发器焦点恢复、原生 FormData 和局部主题 Portal。
- 触摸模式检查 Dialog 关闭按钮、菜单项和 Slider 操作区域；减少动态效果时检查 Progress 和 Slider。
- 85 项 Vitest 回归测试、类型检查、lint、Nuxt 构建、文档构建、Registry 安装与独立消费项目构建通过。
- 全部 22 个 `Ylf*` 组件从 npm tarball 的公开子路径导入后，在独立 Vue / Vite 项目中通过类型检查和构建。

本轮浏览器验收覆盖 Chromium。Safari、Firefox、屏幕阅读器实机与业务应用特有的表单和主题配置仍需在接入环境中验证。

## 组件与公开行为

| 组件              | 已验证的行为                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Accordion         | 单开 / 多开、收起、命名插槽、禁用项、Home / End 焦点导航                                      |
| Avatar            | 图片替代文字、缺图回退、回退图像的完整名称                                                    |
| Checkbox          | 三态 ARIA、Space 切换、标签关联、禁用、原生表单值                                             |
| Dialog            | 标题与描述关联、隐藏标题、焦点陷阱、Escape / 遮罩 / 关闭按钮、焦点恢复、属性透传、局部 Portal |
| Dropdown Menu     | 方向键、Home / End、禁用项、空字符串选值、受控开关、属性透传、局部 Portal                     |
| Popover           | 开关状态、Escape、内容属性与名称、局部 Portal                                                 |
| Progress          | 数值与视觉一致、范围限制、无效上限、未知进度、减少动态效果                                    |
| RadioGroup        | 选值、禁用、组名、快速按方向键、焦点与选值同步、禁用项跳过                                    |
| Segmented Control | 点击当前项保持选择、方向键、Space、禁用、图标名称、计数对比度                                 |
| Select            | 选值、键盘、禁用、触发器名称、原生表单值与 required、局部 Portal                              |
| Separator         | 装饰与语义分节、垂直方向                                                                      |
| Slider            | 每个端点的名称、键盘步长与边界、禁用焦点、valueCommit、触摸操作、减少动态效果                 |
| Switch            | Space / Enter、受控状态、禁用、名称、原生表单值                                               |
| Tabs              | 标签与面板 ARIA 关联、方向键自动选中、禁用项、内容插槽                                        |
| Tooltip           | 触发器属性与名称、焦点展示、描述关联、Escape、禁用、局部 Portal                               |

## 本轮修复

Select 的 `name` 和 `required` 进入表单控件；浮层新增 `portalTo`，保持局部主题。Dialog、Popover、Dropdown Menu 的内容属性和 Tooltip 的触发器属性有明确的透传位置。

RadioGroup 在 Reka 完成焦点移动后同步选值，处理 2.10.x 中快速 keyup 可能跳过选值的情况；焦点移动和禁用项过滤继续由 Reka 管理。

Slider 为单值和区间端点提供名称；Checkbox 示例使用关联标签；Avatar 回退保留完整替代文字；分段选择器计数使用满足对比度的文字 token。Progress 对无效或未知数值提供一致的显示与 ARIA。

组件子路径新增预生成类型声明，避免独立 pnpm 消费项目检查原始 SFC 时无法解析内部 Reka 依赖。运行时继续分发可编译、可定制的 SFC，不改变现有导入路径。

## 视觉打磨（0.4.1）

共享控件、凹槽与浮层有独立的表面和阴影 token。按钮增加薄边与按压反馈，浮层使用顶部高光、磨砂与分层阴影；选择控件、Tabs 和 Accordion 强化选中状态。首页云景提供昼夜与浮层交互，Dialog 示例展示完整的作品保存场景。

本轮继续核对原有组件行为、明暗主题、390px / 768px / 桌面视口、文字对比度和减少动态效果。CSS 动画名称按组件区分，避免同时导入多个浮层后彼此覆盖。

## 重现与后续发布

```bash
pnpm lint
pnpm typecheck
pnpm exec vitest run
pnpm audit
pnpm ui:verify
pnpm vue:verify
pnpm nuxt:verify
pnpm registry:verify
pnpm docs:build
```

`vue:verify` 打包 UI 与 Vue，在独立项目中安装 tarball，导入全部组件，并编译使用只读选项、v-model 和表单属性的实际模板。Release 工作流包含此检查。

本地 Registry 验证用 CLI 从 URL 安装 Button 与 Dialog，核对源码一致性并构建消费项目。这两个组件使用内联 SVG；本地图标映射为空，不依赖第三方图标服务的可用性。

新增或修改公共组件时，更新对应回归测试与本文的范围，按[组件架构](/guide/architecture)继续验收。
