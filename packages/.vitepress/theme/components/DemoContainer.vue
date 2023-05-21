<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

defineProps<{
  name: string
  source: string
}>()

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <div class="demo wide">
    <p
      class="demo-actions" flex justify="between" my="!0" bg="$vp-c-bg"
      border="1px solid $ylf-c-border"
    >
      <span px="2" inline-flex justify="center" items="center" op="60">
        {{ `packages/components/${name}/demo.vue` }}
      </span>
      <a
        inline-flex
        p="2"
        class="demo-source-link text-base" :href="source" target="_blank"
      >
        <div i-ri-github-line />
      </a>
    </p>

    <div p="4">
      <slot />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style lang="scss">
.demo {
  font-size: var(--vt-doc-code-font-size);
  background: var(--vp-code-block-bg);
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.5s;
}

.demo-source-link {
  font-weight: 500;
  transition: color 0.5s;
}
</style>
