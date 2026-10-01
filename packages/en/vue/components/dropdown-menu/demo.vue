<script setup lang="ts">
import { ref } from 'vue'

const last = ref('')
const items = [
  { label: 'Profile', value: 'profile' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Preferences', value: 'settings' },
  { separator: true },
  { label: 'Sign out', value: 'logout' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <YlfDropdownMenu :items="items" @select="last = $event">
      <template #trigger>
        <YlfButton variant="secondary">
          Menu ▾
        </YlfButton>
      </template>
    </YlfDropdownMenu>
    <p class="text-sm op-70">
      Last selected: {{ last || '(none)' }}
    </p>
  </div>
</template>
