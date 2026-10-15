---
outline: deep
---

# VitePress 共享主题

`vitepress-theme-yunlefun` 统一云乐坊 design、对外开发者文档和内部 Wiki 的文档视觉。导航与文档内容仍由各站点维护。

## 主题分工

| 层级     | 负责内容                                                           | 来源                       |
| -------- | ------------------------------------------------------------------ | -------------------------- |
| 设计基础 | 晴空／夜空颜色、文字、表面、圆角、阴影、间距                       | `@yunlefun/ui`             |
| 文档主题 | 青色锚点与青黄短线、导航、Markdown、宽表格、代码和提示块、外观过渡 | `vitepress-theme-yunlefun` |
| 站点     | 首页内容、导航、侧边栏、语言版本、业务组件                         | design / docs / wiki       |

青色与明黄只用于标题识别细节，主要操作与链接继续使用晴空蓝。文档正文采用系统字体；品牌展示字体由站点按需加载。

## 安装与接入

首版为固定版本的 GitHub Release 安装包，安装方式与 npm 包相同：

```sh
pnpm add -D https://github.com/YunLeFun/design/releases/download/theme-v0.3.0/vitepress-theme-yunlefun-0.3.0.tgz
```

在 `.vitepress/theme/index.ts` 引入主题和 CSS：

```ts
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'

export default Theme
```

在 `.vitepress/config.ts` 使用配置扩展和 Markdown 插件：

```ts
import { defineConfig } from 'vitepress'
import { withYunlefun, yunlefunMarkdown, zhThemeConfig } from 'vitepress-theme-yunlefun/config'

export default defineConfig(withYunlefun({
  lang: 'zh-CN',
  title: '云乐坊文档',
  markdown: { config: md => md.use(yunlefunMarkdown) },
  themeConfig: { ...zhThemeConfig },
}))
```

`withYunlefun` 保留站点现有的 Vite 插件，确保安装包中的 Vue 主题参与服务端构建。CSS 直接使用编译好的设计变量，不要求 Sass，也不会下载字体。

## 保留原生功能

导航、搜索、侧边栏、目录、语言切换、代码组与复制继续使用 VitePress 默认主题。中英版本使用原生 `locales`，主题不会自动翻译内容。`zhThemeConfig` 仅提供中文界面文案。

沿用 VitePress 的 768px 导航断点：平板及桌面显示主要入口，手机使用可展开菜单。中等宽度优先精简搜索按钮、间距及辅助操作，保留完整导航文字。导航链接统一为 44px 高度、中性悬停与内收焦点轮廓；当前页面链接显示 16×2px 晴空蓝下划线，并在路由切换时以共享动效时长移动。下拉分组只用文字颜色标记当前栏目、箭头表示展开，不显示下划线。主题仅观察 VitePress 的选中状态，定位源码与 `YlfNavigation` 共用并内联打包；首次加载保留静态标记，减少动态效果时取消过渡。切换明暗主题时，支持 View Transitions 的浏览器播放两段不同的过渡：切到夜空时，下缘柔和的夜幕从屏幕顶端垂落，白天的页面随之暗下来；切回晴空时，光从点击位置柔和铺开，新画面先略亮再回到正常。键盘切换从右上角的开关附近展开；不支持 CSS 遮罩时退回圆形展开，不支持 View Transitions 时保留淡入淡出。过渡期间暂停毛玻璃，保证动画流畅。换页时正文轻轻浮入，页内目录的晴空蓝胶囊随阅读位置以软弹簧滑动，导航下划线同样使用软弹簧。减少动态效果时全部取消。此适配属于当前源码更新，其他文档站须升级包含它的主题版本后生效。

主题支持 VitePress 1.6.4 与 2.0.0-alpha.16/17/19，以及 Vue 3.5。各站点分别通过客户端和服务端构建验收。

## 扩展站点

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

所有默认主题插槽及其数据保留。设计首页的云朵场景和组件演示仍留在 design；站点目录仍留在 docs 和 wiki。

自定义外观控件可通过 `vitepress-theme-yunlefun/appearance` 的 `useAppearanceTransition()` 调用 `toggleAppearance()` 或 `setAppearance(dark)`。它与导航开关共用同一个状态，尊重减少动态效果设置，并在首次加载时保持静止。

## 升级与维护

共享视觉修改集中在 `packages/vitepress-theme-yunlefun`，基础变量仍在 `packages/ui`。各站点升级同一版本，提交锁文件，避免复制主题 CSS。首版使用 GitHub Release 的固定版本 URL；完成 npm 首发授权后可切换为 npm 版本依赖。

## 统一品牌图形

设置 `themeConfig.brand: { icon: "brand-mark", hero: true }`，导航和原生首页即可使用共享 Logo；Design 使用 `design-mark`。启用时移除原生 `logo` 与 `hero.image` 配置；自定义插槽仍可覆盖默认内容。

图形来自 `@yunlefun/icons`，亮暗颜色跟随 `@yunlefun/ui` 的 `--ylf-c-brand`。[图标库](https://icons.yunle.fun/) 与[设计系统](https://ui.yunle.fun/) 独立维护，通过包依赖与导航链接连接。

```js
import { generateBrandAssets } from 'vitepress-theme-yunlefun/brand-assets'

await generateBrandAssets({ outDir: 'docs/public', icon: 'brand-mark', title: 'YunLeFun' })
```

升级图标后执行这个 Node 工具并提交生成文件。PNG 生成依赖 `rsvg-convert`（librsvg）；仅生成 SVG 可传 `png: false`。

## 可选工作台表面

Icons 保留图标目录、平台遮罩、尺寸控制和技术辅助线。主题将面板、网格和透明棋盘格提炼为共享样式，AG-UI 演示也使用同一套表面。需要时按需引入：

```ts
import 'vitepress-theme-yunlefun/workbench.css'
```

```html
<section class="ylf-workbench">
  <div class="ylf-workbench-panel ylf-workbench-grid">…</div>
  <div class="ylf-workbench-checker">…</div>
</section>
```

颜色跟随共享亮暗变量；在工作台内可覆盖 `--ylf-workbench-grid-size` 与 `--ylf-workbench-checker-size`。产品图标继续保留各自原有配色。
