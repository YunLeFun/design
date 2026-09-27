<script setup lang="ts">
import type { AiPromptLaunch, AiPromptLaunchResult, AiPromptOptions, AiPromptTarget, AiProviderId } from './ai-prompt'
import { computed, nextTick, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { aiProviders, buildAiPromptTarget, copyAndOpenAiPrompt } from './ai-prompt'
import { aiProviderLogos } from './ai-provider-logos'

const props = withDefaults(defineProps<{
  prompt: string
  providers?: readonly AiProviderId[]
  disabled?: boolean
  locale?: 'zh-CN' | 'en'
  options?: AiPromptOptions
  /** Optional host adapter, e.g. a validated desktop IPC call. */
  launch?: AiPromptLaunch
  /** Optional native clipboard adapter. */
  copyText?: (text: string) => Promise<void>
}>(), { locale: 'zh-CN' })
const emit = defineEmits<{
  result: [result: AiPromptLaunchResult]
  busy: [value: boolean]
  /** User copied from the full-prompt field, including the manual fallback. */
  manualCopy: [prompt: string]
}>()
const id = useId()
const busy = shallowRef(false)
const message = shallowRef('')
const expanded = shallowRef(false)
const fallback = shallowRef<AiPromptTarget>()
const manualPrompt = useTemplateRef<HTMLTextAreaElement>('manual-prompt')
const unavailable = computed(() => props.disabled || busy.value || !props.prompt.trim())
const targets = computed(() => [...new Set(props.providers ?? aiProviders.map(provider => provider.id))].map(provider => buildAiPromptTarget(provider, props.prompt, props.options)))
const text = (zh: string, en: string) => props.locale === 'en' ? en : zh
let revision = 0
watch(() => props.prompt, () => {
  revision++
  message.value = ''
  fallback.value = undefined
})

function setBusy(value: boolean) {
  busy.value = value
  emit('busy', value)
}

async function manualCopy() {
  expanded.value = true
  message.value = text('自动复制未成功，请手动复制下方完整提示词。', 'Copy failed. Select and copy the full prompt below.')
  await nextTick()
  manualPrompt.value?.focus()
  manualPrompt.value?.select()
}

async function copyOnly() {
  if (unavailable.value)
    return
  const currentRevision = revision
  setBusy(true)
  try {
    await (props.copyText ? props.copyText(props.prompt) : navigator.clipboard.writeText(props.prompt))
    if (currentRevision === revision)
      message.value = text('提示词已复制，可粘贴到你常用的 AI。', 'Prompt copied. Paste it into your preferred AI.')
  }
  catch {
    if (currentRevision === revision)
      await manualCopy()
  }
  finally { setBusy(false) }
}

function action(target: AiPromptTarget) {
  return target.mode === 'link'
    ? text('带提示词打开', 'Open with prompt')
    : text('复制并打开', 'Copy and open')
}

async function open(event: MouseEvent, target: AiPromptTarget) {
  if (unavailable.value) {
    event.preventDefault()
    return
  }
  fallback.value = undefined
  const currentRevision = revision
  const prompt = props.prompt
  if (target.mode === 'link' && !props.launch) {
    message.value = text(`已前往 ${target.provider.name}。若未带入提示词，可在这里复制。`, `Opening ${target.provider.name}. If the prompt is missing, copy it here.`)
    emit('result', { target, status: 'opened' })
    return
  }
  event.preventDefault()
  setBusy(true)
  try {
    const status = await (props.launch ? props.launch(target, prompt) : copyAndOpenAiPrompt(target, prompt))
    emit('result', { target, status })
    if (currentRevision !== revision)
      return
    if (status === 'copy-failed') {
      fallback.value = target
      await manualCopy()
    }
    else if (status === 'copied' || status === 'open-failed') {
      fallback.value = target
      message.value = status === 'copied'
        ? props.launch
          ? text('提示词已复制，但未能打开 AI，请重试或手动打开。', 'Prompt copied, but the AI could not open. Retry or open it manually.')
          : text('提示词已复制，请点击下方链接继续。', 'Prompt copied. Use the link below to continue.')
        : text('未能打开 AI，请重试或手动打开。', 'Could not open the AI. Retry or open it manually.')
    }
    else {
      message.value = target.mode === 'copy'
        ? text(`已复制，请在 ${target.provider.name} 粘贴并发送。`, `Copied. Paste and send in ${target.provider.name}.`)
        : text(`已前往 ${target.provider.name}。若未带入提示词，可在这里复制。`, `Opening ${target.provider.name}. If the prompt is missing, copy it here.`)
    }
  }
  catch {
    if (currentRevision === revision) {
      fallback.value = target
      message.value = text('未能打开 AI，请复制提示词后重试。', 'Could not open the AI. Copy the prompt and try again.')
    }
    emit('result', { target, status: 'open-failed' })
  }
  finally { setBusy(false) }
}
</script>

<template>
  <div class="ylf-ai-launcher" :aria-busy="busy">
    <nav class="ylf-ai-launcher__providers" :aria-label="text('选择 AI，带上提示词', 'Choose an AI for this prompt')">
      <component
        :is="target.mode === 'link' && !launch ? 'a' : 'button'"
        v-for="target in targets"
        :key="target.provider.id"
        class="ylf-ai-launcher__provider"
        :data-provider="target.provider.id"
        :href="target.mode === 'link' && !launch && !unavailable ? target.url : undefined"
        :type="target.mode === 'link' && !launch ? undefined : 'button'"
        :disabled="target.mode === 'link' && !launch ? undefined : unavailable"
        :aria-disabled="unavailable"
        :tabindex="unavailable ? -1 : undefined"
        :aria-label="`${action(target)} ${target.provider.name}`"
        :title="target.reason === 'too-long' ? text('内容较长，将复制完整提示词后打开', 'Long prompt: copy the full text and open') : undefined"
        :target="target.mode === 'link' && !launch ? '_blank' : undefined"
        :rel="target.mode === 'link' && !launch ? 'noopener noreferrer' : undefined"
        :referrerpolicy="target.mode === 'link' && !launch ? 'no-referrer' : undefined"
        @click="open($event, target)"
      >
        <img :src="aiProviderLogos[target.provider.id]" alt="" width="40" height="40">
        <span class="ylf-ai-launcher__label">
          <strong>{{ target.provider.name }}</strong>
          <span>{{ action(target) }}</span>
        </span>
        <svg class="ylf-ai-launcher__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
      </component>
    </nav>
    <div class="ylf-ai-launcher__actions">
      <button type="button" :disabled="unavailable" @click="copyOnly">
        {{ text('仅复制提示词', 'Copy prompt only') }}
      </button>
      <span>{{ text('支持时直接带入；内容过长时复制完整提示词。', 'Opens with your prompt when supported; copies long prompts in full.') }}</span>
    </div>
    <p v-if="message" class="ylf-ai-launcher__status" role="status">
      {{ message }}
    </p>
    <a v-if="fallback && !launch" :href="fallback.provider.url" target="_blank" rel="noopener noreferrer" class="ylf-ai-launcher__fallback">{{ text('打开', 'Open') }} {{ fallback.provider.name }}</a>
    <details class="ylf-ai-launcher__details" :open="expanded" @toggle="expanded = ($event.target as HTMLDetailsElement).open">
      <summary>{{ text('查看 / 手动复制提示词', 'View / manually copy prompt') }}</summary>
      <label :for="`${id}-prompt`">{{ text('完整提示词', 'Full prompt') }}</label>
      <textarea :id="`${id}-prompt`" ref="manual-prompt" :value="prompt" readonly rows="8" @copy="emit('manualCopy', prompt)" />
    </details>
  </div>
</template>

<style scoped>
.ylf-ai-launcher {
  --_ink: var(--ylf-ai-text, var(--ylf-c-text, #0f172a));
  --_muted: var(--ylf-ai-muted, var(--ylf-c-text-2, #475569));
  --_border: var(--ylf-ai-border, var(--ylf-c-border, #e2e8f0));
  --_surface: var(--ylf-ai-surface, var(--ylf-c-surface, #fff));
  --_soft: var(--ylf-ai-background, var(--ylf-c-bg-soft, #f8fafc));
  --_brand: var(--ylf-ai-accent, var(--ylf-c-brand, #2563eb));
  color: var(--_ink);
  container: ylf-ai / inline-size;
}
.ylf-ai-launcher__providers {
  display: grid;
  grid-template-columns: repeat(var(--ylf-ai-columns, 3), minmax(0, 1fr));
  gap: var(--ylf-ai-gap, 10px);
  margin: 12px 0;
}
.ylf-ai-launcher__provider {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: var(--ylf-ai-item-gap, 10px);
  min-width: 0;
  min-height: var(--ylf-ai-item-height, 76px);
  padding: var(--ylf-ai-item-padding, 12px);
  border: 1px solid var(--_border);
  border-radius: var(--ylf-ai-radius, var(--ylf-radius, 14px));
  background: var(--_soft);
  color: inherit;
  text-decoration: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background-color 160ms ease;
}
.ylf-ai-launcher__provider:not([aria-disabled='true']):hover {
  border-color: var(--_brand);
  background: var(--_surface);
}
.ylf-ai-launcher__provider img {
  box-sizing: border-box;
  flex: none;
  width: var(--ylf-ai-logo-size, 40px);
  height: var(--ylf-ai-logo-size, 40px);
  padding: 4px;
  border-radius: 10px;
  background: #fff;
  object-fit: contain;
}
.ylf-ai-launcher__label {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.ylf-ai-launcher__label strong {
  font-size: var(--ylf-ai-name-size, 14px);
  line-height: 1.4;
}
.ylf-ai-launcher__label > span {
  color: var(--_muted);
  font-size: var(--ylf-ai-action-size, 12px);
  line-height: 1.5;
}
.ylf-ai-launcher__arrow {
  flex: none;
  width: 16px;
  height: 16px;
  margin-left: auto;
  color: var(--_muted);
}
.ylf-ai-launcher__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
.ylf-ai-launcher__actions button {
  min-height: 44px;
  padding: 8px 14px;
  border: 1px solid var(--_border);
  border-radius: 999px;
  background: var(--_surface);
  color: var(--_ink);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.ylf-ai-launcher__actions > span,
.ylf-ai-launcher__status {
  color: var(--_muted);
  font-size: 12px;
  line-height: 1.7;
}
.ylf-ai-launcher__fallback {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: var(--_brand);
}
.ylf-ai-launcher__details {
  margin-top: 8px;
  font-size: 13px;
}
.ylf-ai-launcher__details summary {
  display: list-item;
  min-height: 44px;
  padding: 12px 0;
  box-sizing: border-box;
  color: var(--_muted);
  cursor: pointer;
}
.ylf-ai-launcher__details label {
  display: block;
  margin: 8px 0;
}
.ylf-ai-launcher__details textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--_border);
  border-radius: 10px;
  background: var(--_surface);
  color: var(--_ink);
  font: inherit;
  font-size: 16px;
  line-height: 1.7;
  resize: vertical;
}
:is(button, a, textarea, summary):focus-visible {
  outline: 3px solid var(--_brand);
  outline-offset: 3px;
}
:is(button:disabled, [aria-disabled='true']) {
  opacity: 0.5;
  cursor: not-allowed;
}
@container ylf-ai (max-width: 620px) {
  .ylf-ai-launcher__providers {
    grid-template-columns: repeat(var(--ylf-ai-columns, 2), minmax(0, 1fr));
  }
}
@container ylf-ai (max-width: 400px) {
  .ylf-ai-launcher__providers {
    grid-template-columns: repeat(var(--ylf-ai-columns, 1), minmax(0, 1fr));
  }
}
@media (prefers-reduced-motion: reduce) {
  .ylf-ai-launcher__provider {
    transition: none;
  }
}
</style>
