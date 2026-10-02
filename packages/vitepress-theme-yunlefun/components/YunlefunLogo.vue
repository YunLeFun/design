<script setup lang="ts">
import { icons } from '@yunlefun/icons'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name?: 'brand-mark' | 'design-mark'
  label?: string
}>(), { name: 'brand-mark' })

const icon = computed(() => icons.icons[props.name])
const viewBox = computed(() => `0 0 ${icon.value.width || icons.width || 16} ${icon.value.height || icons.height || 16}`)
</script>

<template>
  <!-- Only sanitized, packaged Iconify data is rendered; no user-provided markup. -->
  <!-- eslint-disable vue/no-v-html -->
  <svg
    class="ylf-brand-logo"
    :data-icon="`ylf:${name}`"
    :viewBox="viewBox"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
    focusable="false"
    v-html="icon.body"
  />
</template>

<style scoped>
.ylf-brand-logo {
  display: block;
  flex: none;
  width: auto;
  height: 28px;
  color: var(--ylf-c-brand);
}
</style>
