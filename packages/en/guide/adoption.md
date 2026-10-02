---
outline: deep
---

# Public use and releases {#公共使用与发布}

YunLeFun Design is available for early use as a Web design foundation: shared tokens, themes, Vue controls and source distribution are connected. The current accepted release is `@yunlefun/ui@0.0.6` with `@yunlefun/vue@0.4.3`. See [Component acceptance](/en/guide/component-acceptance). The main site reuses tokens through the package entry; documentation displays repository source. Pin verified published versions in applications and check npm for publication status.

## Public interfaces {#公共接口}

| Layer                | Entry                                                                    | Contract                                            |
| -------------------- | ------------------------------------------------------------------------ | --------------------------------------------------- |
| Foundations          | `@yunlefun/ui/css`                                                       | Compiled tokens and themes, no fonts or framework   |
| Optional backgrounds | `@yunlefun/ui/patterns.css`                                              | Grid/sky classes after foundations                  |
| SCSS                 | `@yunlefun/ui/styles`                                                    | Same source as CSS; requires Sass; choose one entry |
| Vue components       | `@yunlefun/vue/components/*.vue`                                         | Explicit imports, props, slots, events and v-model  |
| Public types         | `import type { YlfAccentTone, YlfColorAppearance } from '@yunlefun/vue'` | Hue and emphasis contracts                          |
| Nuxt                 | `@yunlefun/vue/nuxt`                                                     | Auto imports; applications explicitly load styles   |

Vue components are SFCs with SCSS and need Vue/Sass in the consuming build. CSS-only projects need neither. Pregenerated subpath declarations check public APIs without resolving internal Reka source. Root runtime tools locate the component directory; browsers import component paths.

## Consistent visual APIs {#一致的视觉接口}

`variant` defines purpose, `tone` defines accent hue and `appearance` defines emphasis. Their supported scope is specified per component. Tone does not redefine success or error.

```vue
<YlfCard variant="tinted" tone="pink" :hoverable="false">
  <YlfBadge variant="accent" tone="pink" appearance="soft">Creation</YlfBadge>
  <h2>Room for inspiration</h2>
  <YlfButton variant="accent" tone="pink" appearance="outline">View creations</YlfButton>
</YlfCard>
```

Solid, soft and outline share paired tokens. Applications own layout and data; cards are not bound to users/products/events and buttons do not perform requests or permissions.

## Themes and customization {#明暗主题与定制}

Use root `.dark` globally, or `.ylf-theme-light` / `.ylf-theme-dark` locally. Place overlays inside the same boundary; see Dialog and preview Portal examples.

```html
<section class="ylf-theme-dark">
  <div data-ylf-tone="cyan" class="category">Tools</div>
</section>
```

Customize public tokens instead of internal `--_` variables or DOM structure. Change fill, hover, `-on`, `-soft` and `-text` together and verify both themes. Overriding a palette value in a child does not recalculate aliases already resolved in an ancestor: override the full purpose group at the theme boundary or define the palette at the root.

Avoid global button/span/svg skin selectors. Components use `ylf-*` classes and token CSS contains no global reset, allowing coexistence with existing applications.

## Current maturity {#当前成熟度}

| Scope                | Available                                                                              | Further work before broader adoption                                 |
| -------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Visual guidelines    | Six hues, purpose/status roles, three emphasis levels, themes, typography and spacing  | Validate hierarchy across real content densities                     |
| Distribution         | Shared CSS/SCSS source, Vue/Nuxt, Registry and npm releases                            | Maintain changelogs and deployed artifact checks                     |
| Behavior             | 15 Reka wrappers accepted in Chromium, themes, keyboard, focus, names and distribution | Other browsers, screen readers and business scenarios                |
| Adoption             | Real components in docs; shared tokens and color APIs in the main site                 | Acceptance in another real application                               |
| Coverage             | Buttons, badges, cards, selection and overlays                                         | Inputs, textareas, errors, empty states and forms based on needs     |
| Design collaboration | Code tokens and online guidelines                                                      | No synchronized Figma library, design export or native artifacts yet |

This is an early release with an explicit trial scope. Acceptance of existing demos is not universal accessibility certification or a guarantee for every business scenario.

## Release acceptance {#发布验收}

1. Define the component scope and document API/token changes and legacy migrations.
2. Run `pnpm lint`, `pnpm typecheck`, `pnpm docs:build` and `pnpm exec vitest run`.
3. Run `pnpm ui:verify`: pack styles and build an independent CSS consumer without Sass.
4. Run `pnpm vue:verify`, `pnpm nuxt:verify` and `pnpm registry:verify`. Vue verification builds every component in an independent consumer.
5. Manually check keyboard, focus, 390px/768px layouts, themes, long text and disabled states.
6. After publishing, install exact versions, inspect deployed docs and Registry, then adopt in applications.

APIs and tokens are versioned contracts. Document removals/semantic changes and deprecation periods. Registry consumers merge copied source changes themselves.
