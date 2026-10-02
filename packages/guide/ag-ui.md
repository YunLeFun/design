# AG-UI 接入

`@yunlefun/vue/ag-ui` 是可选的 Vue 状态适配层，基于官方 `@ag-ui/client`。它把流式消息、共享状态、运行结果和待处理工具调用交给现有云乐坊组件展示。基础组件、Reka UI 和文档主题不依赖 AG-UI。

<script setup>
import AgUiDemo from '../.vitepress/theme/components/ag-ui/AgUiDemo.vue'
</script>

## 交互演示

发送消息后，等待流式回复，再选择允许或拒绝读取主题。也可以在接收中停止，或模拟连接错误。演示通过本地 SSE 响应驱动真实的 `HttpAgent` 解析器，不调用模型或网络服务。

<AgUiDemo />

## 安装与连接

此入口从 `@yunlefun/vue` 0.5.0 提供。固定发行包：

```sh
pnpm add https://github.com/YunLeFun/design/releases/download/release-vue-0.5.0/yunlefun-vue-0.5.0.tgz @ag-ui/client@^1.0.1
```

```vue
<script setup lang="ts">
import { HttpAgent } from '@ag-ui/client'
import { useAgUiAgent } from '@yunlefun/vue/ag-ui'

// 后端需实现 AG-UI HTTP/SSE 接口；每个会话创建独立实例。
const agent = new HttpAgent({ url: '/api/agent' })
const { messages, state, status, isRunning, error, send, cancel } = useAgUiAgent(agent)
</script>

<template>
  <p v-for="message in messages" :key="message.id">
    {{ message.content }}
  </p>
  <p v-if="error" role="alert">
    {{ error.message }}
  </p>
  <button :disabled="isRunning" @click="send('你好')">
    发送
  </button>
  <button :disabled="!isRunning" @click="cancel">
    停止
  </button>
  <pre>{{ { status, state } }}</pre>
</template>
```

将 `/api/agent` 替换为自己的 AG-UI 服务。认证由服务端或已有登录会话负责；`HttpAgent` 支持 headers 和自定义 fetch。API Key 留在后端。设置 composable 本身不会发起连接，Vue scope 销毁时自动取消运行并解除订阅；在 scope 外使用时调用 `dispose()`。

## API

| 成员                             | 用途                                                                                           |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `messages` / `state`             | SDK 驱动的只读响应式快照，包含消息流、状态快照与 JSON Patch 结果                               |
| `status`                         | `idle`、`running`、`success`、`cancelled`、`interrupted` 或 `error`                            |
| `isRunning` / `error`            | 请求是否尚未结束、最后一次错误                                                                 |
| `send(text, parameters?)`        | 添加用户消息并运行；空白消息不发送                                                             |
| `run(parameters?)`               | 继续当前会话；参数沿用官方 `RunAgentParameters`，包括 tools、context、forwardedProps 和 resume |
| `cancel()`                       | 取消当前运行，保留已收到的消息；结束清理前不接受第二次运行                                     |
| `setState(value)`                | 空闲时更新共享状态，下次请求携带此状态                                                         |
| `pendingToolCallIds`             | 官方客户端在成功结束事件中报告的待处理工具调用                                                 |
| `addToolResult(id, content)`     | 显式添加待处理工具的结果，再调用 `run()` 继续；未知或重复结果被拒绝                            |
| `interrupts` / `isAwaitingInput` | AG-UI 1.0 中断及等待输入状态；通过 `run({ resume })` 按官方格式回复                            |
| `dispose()`                      | 幂等取消与释放订阅                                                                             |

网络或协议错误记录在 `error`/`status`，运行 Promise 返回 `undefined`；并发运行、仍有工具结果待回传、销毁后使用等调用错误会抛出。一个 agent 实例由一个 composable 管理，通过其方法发起运行。

## 工具调用与中断

工具事件仅作为数据展示。宿主校验工具名称与参数，按业务要求请求确认，执行允许的操作，再使用 `addToolResult` 回传结果。适配层不会执行 Agent 返回的代码，也不会自动循环调用工具。

AG-UI 1.0 的 interrupt/resume 与普通工具结果是两种协议机制：`interrupts` 原样保留官方字段；宿主根据具体 interrupt 构造 `resume`。此演示覆盖普通工具确认，测试覆盖 interrupt 状态与继续请求。

消息、状态与工具参数都来自服务端。通过 Vue 文本插值或经过校验的业务组件渲染；泛型 `useAgUiAgent<MyState>` 仅提供类型提示，运行时结构校验由业务负责。

[官方协议](https://github.com/ag-ui-protocol/ag-ui) · [客户端 SDK](https://docs.ag-ui.com/sdk/js/client/overview)
