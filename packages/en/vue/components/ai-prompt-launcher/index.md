---
title: AI Prompt Launcher
---

Bring a prompt to common AI services. Applications generate prompts and handle replies; this component provides entries, copying, status and manual copy fallback.

## Usage {#使用}

```vue
<script setup lang="ts">
import YlfAiPromptLauncher from '@yunlefun/vue/components/YlfAiPromptLauncher.vue'
</script>

<template>
  <YlfAiPromptLauncher :prompt="prompt" :disabled="!valid" locale="en" />
</template>
```

| Prop        | Description                                                           |
| ----------- | --------------------------------------------------------------------- |
| `prompt`    | Required complete prompt; whitespace-only content cannot launch       |
| `providers` | Optional service IDs controlling order and visibility; six by default |
| `disabled`  | Disable when application validation fails                             |
| `locale`    | `zh-CN` (default) or `en`                                             |
| `options`   | `{ chatgptSearch?: boolean, maxUrlLength?: number }`                  |
| `launch`    | Optional host opener `(target, prompt) => Promise<status>`            |
| `copyText`  | Optional host clipboard `(text) => Promise<void>`                     |

Busy(boolean) lets the application lock input. Result({ target, status }) reports opening/copying. It describes browser/host actions and does not prove that the service received, prefilled or sent the prompt.

## Independent theming and overrides {#独立主题与样式覆盖}

Set `--ylf-ai-*` on an application class to customize only this entry. Otherwise it follows `--ylf-c-*` and component defaults. Logos ship with the package; no icon plugin is required.

| Variable                                                                        | Purpose / default                             |
| ------------------------------------------------------------------------------- | --------------------------------------------- |
| `--ylf-ai-text`, `--ylf-ai-muted`                                               | Primary and supporting text                   |
| `--ylf-ai-border`, `--ylf-ai-surface`, `--ylf-ai-background`, `--ylf-ai-accent` | Border, surface, background and focus         |
| `--ylf-ai-columns`                                                              | Fixed columns; otherwise responsive 3 / 2 / 1 |
| `--ylf-ai-gap`, `--ylf-ai-item-gap`                                             | Card/inner gaps, `10px`                       |
| `--ylf-ai-item-height`, `--ylf-ai-item-padding`                                 | Minimum height `76px`, padding `12px`         |
| `--ylf-ai-radius`, `--ylf-ai-logo-size`                                         | Radius `14px`, logo `40px`                    |
| `--ylf-ai-name-size`, `--ylf-ai-action-size`                                    | Service name `14px`, action text `12px`       |

```vue
<template>
  <YlfAiPromptLauncher class="cms-ai-entry" :prompt="prompt" locale="en" />
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
/* Further structural customization can use scoped :deep(). */
.cms-ai-entry :deep(.ylf-ai-launcher__actions) {
  align-items: flex-start;
}
</style>
```

Public hooks: `.ylf-ai-launcher__providers`, `__provider`, `__label`, `__arrow`, `__actions`, `__status`, `__details`, `__fallback`. Per-service overrides can use `[data-provider="cursor"]`. Preserve disabled, keyboard focus and status semantics, including manual copy fallback.

Manual-copy(prompt) fires when the user copies from the complete prompt field. A CMS can record the matching request snapshot even when clipboard APIs fail. This event indicates copying, not third-party receipt.

## Link capabilities {#链接能力}

| ID         | Entry                                     | Behavior                                                   |
| ---------- | ----------------------------------------- | ---------------------------------------------------------- |
| `yuanbao`  | `https://yuanbao.tencent.com/`            | No confirmed public prefill protocol; copy then open       |
| `doubao`   | `https://www.doubao.com/chat/`            | Internal url-action uses validation tokens; copy then open |
| `deepseek` | `https://chat.deepseek.com/?q=...`        | Prefill without autosend                                   |
| `chatgpt`  | `https://chatgpt.com/?q=...`              | Open with prompt; may begin the conversation directly      |
| `claude`   | `https://claude.ai/new?q=...`             | Open with prompt; login/confirmation may come first        |
| `cursor`   | `https://cursor.com/link/prompt?text=...` | Official HTTPS handoff, then user opens Cursor             |

No shared cross-site protocol exists. Rules live in `ai-prompt.ts`. Only explicit chatgptSearch adds hints=search; story and revision prompts do not force search by default.

The default encoded URL budget is 8,192 characters, a conservative component policy rather than an official service limit. Cursor's documented limit is 10,000; the component reserves room for HTTPS-to-cursor conversion. Long prompts are copied completely before opening, without truncation, compression or autosend. Users can always choose copy-only or manual full-text copy. Authentication, network and service changes can affect handoff.

Verification record (2026-09-27):

- [Cursor official deeplinks](https://cursor.com/docs/reference/deeplinks): text, HTTPS entry and the 10,000 character limit.
- [Claude official Desktop links](https://support.claude.com/en/articles/14729294-open-claude-desktop-with-a-link): q prefill for the desktop protocol, not a stability guarantee for the website. Web /new?q= retained its parameter through login; post-login prefill was not verified.
- ChatGPT: the tested q URL entered a conversation containing the prompt and may send directly. No public stable protocol commitment was found.
- DeepSeek: the current implementation supported q, and the tested complete Chinese prompt matched its input.

## Pure functions and CMS / Electron {#纯函数与-cms-electron}

```ts
import { buildAiPromptTarget } from '@yunlefun/vue/ai-prompt'

const target = buildAiPromptTarget('cursor', articlePrompt)
// target.mode: 'link' | 'copy'
// target.reason: 'too-long' | 'unsupported' | 'empty' | undefined
```

The module works in Node/SSR without touching window/navigator on import. The component imports no Electron and stores no API key.

In a CMS, the article workspace generates and stores a requestId/source snapshot and passes the complete prompt. Connect launch/copyText to existing preload APIs. The main process receives a service ID, prompt and allowed options, calls buildAiPromptTarget again, then writes the native clipboard or calls shell.openExternal. Do not forward arbitrary renderer URLs to shell.openExternal.

Launch returns opened, copied, copy-failed or open-failed; copied means text was copied but opening failed. The component offers manual fallback, while desktop hosts should expose retry. Confirm the request snapshot only after copying, opening or manual copy. Reply parsing, diff approval, undo and saving belong to the CMS.

## Distribution {#分发}

The component and pure functions ship through `@yunlefun/vue`. Applications consume npm and their own CSS variables instead of copying component source or link rules.
