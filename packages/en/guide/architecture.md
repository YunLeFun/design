---
outline: deep
---

# Component architecture {#设计体系架构}

YunLeFun Design has layered responsibilities: Reka UI handles complex behavior; YunLeFun supplies stable APIs and brand visuals; applications consume `Ylf*` components.

See [Design and UI](/en/guide/design-system) for conceptual boundaries and [Package responsibilities](/en/guide/packages) for package maturity. This page focuses on implementation and distribution.

```text
Applications / YunLeFun Blocks
          ↓
@yunlefun/vue: YlfButton, YlfDialog, YlfSelect…
          ↓
reka-ui: focus, keyboard, ARIA, Portal, overlay positioning
          ↓
Vue / DOM

@yunlefun/ui/styles ── supplies --ylf-* design tokens to every layer
```

## Layer responsibilities {#各层职责}

| Layer             | Responsibility                                        | Stability                                     |
| ----------------- | ----------------------------------------------------- | --------------------------------------------- |
| `@yunlefun/ui`    | Color, fonts, radii, shadows, motion and theme tokens | Versioned public API                          |
| `@yunlefun/vue`   | Product facing `Ylf*` APIs                            | Public API, accepted per component            |
| `reka-ui`         | Unstyled primitives and complex behavior              | Internal implementation dependency            |
| YunLeFun Registry | Page fragments, business Blocks and copyable source   | Basic distribution pipeline ready for release |

Reka UI does not define product visuals. The default shadcn-vue Tailwind styles are not the YunLeFun theme source. Its composition patterns and Registry protocol can inform implementation, while final styles consume YunLeFun tokens.

## Component API principles {#组件接口原则}

### Keep common cases simple {#常用场景保持简单}

Cover common product scenarios with a small API. `YlfSelect` accepts `options`; consumers need not manage collisions, typeahead or keyboard focus.

```vue
<YlfSelect v-model="color" :options="colors" />
```

### Keep behavior in Reka UI {#行为留在-reka-ui}

Compose Reka primitives for focus traps, keyboard navigation, Portal and positioning instead of reimplementing them.

### Read tokens for visuals {#视觉只读取-token}

Styles consume `--ylf-*` with reasonable fallbacks. Themes switch through tokens rather than a second component color system.

```scss
.ylf-example {
  color: var(--ylf-c-text, #0f172a);
  background: var(--ylf-c-surface, #fff);
  border-radius: var(--ylf-radius, 14px);
}
```

### Expose primitives when needed {#不提前暴露所有-primitive}

Add compound APIs or internal seams when real product composition needs emerge. Do not mechanically wrap every Reka part as a public `Ylf*` component.

## Distribution strategy {#分发策略}

Maintain foundations through `@yunlefun/vue` for shared behavioral and accessibility fixes:

- Basic controls including Button, Dialog, Select, Checkbox and Tooltip.
- Modules with stable APIs and strong brand consistency requirements.
- Implementations requiring coordinated Reka UI upgrades.

Tokens, Button and Dialog validate the [Registry pipeline](/en/guide/registry). Future Registry content primarily serves consumers who need editable source:

- Login, settings and navigation fragments.
- Data Table, Date Picker and Command Menu compositions.
- AI conversations and message list Blocks.

There is one authoritative source for each basic control. Registry is generated from that same package source. Applications merge updates into copied source; npm consumers upgrade packages. Verified generated output does not automatically synchronize consumer copies.

## Documentation and previews {#文档与预览}

Documentation is generated from each component's `index.md` and `demo.vue`. Demos serve documentation, visual regression and manual acceptance:

```text
packages/vue/components/button/
├── demo.vue       # Interactive preview and usage example
└── index.md       # Description, Props, Slots, Events
```

Every preview supports:

- Independent light/dark tokens without changing the documentation theme.
- Reka Portals inside the canvas so overlays inherit its theme.
- Responsive, 768px tablet and 390px mobile width limits.
- Actual demo source and its GitHub file.
- Visible errors if rendering fails.

Run locally:

```bash
pnpm docs:dev
```

Build for production:

```bash
pnpm docs:build
```

## New component acceptance {#新组件验收清单}

See [Public use and releases](/en/guide/adoption) for supported use, gaps and distribution checks, and [Component acceptance](/en/guide/component-acceptance) for the current 15 Reka wrappers.

1. Use product language for public props, slots and events.
2. Reuse Reka UI for complex behavior; verify keyboard, focus order and accessible names.
3. Read all colors, radii, shadows and fonts from `--ylf-*` tokens.
4. Demonstrate main states, disabled behavior and a real interaction in `demo.vue`.
5. Check light, dark, 390px and 768px previews for overflow and clipping.
6. Pass tests, type checking and documentation builds before release.
