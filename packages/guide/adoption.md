---
outline: deep
---

# 公共使用与发布

YunLeFun Design 当前可作为 Web 产品的设计基础试用：共享 token、明暗主题、Vue 组件与源码分发已经接通。`@yunlefun/ui@0.0.3` 和 `@yunlefun/vue@0.1.2` 已发布到 npm，主站已通过包入口复用 token；文档站仍展示开发中的源码，消费时应固定已验证的版本。

## 公共接口

| 层        | 入口                                                                     | 契约                                                      |
| --------- | ------------------------------------------------------------------------ | --------------------------------------------------------- |
| 设计基础  | `@yunlefun/ui/css`                                                       | 编译好的 CSS，包含 `--ylf-*` 与明暗主题，不加载字体或框架 |
| 可选背景  | `@yunlefun/ui/patterns.css`                                              | 网格与晴空类；先加载设计基础，再按需引用                  |
| SCSS 源码 | `@yunlefun/ui/styles`                                                    | 与 CSS 同源，需要 Sass；入口二选一                        |
| Vue 组件  | `@yunlefun/vue/components/*.vue`                                         | 显式导入，使用 props、slots、events 和 v-model            |
| 公共类型  | `import type { YlfAccentTone, YlfColorAppearance } from '@yunlefun/vue'` | 色相与强调程度的公共类型                                  |
| Nuxt      | `@yunlefun/vue/nuxt`                                                     | 组件自动导入，样式由应用主动加载                          |

Vue 组件仍以带 SCSS 的 SFC 分发，消费构建需要 Vue 和 Sass；CSS-only 项目不需要安装它们。包根目录的运行时工具用于组件目录定位，浏览器中按组件路径导入。

## 一致的视觉接口

`variant` 描述用途，`tone` 描述强调色，`appearance` 描述强调程度。后两者的适用范围由组件文档明确规定，不能用 `tone` 改写错误或成功的含义。

```vue
<YlfCard variant="tinted" tone="pink" :hoverable="false">
  <YlfBadge variant="accent" tone="pink" appearance="soft">创作</YlfBadge>
  <h2>给灵感一点空间</h2>
  <YlfButton variant="accent" tone="pink" appearance="outline">查看作品</YlfButton>
</YlfCard>
```

实色、柔色和描边共用同一组前景与背景 token。布局仍由应用决定，卡片不绑定用户、商品或活动数据，按钮也不承担请求与权限判断。

## 明暗主题与定制

全局可在根元素设置 `.dark`；局部区域使用 `.ylf-theme-light` 或 `.ylf-theme-dark`。浮层应放在相同主题边界中，参考 Dialog 和 Demo 画布的 Portal 用法。

```html
<section class="ylf-theme-dark">
  <div data-ylf-tone="cyan" class="category">工具</div>
</section>
```

自定义外观时，覆盖公开 token，避免依赖组件的 `--_` 内部变量或 DOM 层级。变更一种强调色时，同步审查填充、悬停、`-on`、`-soft` 和 `-text` 五个值，并分别验证明暗模式。仅在子元素覆盖原始 palette 值，不会自动重算祖先已经解析的别名；在主题边界覆盖完整用途色组，或在根主题定义色板。

不要用全局 `button`、`span` 或 `svg` 选择器给组件改皮肤。组件样式通过 `ylf-*` 类组织，token CSS 不包含全局重置，便于与已有应用共存。

## 当前成熟度

| 范围     | 已具备                                                          | 正式推广前仍需完成                                     |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------ |
| 视觉规范 | 六色色板、用途色、状态色、三档强调程度、明暗主题、排版与间距    | 在不同内容密度的产品页面中验证视觉层级                 |
| 基础分发 | CSS/SCSS 同源构建，Vue/Nuxt 接入，Registry 同源生成，npm 已发布 | 持续维护变更记录与线上产物验收                         |
| 组件行为 | Reka UI 负责复杂行为；已有 Dialog、Demo 和分发测试              | 对全部组件逐项完成键盘、焦点、可访问名称与错误状态审查 |
| 使用范围 | 文档站复用真实组件；主站已接入共享 token 和统一色彩接口         | 在另一个真实应用完成接入验收                           |
| 组件覆盖 | 按钮、徽标、卡片、选择与浮层等基础组件                          | 按真实需求补输入框、文本域、字段错误、空状态和组合表单 |
| 设计协作 | 代码 token 与在线规范                                           | 尚无同步的 Figma 组件库、设计变量导出或原生平台产物    |

目前适合发布为明确标注试用范围的早期版本。不要把所有组件都视为已完成无障碍认证，也不要因为一个 Demo 正常就承诺全部业务场景可用。

## 发布验收

1. 明确本次发布的组件范围，整理公共 API、主题 token 与旧值迁移说明。
2. 运行 `pnpm lint`、`pnpm typecheck`、`pnpm docs:build` 和 `pnpm exec vitest run`。
3. 运行 `pnpm ui:verify`：真正打包样式包，在不安装 Sass 的独立项目中解析 CSS 入口并构建。
4. 运行 `pnpm build:vue`、`pnpm nuxt:verify`、`pnpm registry:verify` 验证相应分发入口。
5. 人工核对键盘操作、焦点、390px 与 768px 布局、明暗主题、长文本和禁用状态。
6. 发布后用确切版本重新接入消费项目，检查线上文档和 Registry，再推广到应用。

组件接口与 token 都属于版本化契约。删除或更改语义要提供迁移说明；旧别名标注废弃期。复制 Registry 源码的应用需自行合并更新，不能假定会随 npm 升级同步。
