<script setup lang="ts">
import type { DeepReadonly } from 'vue'
import type { DemoDraft } from './demo-types'
import { computed, useId } from 'vue'
import YlfButton from '../../../../vue/components/YlfButton.vue'
import YlfInput from '../../../../vue/components/YlfInput.vue'
import YlfSelect from '../../../../vue/components/YlfSelect.vue'

const props = defineProps<{ draft: DeepReadonly<DemoDraft>, submitted: boolean, disabled: boolean, english: boolean }>()
const emit = defineEmits<{ update: [draft: DemoDraft], submit: [] }>()
const id = useId()
const canSubmit = computed(() => !props.disabled && !props.submitted && !!props.draft.title.trim() && !!props.draft.audience.trim())
const tones = computed(() => [
  { value: 'friendly', label: props.english ? 'Friendly' : '亲切' },
  { value: 'formal', label: props.english ? 'Formal' : '正式' },
] as const)
function update<K extends keyof DemoDraft>(field: K, value: DemoDraft[K] | undefined) {
  if (value === undefined || props.disabled || props.submitted)
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
        <YlfInput :id="`${id}-title`" :model-value="draft.title" :disabled="disabled || submitted" required @update:model-value="update('title', $event)" />
      </label>
      <label class="draft-label" :for="`${id}-audience`">
        {{ english ? 'Audience' : '参与对象' }}
        <YlfInput :id="`${id}-audience`" :model-value="draft.audience" :disabled="disabled || submitted" required @update:model-value="update('audience', $event)" />
      </label>
      <div class="draft-label">
        <label :for="`${id}-tone`">{{ english ? 'Writing tone' : '文案语气' }}</label>
        <YlfSelect :id="`${id}-tone`" :model-value="draft.tone" :options="tones" :disabled="disabled || submitted" @update:model-value="update('tone', $event)" />
      </div>
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
.draft-note {
  margin: 0;
  color: var(--ylf-status-success-text);
  font-size: 13px;
}
</style>
