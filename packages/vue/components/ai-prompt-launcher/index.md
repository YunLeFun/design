---
title: AI Prompt Launcher
title_zh: AI 提示词入口
description: 带服务 logo 的外部 AI 入口，统一提示词链接、复制兜底与桌面适配。
---

把提示词带到常用 AI。业务负责生成提示词与处理回复，组件负责入口、复制、状态提示和手动复制兜底。

## 使用

```vue
<script setup lang="ts">
import YlfAiPromptLauncher from '@yunlefun/vue/components/YlfAiPromptLauncher.vue'
</script>

<template>
  <YlfAiPromptLauncher :prompt="prompt" :disabled="!valid" />
</template>
```

| 属性        | 说明                                                     |
| ----------- | -------------------------------------------------------- |
| `prompt`    | 必填的完整提示词；空白内容不可点击                       |
| `providers` | 可选的服务 ID 列表，控制顺序和显示范围；默认六家         |
| `disabled`  | 业务校验未通过时禁用                                     |
| `locale`    | `zh-CN`（默认）或 `en`                                   |
| `options`   | `{ chatgptSearch?: boolean, maxUrlLength?: number }`     |
| `launch`    | 可选的宿主打开函数 `(target, prompt) => Promise<status>` |
| `copyText`  | 可选的宿主剪贴板函数 `(text) => Promise<void>`           |

事件：`busy(boolean)` 便于业务锁住输入；`result({ target, status })` 返回打开或复制结果。结果描述浏览器/宿主操作，无法证明第三方最终收到、预填或发送成功。

## 独立主题与样式覆盖

优先在组件的业务 class 上设置 `--ylf-ai-*`，只影响这个入口；未设置时沿用 `--ylf-c-*` 主题和组件默认值。无需图标插件，logo 随包分发。

| 变量                                                                            | 用途 / 默认值                                   |
| ------------------------------------------------------------------------------- | ----------------------------------------------- |
| `--ylf-ai-text`、`--ylf-ai-muted`                                               | 主文字与说明文字                                |
| `--ylf-ai-border`、`--ylf-ai-surface`、`--ylf-ai-background`、`--ylf-ai-accent` | 边框、表面、卡片底色、焦点强调                  |
| `--ylf-ai-columns`                                                              | 固定列数；默认随容器宽度在 3 / 2 / 1 列之间切换 |
| `--ylf-ai-gap`、`--ylf-ai-item-gap`                                             | 卡片间距、卡片内部间距，默认 `10px`             |
| `--ylf-ai-item-height`、`--ylf-ai-item-padding`                                 | 最小高度 `76px`、内边距 `12px`                  |
| `--ylf-ai-radius`、`--ylf-ai-logo-size`                                         | 圆角 `14px`、logo `40px`                        |
| `--ylf-ai-name-size`、`--ylf-ai-action-size`                                    | 服务名 `14px`、操作说明 `12px`                  |

```vue
<template>
  <YlfAiPromptLauncher class="cms-ai-entry" :prompt="prompt" />
</template>

<style scoped>
.cms-ai-entry {
  --ylf-ai-text: var(--ink);
  --ylf-ai-muted: var(--muted);
  --ylf-ai-border: var(--line);
  --ylf-ai-surface: var(--paper);
  --ylf-ai-background: var(--paper);
  --ylf-ai-accent: var(--blue);
  --ylf-ai-columns: 2;
  --ylf-ai-radius: 8px;
  --ylf-ai-logo-size: 28px;
  --ylf-ai-item-padding: 8px;
}
/* 结构样式的额外定制可用 scoped :deep()，无需复制组件。 */
.cms-ai-entry :deep(.ylf-ai-launcher__actions) {
  align-items: flex-start;
}
</style>
```

公开样式钩子：`.ylf-ai-launcher__providers`、`__provider`、`__label`、`__arrow`、`__actions`、`__status`、`__details`、`__fallback`。按服务覆盖可用 `[data-provider="cursor"]`。请保留禁用、键盘焦点和状态提示语义，不隐藏手动复制兜底。

