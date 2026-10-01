<script setup lang="ts">
import { ref, useId } from 'vue'

const a = ref(true)
const b = ref(false)
const c = ref<boolean | 'indeterminate'>('indeterminate')
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <YlfCheckbox :id="`${id}-checked`" v-model="a" />
      <label :for="`${id}-checked`" class="text-sm">Checked</label>
    </div>
    <div class="flex items-center gap-2">
      <YlfCheckbox :id="`${id}-unchecked`" v-model="b" />
      <label :for="`${id}-unchecked`" class="text-sm">Unchecked</label>
    </div>
    <div class="flex items-center gap-2">
      <YlfCheckbox :id="`${id}-mixed`" v-model="c" />
      <label :for="`${id}-mixed`" class="text-sm">Indeterminate</label>
    </div>
    <div class="flex items-center gap-2 op-60">
      <YlfCheckbox :id="`${id}-disabled`" :model-value="true" disabled />
      <label :for="`${id}-disabled`" class="text-sm">Disabled</label>
    </div>
  </div>
</template>
