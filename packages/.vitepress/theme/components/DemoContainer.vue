<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

import { useToggle } from '@vueuse/core'

defineProps<{
  name: string
  source: string
}>()

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
})

const [showSourceCode, toggleSourceCode] = useToggle(false)
</script>

<template>
  <div class="demo wide">
    <div
      class="demo-actions" flex justify="between" bg="$vp-c-bg"
      h="8"
      border="1px solid $ylf-c-border"
    >
      <span px="2" inline-flex justify="center" items="center" op="60">
        {{ `packages/vue/components/${name}/demo.vue` }}
      </span>
    </div>

    <div p="4">
      <slot />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div
      class="demo-actions" flex justify="end" mb="-4" bg="$vp-c-bg"
      border="1px solid $ylf-c-border"
    >
      <div>
        <a
          inline-flex
          p="2"
          class="demo-source-link text-base" color="!$ylf-c-text" :href="source" target="_blank"
        >
          <div i-ri-github-line />
        </a>

        <button
          p="2"
          text-base
          color="$ylf-c-text"
          inline-flex justify="center" items="center" @click="toggleSourceCode()"
        >
          <div i-ri-code-line />
        </button>
      </div>
    </div>

    <div v-show="showSourceCode">
      <slot name="source" />
    </div>
  </div>
</template>

<style lang="scss">
.demo {
  font-size: var(--vt-doc-code-font-size);
  background: var(--ylf-c-bg-light);
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.5s;
}

.demo-source-link {
  font-weight: 500;
  transition: color 0.5s;
}

.vp-doc div[class*='language-'] {
  border-radius: 0;
}
</style>
