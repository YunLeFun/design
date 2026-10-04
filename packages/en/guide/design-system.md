---
outline: deep
---

# YunLeFun Design {#yunlefun-design-设计体系}

YunLeFun Design is the design system of YunLeFun: shared principles, brand language, interaction guidelines, and the components, styles and documentation that implement them.

## Design and UI {#design-与-ui}

| Concept         | Question                                                         | In this project                                                   |
| --------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Design          | What brand, hierarchy and experience should the product express? | The `YunLeFun/design` repository and guidelines                   |
| UI              | How are the visible, interactive interfaces implemented?         | Styles, buttons, forms, navigation, dialogs and page compositions |
| `@yunlefun/ui`  | How do Web projects reuse the design foundations?                | Framework independent SCSS and `--ylf-*` variables                |
| `@yunlefun/vue` | How do Vue projects reuse interactive controls?                  | `Ylf*` components and Nuxt integration                            |

UI implements Design in the interface. The repository name describes the system; package names describe what you install. `@yunlefun/design-monorepo` is the private workspace root, not an application SDK.

## Shared layers {#统一的层次}

```text
YunLeFun Design
├── Guidelines: brand, hierarchy, interaction, copy and accessibility
├── Foundations: @yunlefun/ui colors, fonts, spacing, motion, radii, shadows and themes
├── Components: @yunlefun/vue Ylf* components
├── Compositions: customizable source distributed through Registry
└── Maintenance: metadata, utilities and documentation previews

Applications → consume foundations, components and compositions → own data and workflows
```

See [Package responsibilities](/en/guide/packages) for directories and distribution, and [Component architecture](/en/guide/architecture) for implementation boundaries. Page compositions are a future extension; Registry currently contains tokens, Button and Dialog.

## Brand direction: sky blue with vivid accents {#品牌方向-晴空蓝为主-高饱和纯色点缀}

YunLeFun serves people finding useful tools, trying applications and sharing creations. Interfaces should feel clear, light and playful, making content easy to find, states easy to understand and actions easy to complete.

- **Sky blue** handles everyday interactions: primary buttons, links, selections and focus.
- **Solid accents** default to sky blue. Sun yellow marks featured content; cyan, coral and pink identify content categories with a clear purpose. The `accent` variants share `tone`.
- **Neutral surfaces** carry prose and forms: sky white and blue gray by day, subdued blue gray at night.
- **Semantic colors** communicate success, warnings and errors consistently across applications.

Cloud scenes are optional brand modules. A homepage can highlight creations and atmosphere; settings should emphasize groups, fields and save feedback. Shared controls and hierarchy tie both to the same product family.

## Fonts and decoration by purpose {#按用途使用字体和装饰}

| Context                         | Font role              | Visual intensity                                     |
| ------------------------------- | ---------------------- | ---------------------------------------------------- |
| Wordmark and brand hero         | `wordmark` / `display` | Display fonts and a few solid accents                |
| Page, section and card headings | `heading`              | System sans serif; organize through size and spacing |
| Prose, buttons, forms and data  | `body`                 | Readability and stable layout first                  |

Radii distinguish controls from containers. Shadows express elevation. Motion responds to actions. Static information does not need lifting, glowing or continuous animation that suggests a click.

## Sources of truth {#规范和代码的权威来源}

| Content                             | Maintained in                                                  |
| ----------------------------------- | -------------------------------------------------------------- |
| Principles, visual roles and usage  | This page and [Visual foundations](/en/guide/foundations)      |
| Executable theme values             | `packages/ui/styles/css-vars.scss`                             |
| Public component APIs and behavior  | `packages/vue/components/Ylf*.vue` and component documentation |
| Registry distribution relationships | Root `registry.json`                                           |
| Component index                     | Metadata generated from component documentation                |
| Product business rules              | Each application repository                                    |

Update examples, documentation and generated Registry files with shared styles. Map legacy application variables through an adapter rather than maintaining another foundation theme.

## Current consistency {#当前统一到哪里}

The shared library covers colors, fonts, spacing, reading widths, radii, shadows, motion and optional backgrounds. The logo matches the main site. Documentation uses the same tokens and real components, including an interactive theme preview. See [Colors and components](/en/guide/colors) and [Brand and interfaces](/en/guide/patterns).

The main site still has local `--ui-*`, some `--ylf-*`, and `App*` wrappers. Dependency upgrades, token mapping and page migration follow [Application migration](/en/guide/migration). A library update does not mean every deployed application has been redesigned.

## Brand entrance buttons

A homepage or campaign can use one `hero` action per section: a deep blue-to-cyan gradient, white text and a soft shadow. Everyday `primary` actions stay solid sky blue. Values live in `--ylf-hero-*`; see [Button](/en/vue/components/button/).
