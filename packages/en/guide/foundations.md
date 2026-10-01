---
outline: deep
---

# Visual foundations {#视觉基础}

The default direction is **sky blue with vivid solid accents**. Components read semantic variables from `@yunlefun/ui`; theme values live in `packages/ui/styles/css-vars.scss`.

## Color roles {#颜色的角色}

| Role                      | Token             | Light     | Dark      |
| ------------------------- | ----------------- | --------- | --------- |
| Brand and primary actions | `--ylf-c-brand`   | `#2563eb` | `#60a5fa` |
| Page background           | `--ylf-c-bg`      | `#f8fafc` | `#10151d` |
| Content surface           | `--ylf-c-surface` | `#ffffff` | `#18212d` |
| Primary text              | `--ylf-c-text`    | `#0f172a` | `#e5e7eb` |
| Secondary text            | `--ylf-c-text-2`  | `#475569` | `#cbd5e1` |

Hover, active and soft brand states also read tokens. Success, warning, danger and information map to green, sun yellow, coral and cyan. Use `--ylf-status-{state}` with its `-on` foreground for solid fills; use `-soft` with `-text` for subtle surfaces. Legacy `--ylf-c-success / warning / danger / info` remain text color aliases. See [Colors and components](/en/guide/colors).

Brand actions use `--ylf-c-text-on-accent`. Accents use their own `--ylf-accent-{tone}-on`. Bright palette colors are not small text colors: use paired subtle surfaces and text tokens. The complete palette, context and APIs are in [Colors and components](/en/guide/colors).

Glass and gradient readability depends on the actual background. Verify real pages; individual color values do not certify an entire component library.

Night backgrounds have lower blue saturation while retaining a brightness ladder from page to content to raised surface. Silver blue cloud highlights, shaded faces and contact shadows establish volume. Brand buttons and semantic colors stay vivid.

## Surfaces and light {#表面与光线}

Materials distinguish content, controls and overlays. Light/dark details are maintained together rather than duplicated in each component.

| Token                    | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `--ylf-c-surface-raised` | Slightly brighter content groups             |
| `--ylf-c-surface-inset`  | Recesses for segmented controls and toolbars |
| `--ylf-c-highlight`      | Thin top highlights                          |
| `--ylf-c-panel`          | Highly opaque overlays for readable content  |
| `--ylf-c-edge`           | Contact edges                                |
| `--ylf-overlay-blur`     | Softened modal backdrops                     |

Use `glass` for brand scenes with visible backgrounds such as clouds. Use `panel` for sustained reading or interaction. Decorative light carries no text or status meaning.

## Fonts and hierarchy {#字体与层级}

Display, wordmark, product headings and body use `--ylf-font-display`, `--ylf-font-wordmark`, `--ylf-font-heading` and `--ylf-font-body` respectively.

Display retains Baloo 2 and ZCOOL KuaiLe; body and product headings use system fonts. Brand fonts are opt in, not downloaded by the token entry. See [Typography](/en/guide/typography).

### Font sizes and line heights {#字号与行高-token}

Exported sizes use `rem` to respect the user's root font size. Pixel equivalents below assume 16px.

| Token                   | Default            | Purpose                                |
| ----------------------- | ------------------ | -------------------------------------- |
| `--ylf-text-xs`         | 12px               | Notes and noncritical metadata         |
| `--ylf-text-sm`         | 14px               | Supporting text and compact interfaces |
| `--ylf-text-base`       | 16px               | Body                                   |
| `--ylf-text-lg`         | 20px               | Card and subsection headings           |
| `--ylf-text-xl`         | 24px               | Section headings                       |
| `--ylf-text-2xl`        | 32px               | Page headings                          |
| `--ylf-text-display`    | Responsive 36–64px | Brand display                          |
| `--ylf-leading-heading` | 1.25               | Short headings                         |
| `--ylf-leading-body`    | 1.75               | Prose and explanations                 |
| `--ylf-font-mono`       | System monospace   | Code and token names                   |

