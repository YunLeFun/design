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
        Sky blue Primary
      </YlfButton>
      <YlfButton variant="accent">
        Default accent
      </YlfButton>
      <YlfButton variant="accent" tone="sun">
        Discover featured
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
      <YlfButton variant="accent" tone="cyan">
        Open tools
      </YlfButton>
      <YlfButton variant="accent" tone="coral">
        Join an event
      </YlfButton>
      <YlfButton variant="accent" tone="pink">
        Start creating
      </YlfButton>
      <YlfButton variant="accent" tone="green">
        Finish setup
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="accent" tone="pink" appearance="soft">
        Save inspiration
      </YlfButton>
      <YlfButton variant="accent" tone="cyan" appearance="outline">
        Explore tools
      </YlfButton>
      <YlfButton variant="success" appearance="soft">
        Saved
      </YlfButton>
      <YlfButton variant="danger" appearance="outline">
        Remove content
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="success">
        Success
      </YlfButton>
      <YlfButton variant="warning">
        Warning
      </YlfButton>
      <YlfButton variant="danger">
        Danger
      </YlfButton>
      <YlfButton variant="secondary" disabled>
        Disabled
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
        Standard radius
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton :loading="loading" @click="fakeLoad">
        <template #icon>
          <div i-ri-magic-line />
        </template>
        {{ loading ? 'Loading…' : 'Try loading' }}
      </YlfButton>
    </div>
  </div>
</template>