`manual-copy(prompt)` 在用户复制完整提示词文本框时触发，CMS 可据此记录对应请求快照，保证剪贴板 API 不可用时仍能完成回填。该事件代表复制操作，不证明第三方收到了提示词。

## 链接能力

| ID         | 入口                                      | 行为                                     |
| ---------- | ----------------------------------------- | ---------------------------------------- |
| `yuanbao`  | `https://yuanbao.tencent.com/`            | 未确认公开预填协议；复制后打开           |
| `doubao`   | `https://www.doubao.com/chat/`            | 站内 `url-action` 有校验令牌；复制后打开 |
| `deepseek` | `https://chat.deepseek.com/?q=...`        | 预填，不添加 `autosend`                  |
| `chatgpt`  | `https://chatgpt.com/?q=...`              | 带提示词打开，站点可能直接开始对话       |
| `claude`   | `https://claude.ai/new?q=...`             | 带提示词打开，可能先登录或确认           |
| `cursor`   | `https://cursor.com/link/prompt?text=...` | 官方 HTTPS 中转页，再由用户打开 Cursor   |

没有统一的跨站协议，适配规则集中在 `ai-prompt.ts`。`chatgptSearch` 显式开启时才添加 `hints=search`，愿望故事和改稿默认不强制联网搜索。

默认 URL 编码后的预算是 8,192 个字符（组件的保守策略，不是各站官方上限）。Cursor 官方上限是 10,000，组件额外为 HTTPS 中转转成 `cursor://` 预留空间。超长提示词全部复制后打开；不截断、压缩或添加自动发送参数。用户也始终可以仅复制，或展开全文手动复制。登录、网络、第三方改版可能影响带入。

核验记录（2026-09-27）：

- [Cursor 官方 Deeplinks](https://cursor.com/docs/reference/deeplinks)：`text`、HTTPS 入口和 10,000 字符限制。
- [Claude 官方 Desktop 链接](https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link)：`q` 预填；该文档是桌面协议，不应当视为网页接口的稳定性保证。网页 `/new?q=` 本次保留参数进入登录流程，登录后的填入尚未验证。
- ChatGPT：按 `https://chatgpt.com/?q=...` 实测进入包含提示词的对话，行为可能直接发送，未找到公开稳定协议承诺。
- DeepSeek：当前网页实现支持 `q`，完整中文提示词在浏览器输入区实测匹配。

## 纯函数与 CMS / Electron

```ts
import { buildAiPromptTarget } from '@yunlefun/vue/ai-prompt'

const target = buildAiPromptTarget('cursor', articlePrompt)
// target.mode: 'link' | 'copy'
// target.reason: 'too-long' | 'unsupported' | 'empty' | undefined
```

模块可在 Node / SSR 使用，导入时不访问 `window` 或 `navigator`。组件不导入 Electron，也不持有 API Key。

CMS 接入时由文章工作区生成并保存 requestId / 原文快照，将完整提示词传入组件；通过 `launch` 和 `copyText` 接现有 preload API。主进程接收服务 ID、提示词及允许的选项，重新调用 `buildAiPromptTarget`，再决定写入原生剪贴板或 `shell.openExternal`。不要将任意 renderer URL 直接交给 `shell.openExternal`。

`launch` 返回 `opened`、`copied`、`copy-failed` 或 `open-failed`；`copied` 表示文本已复制但无法打开。组件可以手动复制兜底；桌面宿主应在自身 UI 中提供重试。复制、打开或用户手动复制后业务才确认本次请求快照，回复解析、差异确认、撤销和保存均留在 CMS。

## 分发

组件和纯函数统一通过 `@yunlefun/vue` 分发；业务只引用 npm 包并设置自己的 CSS 变量，不复制组件源码或链接规则。
