---
title: Select
---

Select uses [Reka UI](https://reka-ui.com) for positioning, keyboard, typeahead and scrolling. Tokens supply appearance.

## Props

| Prop          | Description                                   | Type             | Default  |
| ------------- | --------------------------------------------- | ---------------- | -------- |
| `v-model`     | Selected value                                | `string`         | —        |
| `options`     | Options `{ label, value, disabled?, color? }` | `SelectOption[]` | —        |
| `placeholder` | Placeholder                                   | `string`         | `请选择` |
| `disabled`    | Disabled                                      | `boolean`        | `false`  |

Id, class, style, aria-label and aria-labelledby forward to the trigger. Associate visible labels through `<label for>` and id, or provide aria-label; otherwise the placeholder supplies the name. Models/options support string unions.

Dropdowns mount at the page root by default. For local themes, ConfigProvider's teleport-to can point inside the theme; allow overlay overflow. The homepage accent selectors use this component.

## Color dots {#色点预览}

Optional option `color` accepts CSS values including `var(--ylf-*)`. The menu and selected value display a dot. Labels and selection checks remain; dots are decorative.

```vue
<script setup lang="ts">
import { ref } from 'vue'

const tone = ref('blue')
const options = [
  { value: 'blue', label: 'Sky blue', color: 'var(--ylf-accent-blue)' },
  { value: 'sun', label: 'Sun yellow', color: 'var(--ylf-accent-sun)' },
]
</script>

<template>
  <YlfSelect v-model="tone" :options="options" aria-label="Accent color" />
</template>
```

Token dots follow the enclosing theme; page and overlay need the same boundary.

## Toolbar density and icons {#工作台密度与图标}

Small uses 34px height, compact text and 10px radius for sorting/scope controls. Default md retains a 44px form size. Touch controls/options stay at least 44px. Icon and indicator slots accept the application's icons; built in SVG remains the fallback.

## Forms and local themes {#表单与局部主题}

Optional name and required (default false) forward to the form control. Values enter native FormData; disabled fields do not submit. Trigger attributes/events forward as described above. Use the actual field name as the accessible name, for example “Theme color.”

Optional `portalTo: string | HTMLElement` targets an existing container, for example `portal-to="#settings-portals"`, within the same light/dark boundary. Without it, ConfigProvider and eventually body remain the fallback.
