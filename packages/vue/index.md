# Vue 组件

`@yunlefun/vue` 是 YunLeFun Design 的 Vue 实现。组件负责展示和交互，业务应用负责数据、登录、权限与支付流程。

## 安装与共享样式

```bash
pnpm add @yunlefun/ui @yunlefun/vue
pnpm add -D sass
```

在应用的 SCSS 入口中加载一次：

```scss
@use '@yunlefun/ui/styles';
```

再从应用入口导入该 SCSS 文件。品牌字体按需加载，见[字体规范](/guide/typography)。

## Vue / Vite：显式导入组件

```vue
<script setup lang="ts">
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
</script>

<template>
  <YlfButton>保存资料</YlfButton>
</template>
```

当前根入口不导出所有组件，不使用 `import { YlfButton } from '@yunlefun/vue'`。仓库也没有公开的 `YlfResolver`，不需要添加不存在的自动导入解析器。

## Nuxt：注册模块

```ts
export default defineNuxtConfig({
  modules: ['@yunlefun/vue/nuxt'],
  css: ['@yunlefun/ui/styles'],
})
```

模块注册 `Ylf*` 组件的自动导入，`css` 显式加载共享 token。这种接入不要求安装 UnoCSS、Pinia 或 VueUse 模块。

## 组件与主题

日常操作使用默认的晴空蓝主色。`variant="accent"` 也默认晴空蓝；精选内容可显式选择 `tone="sun"`，不要用装饰色替代成功、警告或错误语义。完整接口见[色彩与组件](/guide/colors)。

组件 API、主要状态和交互示例见侧边栏。需要复制并继续修改源码时，阅读 [Registry 分发](/guide/registry)；包的完整边界见[子包职责](/guide/packages)。
