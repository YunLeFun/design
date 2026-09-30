---
title: Checkbox
title_zh: 复选框
---

复选框：行为与可访问性基于 [reka-ui](https://reka-ui.com)（`role="checkbox"`、键盘、`indeterminate` 三态），外观使用共享主题 token。

## Props

| 属性       | 说明       | 类型                         | 默认值  |
| ---------- | ---------- | ---------------------------- | ------- |
| `v-model`  | 勾选状态   | `boolean \| 'indeterminate'` | `false` |
| `value`    | 表单提交值 | `string`                     | —       |
| `disabled` | 禁用       | `boolean`                    | `false` |

每个复选框必须有可访问名称：传入 `aria-label="同意服务条款"`，或通过 `id` 与 `<label for>` 关联。旁边的普通 `<span>` 不会自动成为标签。`name` 和 `required` 透传给 Reka UI；置于原生表单时，勾选值进入 `FormData`，禁用项不提交。
