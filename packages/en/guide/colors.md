---
outline: deep
---

# Colors and components {#色彩与组件}

Sky blue is the YunLeFun identity color and default accent. Sun yellow, cyan, coral, pink and green add playfulness through solid colors with clear purposes, replacing purple/pink aurora decoration.

## Try the shared palette {#试试共享配色}

The preview starts and resets to sky blue. Accent color and style change buttons, badges and cards together. Night sky switches the global theme to show the same tokens in dark mode.

<div class="vp-raw">
  <DesignPlayground />
</div>

## Palette and purpose {#色板与用途}

| Color            | Raw value | Role                                                        |
| ---------------- | --------- | ----------------------------------------------------------- |
| Sky blue `blue`  | `#2563eb` | Default accent, brand, primary actions, links and selection |
| Sun yellow `sun` | `#facc15` | Featured content, recommendations and playful emphasis      |
| Cyan `cyan`      | `#06b6d4` | Tools and discovery                                         |
| Coral `coral`    | `#ff6b4a` | Events and participation                                    |
| Pink `pink`      | `#ec4899` | Creation and expression                                     |
| Green `green`    | `#22c55e` | Completion and positive feedback                            |

These roles offer a consistent starting point. Success, warning, error and information have fixed mappings and do not follow the selected accent. Prefer one or two accents per area; palette specimens may show them side by side.

## Three token layers {#token-的三个层次}

```text
Raw palette: --ylf-palette-sun = #facc15
    ↓
Purpose: --ylf-accent-sun / -hover / -soft / -text / -on
    ↓
Component context: data-ylf-tone="sun" → --ylf-accent / -hover / -soft / -text / -on
    ↓
Button, Badge, Card, Switch, Progress, Separator
```

| Token                                         | Purpose                                          |
| --------------------------------------------- | ------------------------------------------------ |
| `--ylf-palette-{tone}`                        | Raw solid color for illustration or specimens    |
| `--ylf-accent-{tone}`                         | Solid fill                                       |
| `--ylf-accent-{tone}-hover`                   | Hover fill                                       |
| `--ylf-accent-{tone}-on`                      | Foreground paired with solid and hover fills     |
| `--ylf-accent-{tone}-soft`                    | Subtle semantic surface, adapted in dark mode    |
| `--ylf-accent-{tone}-text`                    | Readable text on the soft surface                |
| `--ylf-c-feature / feature-bg / feature-text` | Featured decoration, background and neutral text |

`--ylf-palette-blue` is the raw blue. `--ylf-accent-blue` references theme aware brand tokens and stays aligned with `--ylf-c-brand`; it is also the default accent context. Do not use sun yellow or cyan for small text on white. `--ylf-c-text-on-accent` belongs to brand actions and does not replace each accent's `-on`.

Solid accents remain vivid in both themes. Sky blue brightens with the dark brand color; secondary adjustments chiefly affect soft surfaces and their text. Maintain values in `@yunlefun/ui/styles/css-vars.scss` rather than duplicating them in applications.

## States use the same palette {#状态也来自同一套色板}

| State              | Color group      | Solid fill             | Text on fill              |
| ------------------ | ---------------- | ---------------------- | ------------------------- |
| Success `success`  | Green `green`    | `--ylf-status-success` | `--ylf-status-success-on` |
| Warning `warning`  | Sun yellow `sun` | `--ylf-status-warning` | `--ylf-status-warning-on` |
| Error `danger`     | Coral `coral`    | `--ylf-status-danger`  | `--ylf-status-danger-on`  |
| Information `info` | Cyan `cyan`      | `--ylf-status-info`    | `--ylf-status-info-on`    |

Status tokens alias accent groups and also supply `-hover`, `-soft` and `-text`. Buttons/badges pair solid with `-on`; notice panels pair `-soft` with `-text`. Legacy `--ylf-c-success / warning / danger / info` remain text aliases. Migrate solid fills to `--ylf-status-*` with `-on`.

Sky blue uses white text in light mode and dark blue text in dark mode. Other fills pair with darker hues: brown on yellow, teal on cyan, ochre on coral, berry on pink and dark green on green. Do not apply white text uniformly to bright fills. Text pairs for solids, hovers and soft surfaces are checked at 4.5:1 or higher.

Status badges retain explicit words alongside a check, exclamation, cross or information symbol. These decorative symbols do not duplicate the screen reader label.

