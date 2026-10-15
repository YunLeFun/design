---
title: Agent Status
title_zh: 机器人状态
---

使用语义色、图形和明确文字表达机器人连接与任务状态。状态来自调用方，组件不会根据颜色推测连接成功，也不播放持续动画。

`state` 是展示角色：`offline` 离线、`connecting` 连接中、`ready` 就绪或成功、`working` 执行中、`waiting` 等待人工操作、`error` 失败、`unknown` 未验证。必须同时提供本地化的 `label`。HTTP 回调正在监听时可使用 `waiting` 与“回调已监听”，不要标记为“已连接”。

## Props

| 属性    | 说明                   | 类型            | 默认值  |
| ------- | ---------------------- | --------------- | ------- |
| `state` | 展示状态               | `YlfAgentState` | 必填    |
| `label` | 本地化的真实状态文字   | `string`        | 必填    |
| `live`  | 为单个摘要开启礼貌播报 | `boolean`       | `false` |

默认不创建 live region，避免轮询列表反复播报。需要播报时，只为一个摘要设置 `live`。

源码及 Registry 尚待发布。接入方式见[机器人组件](/guide/agent-ui)。
