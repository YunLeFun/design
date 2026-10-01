---
title: Segmented Control
---

A single selection view/filter control based on [Reka UI ToggleGroup](https://reka-ui.com/docs/components/toggle-group). Arrows, Home/End and disabled handling are retained. Selecting the current item does not clear the value. Use Tabs for associated content panels.

| Prop        | Description                                                                    | Default  |
| ----------- | ------------------------------------------------------------------------------ | -------- |
| `v-model`   | Selected option; supports string unions                                        | Required |
| `options`   | `{ value, label, disabled?, count?, ariaLabel? }[]`; readonly arrays supported | Required |
| `label`     | Accessible group name                                                          | Required |
| `size`      | `sm`: 34px toolbar; `md`: 44px standard interface                              | `md`     |
| `icon-only` | Icon only with text tooltip                                                    | `false`  |
| `disabled`  | Disable all options                                                            | `false`  |

The `#icon="{ option, selected }"` slot receives the item and selection state. Applications map complete UnoCSS/Iconify classes; public controls do not depend on an application's icon pipeline. Without the slot, labels remain visible.

```vue
<script setup lang="ts">
import YlfSegmentedControl from '@yunlefun/vue/components/YlfSegmentedControl.vue'
import { shallowRef } from 'vue'

const view = shallowRef<'grid' | 'list'>('grid')
const options = [
  { value: 'grid', label: 'Grid view' },
  { value: 'list', label: 'List view' },
] as const
const icons = { grid: 'i-ri-grid-line', list: 'i-ri-list-check' }
</script>

<template>
  <YlfSegmentedControl v-model="view" :options="options" label="Resource view" size="sm" icon-only>
    <template #icon="{ option }">
      <i :class="icons[option.value]" />
    </template>
  </YlfSegmentedControl>
</template>
```

Shared tokens define the neutral base, selected surface, brand text, fine border and focus ring. Small aligns with `YlfSelect size="sm"`. Touch options remain at least 44px and reduced motion disables transitions. Applications need not override active states or radii.
