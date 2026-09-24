---
outline: deep
---

# 色彩与组件

晴空蓝是云乐坊的识别色，也是默认强调色。多巴胺色板通过明黄、青、珊瑚橙、桃粉和鲜绿增加乐趣，以纯色块和明确的用途取代紫粉极光。

## 试试共享配色

预览默认使用晴空蓝，重置后也回到晴空蓝。选择强调色和强调样式，按钮、徽标和卡片会一起改变；切换夜空模式，检查同一组 token 在暗色下的效果。

<div class="vp-raw">
  <DesignPlayground />
</div>

## 色板与用途

| 色彩           | 原始值    | 角色                                   |
| -------------- | --------- | -------------------------------------- |
| 晴空蓝 `blue`  | `#2563eb` | 默认强调、品牌、主操作、链接与选中状态 |
| 明黄 `sun`     | `#facc15` | 精选、推荐、趣味强调                   |
| 青色 `cyan`    | `#06b6d4` | 工具与探索内容                         |
| 珊瑚橙 `coral` | `#ff6b4a` | 活动与参与入口                         |
| 桃粉 `pink`    | `#ec4899` | 创作与表达                             |
| 鲜绿 `green`   | `#22c55e` | 完成与积极反馈                         |

这些用途提供一致的起点。成功、提醒、错误和信息使用同一套色板的固定映射，不根据页面选中的强调色变化。一个区域优先一到两种强调色；配色样本与组件展示可以并列比较多种颜色。

## Token 的三个层次

```text
原始色：--ylf-palette-sun = #facc15
    ↓
用途色：--ylf-accent-sun / -hover / -soft / -text / -on
    ↓
组件上下文：data-ylf-tone="sun" → --ylf-accent / -hover / -soft / -text / -on
    ↓
Button、Badge、Card、Switch、Progress、Separator
```

| Token                                         | 用途                                         |
| --------------------------------------------- | -------------------------------------------- |
| `--ylf-palette-{tone}`                        | 原始纯色，用于插图或色板                     |
| `--ylf-accent-{tone}`                         | 纯色填充                                     |
| `--ylf-accent-{tone}-hover`                   | 填充色的悬停状态                             |
| `--ylf-accent-{tone}-on`                      | 纯色及其悬停色上的配套前景文字               |
| `--ylf-accent-{tone}-soft`                    | 浅色语义表面，暗色主题中切换为对应的深色表面 |
| `--ylf-accent-{tone}-text`                    | 对应 soft 表面上的可读文字                   |
| `--ylf-c-feature / feature-bg / feature-text` | 精选装饰、精选底色和中性文字                 |

原始蓝色为 `--ylf-palette-blue`；`--ylf-accent-blue` 色组引用可随主题切换的品牌 token，与 `--ylf-c-brand` 保持一致。默认 `--ylf-accent*` 上下文也使用这组晴空蓝。不要直接把明黄或青色作为白底上的小字号文字，也不要用 `--ylf-c-text-on-accent` 代替新强调色的 `-on`：它属于主色操作。

浅色和深色都保持鲜明的纯色。晴空蓝在深色主题中随品牌色提亮；辅助色的变化集中在浅底及其文字，避免深色模式把所有颜色都压灰。明暗值在 `@yunlefun/ui/styles/css-vars.scss` 维护，不在业务组件中复制。

## 状态也来自同一套色板

| 状态           | 共享色组       | 实色填充               | 填充上的文字              |
| -------------- | -------------- | ---------------------- | ------------------------- |
| 成功 `success` | 鲜绿 `green`   | `--ylf-status-success` | `--ylf-status-success-on` |
| 提醒 `warning` | 明黄 `sun`     | `--ylf-status-warning` | `--ylf-status-warning-on` |
| 错误 `danger`  | 珊瑚橙 `coral` | `--ylf-status-danger`  | `--ylf-status-danger-on`  |
| 信息 `info`    | 青色 `cyan`    | `--ylf-status-info`    | `--ylf-status-info-on`    |

状态 token 是强调色组的语义别名，同时提供 `-hover`、`-soft`、`-text`。按钮和徽标共用实色与 `-on`；提示面板可使用 `-soft` 搭配 `-text`。旧 `--ylf-c-success / warning / danger / info` 作为文字色别名保留，实色背景请迁移到对应的 `--ylf-status-*`，并搭配 `-on`。

晴空蓝实底在浅色主题使用白字，深色主题使用深蓝字。其他色组根据底色选择同色相的深色：明黄配深棕、青色配深青、珊瑚橙配深赭、桃粉配深莓、鲜绿配深绿。亮色底上不统一使用白字；所有实色、悬停色和浅底的配套文字都通过至少 4.5:1 的对比度检查。

状态徽标附带勾、感叹号、叉或信息符号，并保留明确的状态文字。图形是装饰性辅助，屏幕阅读器只读取标签文字。

