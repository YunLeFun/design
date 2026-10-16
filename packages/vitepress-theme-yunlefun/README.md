# vitepress-theme-yunlefun

云乐坊共享文档主题，供 design、docs、wiki 和 icons 使用。基于 VitePress 默认主题，复用 `@yunlefun/ui` 的晴空／夜空设计变量。

- 青色标题锚点与青黄短线；正文、表格、代码和提示块使用共享表面。
- 原生导航、搜索、中英菜单、目录、代码复制与默认主题插槽。
- 主动亮暗切换渐变；正文只在站内换页后浮入，首次加载与刷新保持静止；尊重减少动态效果设置。
- VitePress 1.6.4 和 2.0.0-alpha.16/17/19；Vue 3.5。CSS 入口不需要 Sass，不下载字体。

## 安装

```sh
pnpm add -D vitepress-theme-yunlefun
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

`withYunlefun` 处理 npm 安装包的服务端构建，并将主题排除在开发依赖预构建之外（否则会打包出第二份 VitePress，`useData()` 报错），保留已有 Vite 插件、SSR 与 `optimizeDeps` 配置。`yunlefunMarkdown` 保留原生表格属性，将宽表格滚动和键盘焦点放到带无障碍标签的外层；默认识别 `en/` 路径，也可传 `tableLabel(env)` 自定义标签。

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

在 design 工作区执行 `pnpm build:theme`，通过 `pnpm -C packages/vitepress-theme-yunlefun pack` 生成安装包。`pnpm theme:verify` 会用实际安装包验证 VitePress 1.x/2.x 的客户端与服务端构建。发布流程与 `@yunlefun/ui`、`@yunlefun/vue` 相同，见仓库根目录 `RELEASING.md`。

## 统一品牌图形

设置 `themeConfig.brand: { icon: "brand-mark", hero: true }`，导航和原生首页即可使用共享 Logo；Design 使用 `design-mark`。启用时移除原生 `logo` 与 `hero.image` 配置；自定义插槽仍可覆盖默认内容。

Hero 图片与共享 Logo 使用透明轮廓投影，不额外裁切圆角或添加方形底板。可通过 `--ylf-hero-image-shadow` 调整投影参数（不含扩散半径）。

### 首页晴空

原生首页（`layout: home` 且有 `hero`）可以选择在 hero 背后铺一层天空，默认关闭：

```ts
export default defineConfig(withYunlefun({
  themeConfig: {
    brand: { icon: 'brand-mark', hero: true, sky: true },
  },
}))
```

- 亮色是晴空渐变；暗色是月夜：月亮作光源藏在云后，云顶描出一道月光边、云身沉进夜空，高处有几颗静止的星。两者底部都融进页面背景。三朵云的轮廓与 `YlfCloud` 相同，配色取自 `@yunlefun/ui` 的 `--ylf-cloud-*`，不引入 `@yunlefun/vue`。
- 纯装饰：`aria-hidden`、不响应指针、绝对定位，不改变 hero 布局；页面停在顶部时导航透出天空。
- 云只用 CSS 慢慢漂移（52–88 秒一个来回）；减少动态效果时静止。Hero 图片的透明轮廓投影保持不变。
- 天空顶部与地平线颜色可用 `--ylf-home-sky-top`、`--ylf-home-sky-horizon` 微调，暗色月面与星点用 `--ylf-home-sky-moon`、`--ylf-home-sky-star`；个人站想要靛紫夜之类的风格，覆盖这几个变量即可。自定义首页组件（无 `hero`）不受影响。

图形来自 `@yunlefun/icons`，亮暗颜色跟随 `@yunlefun/ui` 的 `--ylf-c-brand`。[图标库](https://icons.yunle.fun/) 与[设计系统](https://design.yunle.fun/) 独立维护，通过包依赖与导航链接连接。

### 站点自有标识

非云乐坊站点（如个人站）沿用同一主题，只替换标识，不 fork：

```ts
// .vitepress/config.ts
import { icons } from '@iconify-json/ri'

export default defineConfig(withYunlefun({
  themeConfig: {
    // Iconify 数据：以 currentColor 绘制的路径跟随 --ylf-c-brand 亮暗变化
    brand: { icon: icons.icons['cloud-fill'], hero: true },
    // 或图片：brand: { icon: { src: '/logo.svg' } }，路径自动加 base
  },
}))
```

| `brand.icon`                     | 渲染                              | 颜色                             |
| -------------------------------- | --------------------------------- | -------------------------------- |
| `'brand-mark'` / `'design-mark'` | `@yunlefun/icons` 内置 SVG        | `currentColor` = `--ylf-c-brand` |
| `{ body, width?, height? }`      | 站点提供的 Iconify 数据，内联 SVG | 同上；写死的 `fill` 保持原色     |
| `{ src }`                        | `<img>`，路径经 `withBase` 处理   | 图片自身颜色                     |

`body` 来自站点构建期配置，按原样内联；不要传入访客可控的内容。组件内也可直接使用 `<YunlefunLogo :icon="…" label="…" />`；0.3 的 `name` 属性继续可用。更深的定制仍走 `nav-bar-title-before` / `home-hero-image` 插槽。

### 图标与 favicon

```js
import { generateBrandAssets } from 'vitepress-theme-yunlefun/brand-assets'

