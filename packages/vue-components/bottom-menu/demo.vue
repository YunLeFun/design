<script lang="ts" setup>
import type { BottomMenuItem } from '@yunlefun/vue-components'
import { ref } from 'vue'

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
function onClick(item: BottomMenuItem) {
  active.value = item.to
}
</script>

<template>
  <YlfBottomMenu shadow>
    <YlfBottomMenuItem
      v-for="item in items"
      :key="item.to"
      :item="item"
      :active="active === item.to"
      @click="onClick"
    />
  </YlfBottomMenu>
</template>