## 公共组件接口

`@yunlefun/vue` 导出 `YlfAccentTone` 与 `YlfColorAppearance` 类型。六种组件共用 `tone="blue | sun | cyan | coral | pink | green"`，默认 `blue`（晴空蓝）；`tone` 用于 `accent`，以及 Card 的 `tinted`，不覆盖品牌主色和固定状态映射。

按钮和徽标的强调色与状态变体共用 `appearance="solid | soft | outline"`：实色用在重点入口，柔色用于分类与辅助内容，描边用于次级操作。改变强调程度不会改变语义色。描边的文字适合标准明暗表面或同色柔色表面；图片及未知背景需要单独检查对比度。

| 组件           | 新接口                                              | 表达方式                     |
| -------------- | --------------------------------------------------- | ---------------------------- |
| `YlfButton`    | `variant="accent"` + `tone`                         | 纯色按钮，前景随色组匹配     |
| `YlfBadge`     | `variant="accent"` + `tone`                         | 紧凑的纯色内容标签           |
| `YlfBadge`     | `variant` 取 `success`、`warning`、`danger`、`info` | 同色板实色状态标签与辅助图形 |
| `YlfBadge`     | `variant="featured"`                                | 明黄星芒、浅黄底与中性文字   |
| `YlfCard`      | `variant="accent"` 或 `tinted`，配合 `tone`         | 纯色顶边或柔色内容表面       |
| `YlfSwitch`    | `variant="accent"` + `tone`                         | 选中轨道与配套滑块色         |
| `YlfProgress`  | `variant="accent"` + `tone`                         | 实色进度条                   |
| `YlfSeparator` | `variant="accent"` + `tone`，或 `spectrum`          | 单色分隔或六段纯色拼接       |

```vue
<script setup lang="ts">
import type { YlfAccentTone } from '@yunlefun/vue'
import YlfBadge from '@yunlefun/vue/components/YlfBadge.vue'
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
import YlfCard from '@yunlefun/vue/components/YlfCard.vue'

const tone: YlfAccentTone = 'coral'
</script>

<template>
  <YlfCard variant="accent" :tone="tone" :hoverable="false">
    <YlfBadge variant="featured">
      精选
    </YlfBadge>
    <h2>周末创作活动</h2>
    <YlfButton variant="accent" :tone="tone">
      参与活动
    </YlfButton>
  </YlfCard>
</template>
```

仍需在应用入口加载 `@yunlefun/ui/css` 或 SCSS 入口 `@yunlefun/ui/styles`；Nuxt 自动导入方式见[开始使用](/guide/)。`YlfAccentTone` 是类型导入，不会把包根目录的 Node 工具带入浏览器。

## 原生 HTML 与其他框架

同一组上下文也能供 Vue 之外的页面使用。`data-ylf-tone` 必须和实际消费变量的元素处于同一个明暗主题范围中。

```html
<div class="category" data-ylf-tone="cyan">工具</div>
```

```scss
@use '@yunlefun/ui/styles';

.category {
  color: var(--ylf-accent-text);
  background: var(--ylf-accent-soft);
  border: 1px solid var(--ylf-accent);
  padding: var(--ylf-space-2) var(--ylf-space-3);
  border-radius: var(--ylf-radius-sm);
}
```

如果在颜色上下文内部再切换局部明暗主题，需要在内部元素重新设置 `data-ylf-tone`，让派生变量按新的主题解析。

## 让页面缤纷，也保持层级

- 阅读、设置和表单：以中性表面为底，实色标出主操作，柔色标出分组。
- 探索、创作与活动：允许多个分类色并列，用 `tinted` 卡片扩大色彩面积，保持正文清晰。
- 品牌页：可以加入 `spectrum` 分隔、全色板展示；六段色来自 `--ylf-spectrum-stops`，没有额外的渐变配色。
- 同一种分类在按钮、徽标和卡片间使用同一 `tone`；错误等状态始终使用固定的语义变体。

## 从极光迁移

| 旧调用                                           | 新调用                         |
| ------------------------------------------------ | ------------------------------ |
| Button / Switch / Progress 的 `variant="aurora"` | `variant="accent" tone="blue"` |
| Badge 的 `variant="aurora"`                      | `variant="featured"`           |
| Card 的 `variant="gradient"`                     | `variant="accent" tone="blue"` |

旧值暂时作为新外观的别名，文档示例全部使用新接口。旧 `--ylf-gradient-aurora` 仅提供单色兼容值，`--ylf-aurora-*` 映射到新色板；新代码使用 `accent` 或 `feature` token。文档默认入口不加载旧极光动画。

源码与 Registry 已采用新规范；npm 发布、应用依赖升级与线上部署仍按[应用迁移](/guide/migration)分别推进。