## Public component APIs {#公共组件接口}

`@yunlefun/vue` exports `YlfAccentTone` and `YlfColorAppearance`. Six components share `tone="blue | sun | cyan | coral | pink | green"`, defaulting to `blue`. It affects `accent` and Card's `tinted`; it does not override brand or fixed semantic mappings.

Accent and status buttons/badges share `appearance="solid | soft | outline"`: solid emphasizes key entries, soft groups supporting content, outline expresses secondary actions. Emphasis does not change semantics. Outline text suits standard light/dark or matching soft surfaces; verify images and unknown backgrounds separately.

| Component      | API                                             | Expression                              |
| -------------- | ----------------------------------------------- | --------------------------------------- |
| `YlfButton`    | `variant="accent"` + `tone`                     | Solid button with paired foreground     |
| `YlfBadge`     | `variant="accent"` + `tone`                     | Compact content label                   |
| `YlfBadge`     | `success`, `warning`, `danger`, `info` variants | Status fill, text and supporting symbol |
| `YlfBadge`     | `variant="featured"`                            | Sun star, pale yellow and neutral text  |
| `YlfCard`      | `accent` or `tinted` + `tone`                   | Solid top edge or soft surface          |
| `YlfSwitch`    | `variant="accent"` + `tone`                     | Selected track and paired thumb         |
| `YlfProgress`  | `variant="accent"` + `tone`                     | Solid progress fill                     |
| `YlfSeparator` | `accent` + `tone`, or `spectrum`                | One color or six joined solid bands     |

```vue
<script setup lang="ts">
import type { YlfAccentTone } from '@yunlefun/vue'
import YlfBadge from '@yunlefun/vue/components/YlfBadge.vue'
import YlfButton from '@yunlefun/vue/components/YlfButton.vue'
import YlfCard from '@yunlefun/vue/components/YlfCard.vue'

const tone: YlfAccentTone = 'coral'
</script>

<template>
  <YlfCard variant="accent" :tone="tone" :hoverable="false">
    <YlfBadge variant="featured">
      Featured
    </YlfBadge>
    <h2>Weekend creation event</h2>
    <YlfButton variant="accent" :tone="tone">
      Join the event
    </YlfButton>
  </YlfCard>
</template>
```

Load `@yunlefun/ui/css` or `@yunlefun/ui/styles` in the application. See [Get started](/en/guide/) for Nuxt. `YlfAccentTone` is a type import and does not introduce root Node tools into the browser.

## Native HTML and other frameworks {#原生-html-与其他框架}

The same context works beyond Vue. `data-ylf-tone` and the element consuming its variables belong within the same theme boundary.

```html
<div class="category" data-ylf-tone="cyan">Tools</div>
```

```scss
@use '@yunlefun/ui/styles';

.category {
  color: var(--ylf-accent-text);
  background: var(--ylf-accent-soft);
  border: 1px solid var(--ylf-accent);
  padding: var(--ylf-space-2) var(--ylf-space-3);
  border-radius: var(--ylf-radius-sm);
}
```

If a nested region changes light/dark theme, set `data-ylf-tone` again inside it so derived variables resolve against that theme.

## Colorful pages with clear hierarchy {#让页面缤纷-也保持层级}

- Reading, settings and forms use neutral surfaces, solids for primary actions and soft colors for groups.
- Discovery, creation and events may place category colors together, using `tinted` cards with readable body text.
- Brand pages can use `spectrum` separators and the complete palette. Six bands come from `--ylf-spectrum-stops`.
- Keep a category's `tone` consistent across buttons, badges and cards. Errors retain semantic variants.

## Migrating from aurora {#从极光迁移}

| Legacy use                                    | Replacement                    |
| --------------------------------------------- | ------------------------------ |
| Button / Switch / Progress `variant="aurora"` | `variant="accent" tone="blue"` |
| Badge `variant="aurora"`                      | `variant="featured"`           |
| Card `variant="gradient"`                     | `variant="accent" tone="blue"` |

Legacy values temporarily alias the new appearance. Examples use new APIs. `--ylf-gradient-aurora` is a single color compatibility value; `--ylf-aurora-*` map to the new palette. New code uses accent or feature tokens. Default documentation does not load legacy aurora animation.

Source and Registry follow these rules. npm releases, application dependencies and deployments are tracked separately in [Application migration](/en/guide/migration).
