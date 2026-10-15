<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md'
  invalid?: boolean
}>(), { size: 'md', invalid: false })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <input v-model="model" class="ylf-input" :data-size="size" :aria-invalid="invalid || undefined">
</template>

<style scoped>
.ylf-input {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid var(--ylf-c-border-strong, #cbd5e1);
  border-radius: var(--ylf-radius, 14px);
  background: var(--ylf-c-surface, #fff);
  color: var(--ylf-c-text, #0f172a);
  font-family: var(--ylf-font-body, inherit);
  font-size: 15px;
  line-height: 1.5;
  box-shadow: var(--ylf-shadow-control);
  transition: border-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, ease);
}
.ylf-input::placeholder {
  color: var(--ylf-c-text-3, #64748b);
}
.ylf-input:hover:not(:disabled, :read-only) {
  border-color: var(--ylf-c-brand, #2563eb);
}
.ylf-input:focus-visible {
  outline: 2px solid var(--ylf-c-brand, #2563eb);
  outline-offset: 2px;
}
.ylf-input[aria-invalid='true'] {
  border-color: var(--ylf-status-danger-text, #b42318);
}
.ylf-input[aria-invalid='true']:focus-visible {
  outline-color: var(--ylf-status-danger-text, #b42318);
}
.ylf-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ylf-input[data-size='sm'] {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: var(--ylf-radius-sm, 10px);
  font-size: 12px;
}
@media (pointer: coarse) {
  .ylf-input[data-size='sm'] {
    min-height: 44px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ylf-input {
    transition: none;
  }
}
</style>
