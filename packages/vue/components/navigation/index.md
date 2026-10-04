---
title: Navigation
title_zh: 站点导航
description: 有呼吸感的站点导航，区分当前位置、悬停和键盘焦点，支持路由链接与站点切换。
---

`YlfNavigation` 组织链接，`YlfNavigationLink` 标记当前页面，`YlfNavigationTrigger` 为站点切换等下拉菜单提供统一入口。适合官网、内容站和应用页头；页内面板切换请使用 Tabs。

## 间距与状态

- 所有入口至少 44px 高；正文 14px / 500；水平链接间距 8px，垂直链接间距 4px。
- 默认中性文字，悬停使用中性浅底；当前页为晴空蓝，水平导航增加 16×2px 短线，垂直导航使用浅蓝底。
- 键盘焦点使用内收 2px 轮廓，不替代当前页标记，也不向相邻入口扩张。
- 水平导航默认用同一条下划线随 `active` 移动，过渡读取 `--ylf-duration-normal`（240ms）与 `--ylf-ease-standard`。快速连续切换会从当前位置转向新目标；布局换行、链接尺寸变化时重新对齐。首次出现不从左侧飞入，无当前页时隐藏，垂直导航保留背景标记。减少动态效果时即时定位，也可用 `:animated="false"` 保留静态下划线。
- 品牌与站点切换建议间隔 12px，品牌组与导航建议间隔 16px。页头高度、响应式断点及账户区域由应用布局决定。
- 颜色、圆角、字号与动效读取共享 token；支持局部主题及减少动态效果。

## 接入

```vue
<script setup lang="ts">
import YlfNavigation from '@yunlefun/vue/components/YlfNavigation.vue'
import YlfNavigationLink from '@yunlefun/vue/components/YlfNavigationLink.vue'
import '@yunlefun/ui/css'
</script>

<template>
  <YlfNavigation label="主导航">
    <YlfNavigationLink href="/docs">
      帮助
    </YlfNavigationLink>
    <YlfNavigationLink href="/blog" active>
      博客
    </YlfNavigationLink>
  </YlfNavigation>
</template>
```

Nuxt / Vue Router 使用 `as-child` 将样式、当前页语义和事件合并到单个链接，避免嵌套 `<a>`。应用负责计算 `active`，每组仅一个当前页。路由、认证请求和埋点不进入设计组件。

```vue
<YlfNavigationLink :active="route.path.startsWith('/blog')" as-child>
  <NuxtLink to="/blog">博客</NuxtLink>
</YlfNavigationLink>
```

`YlfNavigationTrigger` 放进 `YlfDropdownMenu` 的 `trigger` 插槽，或 Reka `DropdownMenuTrigger as-child`。菜单负责开关状态、`aria-expanded`、焦点恢复与键盘操作；按钮读取这些属性绘制展开状态，不维护第二份 `open`。

```vue
<YlfDropdownMenu :items="sites" @select="switchSite">
  <template #trigger>
    <YlfNavigationTrigger>官网</YlfNavigationTrigger>
  </template>
</YlfDropdownMenu>
```

水平导航允许换行。手机页头需要收起时，由应用在自己的断点切换到有可访问名称的抽屉，在抽屉内使用 `orientation="vertical"`；不在公共组件内硬编码屏幕宽度或业务链接。

## Props

### YlfNavigation

| 属性          | 说明                                   | 类型                     | 默认值       |
| ------------- | -------------------------------------- | ------------------------ | ------------ |
| `label`       | 必填的可访问名称，同页多个导航应可区分 | `string`                 | —            |
| `orientation` | 排列方向与当前页标记样式               | `horizontal \| vertical` | `horizontal` |
| `animated`    | 水平当前页下划线的移动动画             | `boolean`                | `true`       |

### YlfNavigationLink

| 属性      | 说明                                 | 类型      | 默认值  |
| --------- | ------------------------------------ | --------- | ------- |
| `active`  | 当前页面，输出 `aria-current="page"` | `boolean` | `false` |
| `asChild` | 将属性合并到插槽的单个链接           | `boolean` | `false` |

`href`、`target`、`rel`、可访问属性和事件透传到实际链接。不要给不可访问的页面伪造禁用链接：根据产品需求隐藏入口或显示说明。

### YlfNavigationTrigger

| 属性       | 说明           | 类型      | 默认值  |
| ---------- | -------------- | --------- | ------- |
| `disabled` | 原生按钮禁用态 | `boolean` | `false` |

三个组件均提供默认插槽。Trigger 的插槽为按钮文案，箭头由组件绘制；其余原生属性与事件透传到按钮，默认 `type="button"`。

## 验收重点

用 Tab 顺序访问链接与触发器，Enter 打开链接或菜单，Escape 关闭菜单后焦点回到触发器。当前位置与相邻焦点应可同时辨认。检查浅色、深色、390px、768px 与桌面，手机入口保留 44px 点击高度。

视觉参考：[Header navigations — Untitled UI / Dribbble](https://dribbble.com/shots/17564385-Header-navigations-Untitled-UI)。规则来自云乐坊主站的实际导航验证，不复制参考稿的品牌或业务内容。
