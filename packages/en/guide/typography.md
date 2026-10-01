---
outline: deep
---

# Typography {#typography-字体}

YunLeFun separates display, product heading and body fonts. Brand display echoes a colorful, soft cloud identity: [Baloo 2](https://fonts.google.com/specimen/Baloo+2) for Latin and [ZCOOL KuaiLe](https://fonts.google.com/specimen/ZCOOL+KuaiLe) for Chinese. Product headings and body use system sans serif for compact, readable interfaces.

Font roles are part of [Visual foundations](/en/guide/foundations). The main site's ZCOOL XiaoWei belongs to specific display modules; assign its role explicitly during migration.

> [!IMPORTANT]
> Rounded webfonts are **only for brand display** such as wordmarks and strongly branded heroes. Page, section and card headings use `--ylf-font-heading`, without decorative type.

## Font family tokens {#字族-token}

Maintained in [`css-vars.scss`](https://github.com/YunLeFun/design/blob/main/packages/ui/styles/css-vars.scss), consumed as `var(--ylf-font-*)`:

| Token                 | Role                      | Description                                      |
| --------------------- | ------------------------- | ------------------------------------------------ |
| `--ylf-font-display`  | Brand display             | Baloo 2 + ZCOOL KuaiLe; opt in to webfonts       |
| `--ylf-font-wordmark` | Brand name such as 云乐坊 | Currently matches display, independently tunable |
| `--ylf-font-heading`  | Product headings          | System rounded sans serif; zero download         |
| `--ylf-font-body`     | Body / UI                 | Inter + system Chinese; no webfont loading       |

## Why ZCOOL KuaiLe? {#为什么是-zcool-kuaile}

| Font             | Rounded?            | Simplified 云乐坊 glyphs        | Distribution           | License |
| ---------------- | ------------------- | ------------------------------- | ---------------------- | ------- |
| **ZCOOL KuaiLe** | Rounded and playful | About 7k glyphs covering GB2312 | Google Fonts           | OFL 1.1 |
| Smiley Sans      | Narrow and italic   | Yes                             | Self hosted / jsDelivr | OFL 1.1 |
| jf open huninn   | Rounded             | Traditional Chinese first       | Self hosted            | OFL 1.1 |

- Baloo 2 has no Chinese glyphs; pair it with a rounded Chinese display font to avoid mismatched system fallback.
- ZCOOL KuaiLe combines rounded geometry, CDN availability and simplified Chinese coverage among these candidates.
- Smiley Sans is narrow italic, suitable for a sharper self hosted wordmark rather than a rounded one.
- Official Noto Sans SC is not a rounded CJK font.

## Fallback chain {#回退链-fallback-chain}

For each character, browsers choose the first family containing that glyph:

```scss
// Brand display
--ylf-font-display:
  'Baloo 2',
  // Latin letters / numbers (rounded)
  'ZCOOL KuaiLe',
  // Chinese (rounded; opt in for display only)
  ui-rounded,
  // Apple SF Pro Rounded (Latin fallback)
  'Hiragino Maru Gothic ProN',
  // Apple rounded CJK fallback
  'Hiragino Maru Gothic Pro',
  'PingFang SC',
  // Final system Chinese fallback
  'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', 'Source Han Sans SC', sans-serif;

// Body / UI: no webfont loading
--ylf-font-body: 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', system-ui, sans-serif;
```

“YunLeFun” uses Baloo 2, “云乐坊” uses ZCOOL KuaiLe, and body text uses system fonts in both languages.

## Loading fonts {#加载字体-loading}

CDN fonts serve display only; body text never requests a full CJK font bundle.

### HTML head (recommended) {#方式一-html-head-推荐-性能最佳}

Parallel `preconnect` and stylesheet links offer the preferred performance. Documentation uses this method in `.vitepress/config.ts`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Rounded Latin -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap" />

<!-- Chinese brand glyph subset for a small initial load -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&text=%E4%BA%91%E4%B9%90%E5%9D%8A&display=swap"
/>
<!-- Full Chinese family, subset by unicode-range on demand -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap" />
```

### One line of SCSS {#方式二-一行-scss-零配置兜底}

When you cannot control the head, opt into the font entry. Its internal `@import` loads serially and can be slower:

```scss
@use '@yunlefun/ui/styles/fonts.scss'; // Opt into Baloo 2 + ZCOOL KuaiLe
```

> `@yunlefun/ui/styles` contains only tokens and loads no webfonts. Font requests are always opt in.

## Usage {#用法-usage}

```css
/* Use the tokens */
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

The font entry also provides `.ylf-font-display`, `.ylf-font-wordmark`, `.ylf-font-heading` and `.ylf-font-body` utilities.

## Payload {#体积说明-payload}

- The `text=` subset includes only the three brand glyphs 云乐坊, a few KB for the initial wordmark.
- Google Fonts splits the full family by `unicode-range`; only rendered glyph subsets load. System body text avoids a full multi MB CJK download.
- Latin only Baloo 2 is small.

ZCOOL KuaiLe and Baloo 2 use SIL Open Font License 1.1, which permits commercial use.
