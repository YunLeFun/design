---
title: Navigation
description: Site navigation with distinct current-page, hover and keyboard-focus states, router links and site switching.
---

`YlfNavigation` groups links, `YlfNavigationLink` identifies the current page, and `YlfNavigationTrigger` provides a menu trigger for site switching. Use them in site and application headers. Use Tabs for panels within one page.

## Spacing and states

- Targets are at least 44px tall; text is 14px / 500; horizontal links have an 8px gap, vertical links a 4px gap.
- Neutral text and hover backgrounds keep navigation quiet. Current links use sky blue, with a 16×2px underline horizontally or a soft blue background vertically.
- Keyboard focus has a 2px inset outline. It remains separate from the current-page marker and never overlaps neighboring targets.
- Horizontal navigation moves one underline as `active` changes, using `--ylf-duration-normal` (240ms) and `--ylf-ease-standard`. Rapid changes redirect it from its current position; wrapping and link size changes realign it. Its first appearance does not fly in, no current page hides it, and vertical navigation keeps its background marker. Reduced motion positions it immediately; `:animated="false"` retains static underlines.
- Allow 12px between branding and the site switch, and 16px between the brand group and navigation. The application owns header height, breakpoints and account controls.
- Shared tokens control colors, radius, typography and motion, including local themes and reduced motion.

## Usage

```vue
<script setup lang="ts">
import YlfNavigation from '@yunlefun/vue/components/YlfNavigation.vue'
import YlfNavigationLink from '@yunlefun/vue/components/YlfNavigationLink.vue'
import '@yunlefun/ui/css'
</script>

<template>
  <YlfNavigation label="Main navigation">
    <YlfNavigationLink href="/docs">
      Help
    </YlfNavigationLink>
    <YlfNavigationLink href="/blog" active>
      Blog
    </YlfNavigationLink>
  </YlfNavigation>
</template>
```

For Nuxt / Vue Router, `as-child` merges styles, current-page semantics and events onto one child link without nesting anchors. The application computes `active`; each navigation group should have at most one current page. Routing, authentication and analytics stay in the application.

```vue
<YlfNavigationLink :active="route.path.startsWith('/blog')" as-child>
  <NuxtLink to="/blog">Blog</NuxtLink>
</YlfNavigationLink>
```

Place `YlfNavigationTrigger` in the `trigger` slot of `YlfDropdownMenu`, or inside Reka `DropdownMenuTrigger as-child`. The menu owns open state, `aria-expanded`, focus restoration and keyboard behavior. The button reads these attributes instead of storing another `open` state.

```vue
<YlfDropdownMenu :items="sites" @select="switchSite">
  <template #trigger>
    <YlfNavigationTrigger>Website</YlfNavigationTrigger>
  </template>
</YlfDropdownMenu>
```

Horizontal navigation can wrap. For compact mobile headers, switch to an accessible drawer at an application-defined breakpoint and use `orientation="vertical"` inside it. The shared components do not hardcode screen widths or business links.

## Props

### YlfNavigation

| Prop          | Description                                                         | Type                     | Default      |
| ------------- | ------------------------------------------------------------------- | ------------------------ | ------------ |
| `label`       | Required accessible name; distinguish multiple navigation landmarks | `string`                 | —            |
| `orientation` | Layout and current-page marker                                      | `horizontal \| vertical` | `horizontal` |
| `animated`    | Move the current-page underline in horizontal navigation            | `boolean`                | `true`       |

### YlfNavigationLink

| Prop      | Description                                 | Type      | Default |
| --------- | ------------------------------------------- | --------- | ------- |
| `active`  | Current page; outputs `aria-current="page"` | `boolean` | `false` |
| `asChild` | Merge attributes onto one child link        | `boolean` | `false` |

Native attributes including `href`, `target`, `rel`, accessible names and events reach the actual link. Avoid fake disabled links; hide unavailable destinations or explain their availability in the application.

### YlfNavigationTrigger

| Prop       | Description            | Type      | Default |
| ---------- | ---------------------- | --------- | ------- |
| `disabled` | Native disabled button | `boolean` | `false` |

All three components expose a default slot. Trigger renders its own chevron; its slot contains the label. Other native attributes and events reach the button, whose default type is `button`.

## Verification

Tab through links and triggers, use Enter to follow a link or open a menu, and Escape to close the menu and restore trigger focus. A current page and its focused neighbor must remain distinct. Check light/dark, 390px, 768px and desktop layouts, retaining 44px mobile targets.

Visual reference: [Header navigations — Untitled UI / Dribbble](https://dribbble.com/shots/17564385-Header-navigations-Untitled-UI). These rules were validated in YunLeFun's site navigation; reference branding and content are not copied.
