---
title: Button
title_zh: 按钮
---

主操作默认使用晴空蓝实色；品牌展示可显式选择 `aurora` 极光变体。描边、柔色和透明按钮用于次级操作，成功、提醒与危险变体表达对应的状态语义。

## Registry

Button 可以通过 URL 将组件源码和共享品牌 token 复制进业务项目；命令、边界和发布验收见 [Registry 分发](/guide/registry)。稳定基础组件仍优先通过 `@yunlefun/vue` 使用。

## Props

| 属性       | 说明                 | 类型                                                                              | 默认值     |
| ---------- | -------------------- | --------------------------------------------------------------------------------- | ---------- |
| `variant`  | 风格                 | `primary \| aurora \| secondary \| soft \| ghost \| success \| warning \| danger` | `primary`  |
| `size`     | 尺寸                 | `sm \| md \| lg`                                                                  | `md`       |
| `round`    | 胶囊圆角（云是软的） | `boolean`                                                                         | `true`     |
| `block`    | 占满整行宽度         | `boolean`                                                                         | `false`    |
| `loading`  | 加载态               | `boolean`                                                                         | `false`    |
| `disabled` | 禁用                 | `boolean`                                                                         | `false`    |
| `tag`      | 渲染标签，如 `'a'`   | `string`                                                                          | `'button'` |

## Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 按钮文字 |
| `icon`    | 左侧图标 |

## Events

| 名称    | 说明                                          |
| ------- | --------------------------------------------- |
| `click` | 点击时触发（`disabled` / `loading` 下不触发） |
