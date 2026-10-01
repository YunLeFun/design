---
title: Accordion
---

Accordion uses [Reka UI](https://reka-ui.com) for expansion, keyboard navigation and single/multiple mode. Tokens define appearance and height transitions.

## Props

| Prop          | Description                                   | Type                  | Default  |
| ------------- | --------------------------------------------- | --------------------- | -------- |
| `v-model`     | Expanded items                                | `string \| string[]`  | —        |
| `items`       | Items `{ value, title, content?, disabled? }` | `AccordionItemData[]` | —        |
| `type`        | Single / multiple                             | `single \| multiple`  | `single` |
| `collapsible` | Allow all items to collapse in single mode    | `boolean`             | `true`   |

## Slots

Override an item's `content` with a slot named after its `value`.

Readonly item arrays are supported. A fully collapsed single accordion has value `undefined`; multiple mode uses a string array. Allow collapsed state in the consumer. Arrows and Home/End move focus between headings, skipping disabled items.
