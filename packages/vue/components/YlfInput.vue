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
  height: var(--ylf-control-h, 44px);
  padding: 0 14px;
  border: 1px solid var(--ylf-c-border-strong, #cbd5e1);
  border-radius: var(--ylf-control-radius, var(--ylf-radius, 14px));
  background: var(--ylf-c-surface, #fff);
  color: var(--ylf-c-text, #0f172a);
  font-family: var(--ylf-font-body, inherit);
  font-size: var(--ylf-control-font-size, 0.9375rem);
  line-height: 1.5;
  box-shadow: var(--ylf-shadow-control);
  transition: border-color var(--ylf-duration-fast, 160ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}
.ylf-input::placeholder {
  color: var(--ylf-c-placeholder, var(--ylf-c-text-3, #5a697e));
}
.ylf-input:hover:not(:disabled, :read-only) {
  border-color: var(--ylf-c-brand, #2563eb);
}
.ylf-input:focus-visible {
  outline: var(--ylf-ring-width, 2px) solid var(--ylf-ring-color, var(--ylf-c-brand, #2563eb));
  outline-offset: 2px;
}
.ylf-input[aria-invalid='true'] {
  border-color: var(--ylf-status-danger-text, #9a3412);
}
.ylf-input[aria-invalid='true']:focus-visible {
  outline-color: var(--ylf-status-danger-text, #9a3412);
}
.ylf-input:disabled {
  opacity: var(--ylf-disabled-opacity, 0.48);
  cursor: not-allowed;
}
.ylf-input[data-size='sm'] {
  height: var(--ylf-control-h-sm, 34px);
  padding: 0 10px;
  border-radius: var(--ylf-control-radius-sm, var(--ylf-radius-sm, 10px));
  font-size: var(--ylf-control-font-size-sm, 0.8125rem);
}
@media (pointer: coarse) {
  .ylf-input {
    min-height: var(--ylf-touch-target, 44px);
    height: max(var(--ylf-control-h, 44px), var(--ylf-touch-target, 44px));
    font-size: max(1rem, var(--ylf-control-font-size, 0.9375rem));
  }
  .ylf-input[data-size='sm'] {
    min-height: var(--ylf-touch-target, 44px);
    height: max(var(--ylf-control-h-sm, 34px), var(--ylf-touch-target, 44px));
    font-size: max(1rem, var(--ylf-control-font-size-sm, 0.8125rem));
  }
}
@media (prefers-reduced-motion: reduce) {
  .ylf-input {
    transition: none;
  }
}
</style>