await generateBrandAssets({ outDir: 'docs/public', icon: 'brand-mark', title: 'YunLeFun' })
```

升级图标后执行这个 Node 工具并提交生成文件。PNG 生成依赖 `rsvg-convert`（librsvg）；仅生成 SVG 可传 `png: false`。`icon` 同样接受 Iconify 数据；站点改了强调色时传 `palette: { light, dark }`（十六进制），让 favicon 与页面一致。

## 站点强调色

个人站可以给主题「换一支笔」，但不另建色板。在主题样式之后引入一份覆盖文件，亮暗两套都写：

```ts
// .vitepress/theme/index.ts
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'
import './accent.css'

export default Theme
```

```css
/* .vitepress/theme/accent.css */
:root {
  --ylf-c-brand: #0f766e;
  --ylf-c-brand-hover: #115e59;
  --ylf-c-brand-active: #134e4a;
  --ylf-c-brand-soft: #f0fdfa;
}
:root.dark {
  --ylf-c-brand: #5eead4;
  --ylf-c-brand-hover: #99f6e4;
  --ylf-c-brand-active: #2dd4bf;
  --ylf-c-brand-soft: #123a37;
}
```

| 可以覆盖                                      | 作用                                                   |
| --------------------------------------------- | ------------------------------------------------------ |
| `--ylf-c-brand`、`-hover`、`-active`、`-soft` | 链接、按钮、导航指示、目录、提示块、焦点环与 Logo 颜色 |
| `--ylf-c-text-on-accent`                      | 实色按钮上的文字；仅在新强调色与默认值对比不足时调整   |
| `--ylf-glow-brand`、`--ylf-glow-brand-hover`  | 首页按钮光晕；默认是蓝色 rgba，换色时一并改            |
| `--ylf-font-display`、`--ylf-font-wordmark`   | 导航站名与品牌展示字；正文和标题字体保持不变           |

不要覆盖：`--ylf-palette-*` 与 `--ylf-accent-*`（多彩色板与标题青黄短线是主题签名）、`--ylf-c-bg*` / `--ylf-c-surface` / `--ylf-c-panel` / `--ylf-c-text*` / `--ylf-c-border*`（晴空／夜空表面）、`--ylf-status-*`、间距／圆角／动效／布局 token，以及直接改 `--vp-c-brand-*`（它们已映射到 `--ylf-*`，绕过会让组件与文档不一致）。

两套强调色都需满足：`--ylf-c-brand` 在 `--ylf-c-bg` 上、`--ylf-c-text-on-accent` 在 `--ylf-c-brand` 上对比度不低于 4.5:1。

## 字体

主题本身**不下载任何 webfont**：正文与标题走系统字体，`--ylf-font-display`（导航站名）在未加载 Baloo 2 / ZCOOL KuaiLe 时依次回退到 `ui-rounded`、Hiragino 丸ゴシック、苹方、微软雅黑。不加载也能正常显示。

想要圆体展示字时，面向中国大陆访客的站点不要依赖 `fonts.googleapis.com`（常被阻断，阻塞或拖慢首屏）。改为自托管：

```sh
pnpm add @fontsource/baloo-2 @fontsource/zcool-kuaile
```

```ts
// .vitepress/theme/index.ts
import '@fontsource/baloo-2/700.css'
import '@fontsource/zcool-kuaile/400.css' // 按 unicode-range 分片，只下载页面用到的字
```

字体文件随站点构建产出、与页面同源。也可把 woff2 放在 `public/` 下自写 `@font-face`。Design 文档站的 Google Fonts `<link>` 只是该站点自己的选择，不属于主题。

## Mermaid

与 [vitepress-plugin-mermaid](https://github.com/emersonbottero/vitepress-plugin-mermaid) 组合时，用 `withMermaid` 包在外层：

```ts
import { withMermaid } from 'vitepress-plugin-mermaid'
import { withYunlefun, yunlefunMarkdown } from 'vitepress-theme-yunlefun/config'

export default withMermaid(withYunlefun({
  markdown: { config: md => md.use(yunlefunMarkdown) },
  // ...
}))
```

两种嵌套顺序都已用 VitePress 1.6.4、mermaid 11.16 与插件 2.0.17 验证：`withYunlefun` 保留插件追加的 `markdown.config`、Vite 插件与 `optimizeDeps`，插件无需额外 `ssr.noExternal`。图表沿用 Mermaid 自带的 `default` / `dark` 主题，随导航外观开关重新渲染，晴空与夜空下都清晰可读；主题不改写图表配色。

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
