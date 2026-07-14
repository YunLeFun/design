<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
function fakeLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1600)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="primary">
        多巴胺 Primary
      </YlfButton>
      <YlfButton variant="aurora">
        极光 Aurora
      </YlfButton>
      <YlfButton variant="secondary">
        Secondary
      </YlfButton>
      <YlfButton variant="soft">
        Soft
      </YlfButton>
      <YlfButton variant="ghost">
        Ghost
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="success">
        成功
      </YlfButton>
      <YlfButton variant="warning">
        提醒
      </YlfButton>
      <YlfButton variant="danger">
        危险
      </YlfButton>
      <YlfButton variant="secondary" disabled>
        禁用
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton size="sm">
        Small
      </YlfButton>
      <YlfButton size="md">
        Medium
      </YlfButton>
      <YlfButton size="lg">
        Large
      </YlfButton>
      <YlfButton :round="false">
        直角
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton :loading="loading" @click="fakeLoad">
        <template #icon>
          <div i-ri-magic-line />
        </template>
        {{ loading ? '召唤中…' : '点我加载' }}
      </YlfButton>
    </div>
  </div>
</template>
