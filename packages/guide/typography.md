# Typography 字体

云乐坊把字体分成展示、产品标题和正文三个角色。品牌展示字呼应「缤纷多彩 / 云是软的」的气质：拉丁走 [Baloo 2](https://fonts.google.com/specimen/Baloo+2)，中文走 [ZCOOL KuaiLe 站酷快乐体](https://fonts.google.com/specimen/ZCOOL+KuaiLe)。产品标题与正文则使用系统无衬线字体，保持紧凑和高可读性。

> [!IMPORTANT]
> 圆体 webfont **只用于品牌展示**（wordmark、强品牌 Hero 等）。页面、区块和卡片标题使用 `--ylf-font-heading`；不要使用楷体或其他装饰字体。

## 字族 Token

定义在 [`@yunlefun/ui/styles/css-vars.scss`](https://github.com/YunLeFun/ui/blob/main/packages/ui/styles/css-vars.scss)，组件以 `var(--ylf-font-*)` 引用：

| Token                 | 角色                   | 说明                                                            |
| --------------------- | ---------------------- | --------------------------------------------------------------- |
| `--ylf-font-display`  | 品牌展示               | 圆体：Baloo 2 + ZCOOL KuaiLe，需要按需加载 webfont              |
| `--ylf-font-wordmark` | 品牌字（如「云乐坊」） | 当前等同 `--ylf-font-display`，独立 token 便于单独调校字重/字距 |
| `--ylf-font-heading`  | 产品标题               | 系统圆润无衬线，用于页面、区块和卡片标题，**零下载**            |
| `--ylf-font-body`     | 正文 / UI              | Inter + 系统中文，**不加载任何 webfont**                        |

## 为什么是 ZCOOL KuaiLe？

| 字体                        | 圆体？          | 简体「云乐坊」           | 分发              | 授权    |
| --------------------------- | --------------- | ------------------------ | ----------------- | ------- |
| **ZCOOL KuaiLe 站酷快乐体** | ✅ 圆润活泼     | ✅ ~7k 字形，覆盖 GB2312 | **Google Fonts**  | OFL 1.1 |
| 得意黑 Smiley Sans          | ❌ 窄体**斜体** | ✅                       | 自托管 / jsDelivr | OFL 1.1 |
| jf open 粉圓 (huninn)       | ✅              | ⚠️ 繁体优先（台湾）      | 自托管            | OFL 1.1 |

- **Baloo 2 没有中文字形**，所以中文必须补一款圆体 display，否则会掉到系统默认中文黑体（苹方/雅黑），与拉丁圆体气质不搭。
- ZCOOL KuaiLe 是唯一**既圆润、又在 CDN 上、又覆盖简体**的候选，与 Baloo 2 的圆润几何最和谐。
- 「得意黑」其实是**窄体斜体**而非圆体；若想要更锋利的 wordmark 可改用它（自托管）。
- 没有「圆体版 Noto CJK」——官方 Noto Sans SC 并非圆体。

## 回退链 Fallback chain

浏览器逐字挑选列表里第一个**含该字形**的字族：

```scss
// 展示 / 标题
--ylf-font-display:
  'Baloo 2',
  // 拉丁字母 / 数字（圆体）
  'ZCOOL KuaiLe',
  // 中文（圆体，需加载，仅 display 角色）
  ui-rounded,
  // Apple 系统圆体 SF Pro Rounded（拉丁兜底）
  'Hiragino Maru Gothic ProN',
  // Apple 系统圆体 CJK 兜底（丸ゴシック）
  'Hiragino Maru Gothic Pro',
  'PingFang SC',
  // 非圆体系统中文最终兜底
  'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', 'Source Han Sans SC', sans-serif;

// 正文 / UI —— 不触发任何 webfont
--ylf-font-body: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif;
```

于是「YunLeFun」走 Baloo 2、「云乐坊」走 ZCOOL KuaiLe，正文中英文都走系统字体。

## 加载字体 Loading

字体经 CDN 加载，且只为 display 角色服务，正文永不下载 CJK 整包。

### 方式一：HTML `<head>`（推荐，性能最佳）

`preconnect` + `<link>` 不阻塞、可并行，本仓库文档站即用此法（见 `.vitepress/config.ts`）：

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- 拉丁圆体 -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap" />

<!-- 中文圆体：品牌字「云乐坊」文本子集（首屏即刻，体积极小） -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&text=%E4%BA%91%E4%B9%90%E5%9D%8A&display=swap"
/>
<!-- 中文圆体：完整字族（Google Fonts 自动按 unicode-range 分片，只下用到的字形） -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap" />
```

### 方式二：一行 SCSS（零配置兜底）

无法控制 `<head>` 时，单独引入字体子路径即可（内部用 `@import`，串行阻塞，性能略逊方式一）：

```scss
@use '@yunlefun/ui/styles/fonts.scss'; // 引入即加载圆体（Baloo 2 + ZCOOL KuaiLe）
```

> 聚合入口 `@yunlefun/ui/styles` **只含设计 token、保持零 webfont**；字体始终是按需 opt-in，不会因引入 token 而偷偷发网络请求。

## 用法 Usage

```css
/* 直接用 token */
.brand {
  font-family: var(--ylf-font-wordmark);
}
.hero-title {
  font-family: var(--ylf-font-display);
}
.section-title {
  font-family: var(--ylf-font-heading);
}
body {
  font-family: var(--ylf-font-body);
}
```

也可用 `fonts.scss` 附带的工具类：`.ylf-font-display` / `.ylf-font-wordmark` / `.ylf-font-heading` / `.ylf-font-body`。

## 体积说明 Payload

- **`text=` 文本子集**只含「云乐坊」三字，几 KB，保证 wordmark 首屏即圆体。
- **完整字族**由 Google Fonts 按 `unicode-range` 自动分片：页面只下载实际渲染到的字形分片；正文用系统字体，永不触发整包（数 MB）下载。
- Baloo 2 仅拉丁，体积很小。

> 授权：ZCOOL KuaiLe 与 Baloo 2 均为 SIL Open Font License 1.1，可商用。
