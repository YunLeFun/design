# vitepress-theme-yunlefun

云乐坊共享文档主题，供 design、docs 和 wiki 使用。基于 VitePress 默认主题，复用 `@yunlefun/ui` 的晴空／夜空设计变量。

- 青色标题锚点与青黄短线；正文、表格、代码和提示块使用共享表面。
- 原生导航、搜索、中英菜单、目录、代码复制与默认主题插槽。
- 主动亮暗切换渐变，首次加载静止，尊重减少动态效果设置。
- VitePress 1.6.4 和 2.0.0-alpha.16/17；Vue 3.5。CSS 入口不需要 Sass，不下载字体。

## 安装

当前通过 GitHub Release 分发固定版本的 npm 格式安装包：

```sh
pnpm add -D https://github.com/YunLeFun/design/releases/download/theme-v0.2.0/vitepress-theme-yunlefun-0.2.0.tgz
```

`@yunlefun/ui` 会作为依赖安装。VitePress 与 Vue 由站点提供。

## 主题入口

`.vitepress/theme/index.ts`：

```ts
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'

export default Theme
```

## 站点配置

`.vitepress/config.ts`：

```ts
import { defineConfig } from 'vitepress'
import { withYunlefun, yunlefunMarkdown, zhThemeConfig } from 'vitepress-theme-yunlefun/config'

export default defineConfig(withYunlefun({
  lang: 'zh-CN',
  title: '云乐坊文档',
  markdown: { config: md => md.use(yunlefunMarkdown) },
  themeConfig: {
    ...zhThemeConfig,
    nav: [{ text: '指南', link: '/guide/' }],
  },
}))
```

`withYunlefun` 处理 npm 安装包的服务端构建，保留已有 Vite 插件和 SSR 配置。`yunlefunMarkdown` 保留原生表格属性，将宽表格滚动和键盘焦点放到带无障碍标签的外层；默认识别 `en/` 路径，也可传 `tableLabel(env)` 自定义标签。

中英站点继续使用 VitePress `locales` 和默认语言菜单；`zhThemeConfig` 是可选的原生中文界面文案预设，不会翻译站点内容。

## 扩展插槽

```vue
<script setup lang="ts">
import { Layout } from 'vitepress-theme-yunlefun'
</script>

<template>
  <Layout>
    <template #doc-before>
      <p>本站提示</p>
    </template>
  </Layout>
</template>
```

全部默认主题插槽和作用域数据向下传递。页面自定义亮暗控件可从 `vitepress-theme-yunlefun/appearance` 调用 `useAppearanceTransition()`，与导航开关共享 VitePress 外观状态。

主题不包含业务组件、云朵场景、文档导航或站点内容。自定义组件使用 `--ylf-*` / `--vp-*` 变量，不另建色板。

## 开发

在 design 工作区执行 `pnpm build:theme`，通过 `pnpm -C packages/vitepress-theme-yunlefun pack` 生成安装包。发布时先验证实际安装包在 VitePress 1.x/2.x 的客户端与服务端构建，再上传版本固定的 GitHub Release 资产。以后完成 npm 首发授权后，可用同一包名发布到 npm。

## 统一品牌图形

设置 `themeConfig.brand: { icon: "brand-mark", hero: true }`，导航和原生首页即可使用共享 Logo；Design 使用 `design-mark`。启用时移除原生 `logo` 与 `hero.image` 配置；自定义插槽仍可覆盖默认内容。

图形来自 `@yunlefun/icons`，亮暗颜色跟随 `@yunlefun/ui` 的 `--ylf-c-brand`。[图标库](https://icons.yunle.fun/) 与[设计系统](https://ui.yunle.fun/) 独立维护，通过包依赖与导航链接连接。

```js
import { generateBrandAssets } from 'vitepress-theme-yunlefun/brand-assets'

await generateBrandAssets({ outDir: 'docs/public', icon: 'brand-mark', title: 'YunLeFun' })
```

升级图标后执行这个 Node 工具并提交生成文件。PNG 生成依赖 `rsvg-convert`（librsvg）；仅生成 SVG 可传 `png: false`。
