<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { DemoDraft } from './demo-types'
import { computed, useId } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'

const props = defineProps<{ draft: DeepReadonly<DemoDraft>, submitted: boolean, disabled: boolean, english: boolean }>()
const emit = defineEmits<{ update: [draft: DemoDraft], submit: [] }>()
const id = useId()
const canSubmit = computed(() => !props.disabled && !props.submitted && !!props.draft.title.trim() && !!props.draft.audience.trim())
function update(field: keyof DemoDraft, event: Event) {
  const value = (event.target as HTMLInputElement | HTMLSelectElement).value
  if (field === 'tone' && value !== 'friendly' && value !== 'formal')
    return
  emit('update', { ...props.draft, [field]: value })
}
</script>

<template>
  <form class="draft-form ylf-workbench-panel" :data-submitted="submitted" :aria-label="english ? 'Workshop draft' : '活动草稿'" @submit.prevent="canSubmit && emit('submit')">
    <h3 class="draft-heading">
      {{ english ? 'Review the draft' : '确认活动草稿' }}
    </h3>
    <div class="draft-fields">
      <label class="draft-label" :for="`${id}-title`">
        {{ english ? 'Workshop title' : '活动名称' }}
        <input :id="`${id}-title`" class="draft-input" :value="draft.title" :disabled="disabled || submitted" required @input="update('title', $event)">
      </label>
      <label class="draft-label" :for="`${id}-audience`">
        {{ english ? 'Audience' : '参与对象' }}
        <input :id="`${id}-audience`" class="draft-input" :value="draft.audience" :disabled="disabled || submitted" required @input="update('audience', $event)">
      </label>
      <label class="draft-label" :for="`${id}-tone`">
        {{ english ? 'Writing tone' : '文案语气' }}
        <select :id="`${id}-tone`" class="draft-input" :value="draft.tone" :disabled="disabled || submitted" @change="update('tone', $event)">
          <option value="friendly">{{ english ? 'Friendly' : '亲切' }}</option>
          <option value="formal">{{ english ? 'Formal' : '正式' }}</option>
        </select>
      </label>
    </div>
    <p v-if="submitted" class="draft-note">
      {{ english ? 'Your edited draft has been confirmed and returned.' : '修改后的草稿已确认并回传。' }}
    </p>
    <YlfButton v-else type="submit" size="sm" :disabled="!canSubmit">
      {{ english ? 'Confirm draft and continue' : '确认草稿并继续' }}
    </YlfButton>
  </form>
</template>

<style scoped>
.draft-form {
  padding: 20px;
}
.draft-heading {
  margin: 0 0 16px;
  font-size: 16px;
}
.draft-fields {
  display: grid;
  gap: 14px;
  margin-bottom: 18px;
}
.draft-label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}
.draft-input {
  width: 100%;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--ylf-c-border-strong);
  border-radius: var(--ylf-radius-sm);
  background: var(--ylf-c-bg);
  color: var(--ylf-c-text);
  font: inherit;
}
.draft-input:focus-visible {
  outline: 2px solid var(--ylf-c-brand);
  outline-offset: 2px;
}
.draft-input:disabled {
  opacity: 0.65;
}
.draft-note {
  margin: 0;
  color: var(--ylf-status-success-text);
  font-size: 13px;
}
</style>
