# AG-UI integration

`@yunlefun/vue/ag-ui` is an optional Vue state adapter built on the official `@ag-ui/client`. Use existing YunLeFun components to display streamed messages, shared state, run outcomes and pending tools. Basic components, Reka UI and the documentation theme do not depend on AG-UI.

<script setup>
import AgUiDemo from '../../.vitepress/theme/components/ag-ui/AgUiDemo.vue'
</script>

## Interactive demo

Send a message, then allow or decline the read-only theme request. Stop an active response or simulate a connection error. Local SSE responses exercise the real `HttpAgent` parser without a model or network service.

<AgUiDemo />

## Install and connect

This entry is available from `@yunlefun/vue` 0.5.0. Install the fixed release artifact:

```sh
pnpm add https://github.com/YunLeFun/design/releases/download/release-vue-0.5.0/yunlefun-vue-0.5.0.tgz @ag-ui/client@^1.0.1
```

```vue
<script setup lang="ts">
import { HttpAgent } from '@ag-ui/client'
import { useAgUiAgent } from '@yunlefun/vue/ag-ui'

// Supply an AG-UI HTTP/SSE endpoint and a separate agent per conversation.
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
  <button :disabled="isRunning" @click="send('Hello')">
    Send
  </button>
  <button :disabled="!isRunning" @click="cancel">
    Stop
  </button>
  <pre>{{ { status, state } }}</pre>
</template>
```

Replace `/api/agent` with your service. Authentication belongs to the backend or an existing user session; `HttpAgent` accepts headers and a custom fetch function. Keep model API keys on the server. Setup does not connect, including during SSR. Vue scope disposal cancels the run and unsubscribes; call `dispose()` when used outside a scope.

## API

| Member                           | Purpose                                                                                                           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `messages` / `state`             | Readonly reactive snapshots updated by the SDK, including streamed messages and JSON Patch state                  |
| `status`                         | `idle`, `running`, `success`, `cancelled`, `interrupted` or `error`                                               |
| `isRunning` / `error`            | Whether a request is still settling, and the last error                                                           |
| `send(text, parameters?)`        | Add a user message and run; whitespace-only input is ignored                                                      |
| `run(parameters?)`               | Continue the conversation with official `RunAgentParameters`, including tools, context, forwardedProps and resume |
| `cancel()`                       | Cancel while preserving partial output; no new run starts until cleanup finishes                                  |
| `setState(value)`                | Update state while idle; the next request includes it                                                             |
| `pendingToolCallIds`             | Pending tools reported by the official client on a successful run outcome                                         |
| `addToolResult(id, content)`     | Add an explicit result, then call `run()`; unknown or duplicate results are rejected                              |
| `interrupts` / `isAwaitingInput` | AG-UI 1.0 interrupts and input state; reply using the official `run({ resume })` format                           |
| `dispose()`                      | Idempotent cancellation and subscription cleanup                                                                  |

Network/protocol failures set `error`/`status` and resolve the run Promise to `undefined`. Invalid concurrent use, starting with pending tool results, or use after disposal throws. Give each agent one composable owner and run it through this API.

## Tools and interrupts

Tool events are data. The host validates tool names and arguments, requests any required confirmation, performs allowed actions and returns the result with `addToolResult`. The adapter does not execute generated code or automatically loop through tools.

AG-UI 1.0 interrupt/resume and ordinary tool results are separate mechanisms. `interrupts` retains official fields; the host constructs a matching `resume`. This demo covers ordinary tool confirmation; tests cover interrupt state and continuation requests.

Render server messages, state and arguments with Vue text interpolation or validated business components. `useAgUiAgent<MyState>` supplies TypeScript hints only; the host validates data at runtime.

[Protocol](https://github.com/ag-ui-protocol/ag-ui) · [Client SDK](https://docs.ag-ui.com/sdk/js/client/overview)
