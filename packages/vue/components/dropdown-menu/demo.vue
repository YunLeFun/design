<script setup lang="ts">
import { ref } from 'vue'

const last = ref('')
const items = [
  { label: '个人资料', value: 'profile' },
  { label: '云币钱包', value: 'wallet' },
  { label: '偏好设置', value: 'settings' },
  { separator: true },
  { label: '退出登录', value: 'logout' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <YlfDropdownMenu :items="items" @select="last = $event">
      <template #trigger>
        <YlfButton variant="secondary">
          菜单 ▾
        </YlfButton>
      </template>
    </YlfDropdownMenu>
    <p class="text-sm op-70">
      最近选择：{{ last || '（无）' }}
    </p>
  </div>
</template>
