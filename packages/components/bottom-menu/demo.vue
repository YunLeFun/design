<script lang="ts" setup>
import { ref } from 'vue'

import type { BottomMenuItem } from './index'

const items: BottomMenuItem[] = [
  {
    icon: 'i-ri-home-line',
    title: '首页',
    to: '/',
  },
  {
    icon: 'i-ri-compass-2-line',
    title: '发现',
    to: '/discover',
  },
  {
    icon: 'i-ri-user-line',
    title: '我的',
    to: '/user',
  },
]

const active = ref('/')
</script>

<template>
  <YlfBottomMenu>
    <YlfBottomMenuItem
      v-for="item in items"
      :key="item.to"
      :item="item" :active="active === item.to"
      @click="() => { active = item.to }"
    />
  </YlfBottomMenu>
</template>
