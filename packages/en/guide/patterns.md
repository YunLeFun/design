---
outline: deep
---

# Brand and interfaces {#品牌与界面}

The main site's sky and clouds, and YunYouJun's blog whitespace and fine grids, inform a shared color, type and interaction language. The documentation site uses these guidelines itself.

## References and choices {#参考与取舍}

| Reference                                                                                   | Adopted language                            | In Design                                                      |
| ------------------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| [YunLeFun main site](https://www.yunle.fun/)                                                | Sky blue, clouds and existing logo          | Brand, sky/cloud tokens and `YlfLogo`                          |
| [YunYouJun's blog](https://www.yunyoujun.cn/)                                               | Whitespace, light navigation and fine grids | Low contrast homepage grid and calm reading                    |
| [Valaxy Theme Yun](https://github.com/YunYouJun/valaxy/tree/main/packages/valaxy-theme-yun) | Configurable colors, themes and page roles  | Semantic tokens, optional patterns and separated content/shell |

References guide decisions. Design does not depend on Valaxy's runtime or adopt blog avatars, social entries, fireworks or fullscreen intros. Documentation prioritizes finding information, stable reading and interactive examples.

## Brand logo {#品牌标志}

`YlfLogo` uses the main site's 100:70 proportions. The symbol reads sky blue; the wordmark reads primary text. Both use the same token names in dark mode. Preserve proportions and the official mark, without continual color changes or large glows.

Clouds provide illustration and atmosphere. When a symbol without a wordmark is linked, name the link, for example “YunLeFun home.”

```vue
<template>
  <a href="/" aria-label="YunLeFun home">
    <YlfLogo layout="horizontal" size="sm" />
  </a>
</template>
```

Leave at least about one quarter of the mark's height as clear space. Pair first appearances with the name; compact navigation can use the symbol. `size`, `layout` and `wordmark` remain available.

## Visual intensity {#表达的强弱}

| Interface             | Emphasize                                          | Keep calm                               |
| --------------------- | -------------------------------------------------- | --------------------------------------- |
| Brand homepage        | One cloud scene, display heading, primary entry    | Secondary entries and prose backgrounds |
| Documentation home    | Interactive controls, palette, integration entries | Explanations and footer                 |
| Documentation article | Current section, code, demos, important notices    | Neutral prose and form surfaces         |
| Settings/admin        | Groups, field states, save feedback                | Illustrations and decorative motion     |
| Creation gallery      | Covers and one featured accent                     | Filters, density and status semantics   |

Sky blue handles primary actions and selections. Sun `#facc15`, cyan `#06b6d4`, coral `#ff6b4a`, pink `#ec4899` and green `#22c55e` supply vivid accents. Prefer one or two per content area; errors and warnings keep semantic colors. Pair fills with their foreground tokens; see [Colors and components](/en/guide/colors).

## Homepage composition {#首页构图}

Left aligned copy and real component previews carry the brand. Text stays clear of clouds and accent blocks; scene backgrounds live within previews. Interactive controls explain the language through use.

```text
Desktop
Logo / Search                         Navigation / Theme
Brand, heading, description           Sky and clouds
Primary entries                       Interactive components
Foundations entry                     Palette / Type specimens
Understand the design                 Start building / Build consistency

Mobile: introduction → preview → visual specimens → documentation entries
```

`DesignHome` arranges content. `DesignPlayground` manages the global day/night theme and local accent choices. `DesignSpecimens` shows foundations. Previews use the actual Vue Button, Card, Switch and Badge with shared UI styles.

## Reading and navigation {#文档阅读与导航}

- Keep brand, search, main entries and theme controls at the top. Text leads; icons supplement meaning.
- Group the sidebar into Design language, Development and adoption, and Styles and experiments. Mark the active item with background and weight.
- Limit reading to 720px and establish heading hierarchy with whitespace. Use readable system fonts.
- The outline navigates article sections and collapses on mobile. Tables and code scroll within containers.
- Component previews have an independent theme. Width controls set maximums within available space, not forced 768px canvases on phones.
- Source starts collapsed. Theme, viewport and source buttons have accessible names and keyboard focus.

## States and interaction {#状态与交互}

| State          | Visuals and copy                                                              |
| -------------- | ----------------------------------------------------------------------------- |
| Default/hover  | Color and border feedback without resizing                                    |
| Keyboard focus | Visible blue focus beyond hover                                               |
| Selected       | Shape, check or text as well as color                                         |
| Loading        | Preserve name and position; communicate busy state and prevent repeat actions |
| Success        | Confirm the completed action with success semantics                           |
| Error          | Explain cause and recovery near the field                                     |
| Empty          | Explain expected content and offer a real next step                           |

Frequent use interfaces do not float or glow continuously. Animation responds to user actions; disabling decoration preserves information structure. Homepage Night sky and the header appearance control share the global preference. Accents affect only the preview. Theme changes briefly transition backgrounds, clouds and controls; reduced motion switches directly.

## Delivery checks {#交付检查}

Check light/dark, 390px mobile and desktop, long Chinese/English copy, keyboard order, focus, search and overlays. Layout must work with system font fallback, and outcomes remain understandable with reduced motion.

See [Visual foundations](/en/guide/foundations) for implementation. Shared releases, main site dependencies and deployment move independently; see [Application migration](/en/guide/migration).