Allow longer Chinese headings more line height and natural wrapping on narrow screens. Display sizes do not belong in forms. Hierarchy in documentation should not depend only on faint, tiny text.

## Spacing and layout {#间距与布局}

Use a 4px base step. `--ylf-space-1 / 2 / 3 / 4 / 6 / 8 / 12 / 16` equal 4, 8, 12, 16, 24, 32, 48 and 64px.

Prefer 8–12px inside controls, 16–24px between related fields and 32–64px between sections. Use `--ylf-layout-page` (1200px) for page containers and `--ylf-layout-reading` (720px) for documentation, with `width: 100%` and side padding. These are maximum widths.

```css
.content {
  width: 100%;
  max-width: var(--ylf-layout-reading);
  margin-inline: auto;
  padding-inline: var(--ylf-space-6);
}
```

Allocate width between page content, navigation and outline. At 390px, 24px side padding is a useful starting point. Collapse columns when content no longer fits instead of shrinking type.

- Homepages first explain the applications visitors can try; atmosphere supports content.
- Explore pages keep search, filters, results and empty states in stable positions.
- Settings group tasks and clearly associate save actions with modified fields.
- Mobile prioritizes content order and touch rather than compressed desktop columns.

## Radii, shadows and motion {#圆角、阴影与动效}

Radii are 10, 14, 20, 28px and pill. Select by the hierarchy of small controls, standard controls and containers; use pills where appropriate for buttons and labels.

`--ylf-shadow-sm`, `--ylf-shadow` and `--ylf-shadow-lg` express surface hierarchy. Controls use `--ylf-shadow-control` for fine highlights and contact shadows. Tracks use `--ylf-shadow-inset`. Dialogs, menus and popovers use `--ylf-shadow-panel`. Primary button edges and pressed states respond to clicks; cloud scenes can express day and night, while static content remains steady.

Use `--ylf-duration-fast` (160ms) for feedback and `--ylf-duration-normal` (240ms) for layout/panels, with `--ylf-ease-standard`. Both become 0ms under `prefers-reduced-motion: reduce`. Independent springs and looping animations must also handle that preference.

Brand display may be expressive. Prose, forms and workspaces remain stable. Backgrounds do not loop by default. Set `<YlfCard :hoverable="false">` on static cards so lifting does not imply an action.

## Cloud scenes and grids {#云景与网格}

`--ylf-c-sky`, `--ylf-c-cloud` and `--ylf-c-grid` define decorative sky, cloud and grid colors together across themes. They carry no text or status meaning. `--ylf-grid-size` defaults to 32px.

Load optional backgrounds separately; foundations do not change the page background automatically:

```scss
@use '@yunlefun/ui/styles';
@use '@yunlefun/ui/styles/patterns.scss';
```

`ylf-pattern-sky` supplies a sky surface and `ylf-pattern-grid` a fine grid. Both set background images; nest containers to combine them. See the homepage and [Brand and interfaces](/en/guide/patterns).

## Interaction and copy {#交互与文案}

Cover default, hover, active, focus, disabled and loading, plus validation errors and help for forms. Interactive elements need accessible names, visible keyboard focus and focus restoration after dialogs close.

Use clear action verbs such as “Save profile” or “Create application.” Buttons, loading messages and confirmations share the same business vocabulary. Empty states explain the next step; errors provide a recovery action.

Target at least 4.5:1 for normal text and 3:1 for large text, applying exceptions from [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Prefer 44px touch areas for primary mobile actions. WCAG 2.2 AA specifies 24 CSS px minimum target size with spacing and other exceptions; see [Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Light and dark themes {#明暗主题}

`.dark` switches the application theme. `.ylf-theme-light` and `.ylf-theme-dark` provide isolated documentation previews. Switch colors, foregrounds and shadows together; overlays inherit their enclosing theme.

Accept light, dark, 390px mobile, 768px tablet and desktop layouts, including long copy, loading, empty states and keyboard behavior. Local styles read tokens rather than another dark override set.
