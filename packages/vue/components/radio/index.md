---
title: Radio
title_zh: 单选框
---

单选框组：行为与可访问性基于 [reka-ui](https://reka-ui.com)（`role="radiogroup"`、方向键 roving focus），外观使用共享主题 token。

## Props

| 属性          | 说明     | 类型                     | 默认值     |
| ------------- | -------- | ------------------------ | ---------- |
| `v-model`     | 选中值   | `string`                 | —          |
| `options`     | 选项列表 | `RadioOption[]`          | —          |
| `orientation` | 排列方向 | `vertical \| horizontal` | `vertical` |
| `disabled`    | 整组禁用 | `boolean`                | `false`    |

### RadioOption

| 字段       | 说明     | 类型       |
| ---------- | -------- | ---------- |
| `label`    | 文案     | `string`   |
| `value`    | 值       | `string`   |
| `disabled` | 禁用该项 | `boolean?` |
