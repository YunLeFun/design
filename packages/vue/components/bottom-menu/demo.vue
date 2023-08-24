<script lang="ts" setup>
import type { BottomMenuItem } from '@yunlefun/vue'
import { ref } from 'vue'

const items: BottomMenuItem[] = [
  {
    icon: 'i-ri-home-line',
    activeIcon: 'i-ri-home-fill',
    title: '首页',
    to: '/',
  },
  {
    icon: 'i-ri-compass-2-line',
    activeIcon: 'i-ri-compass-2-fill',
    title: '发现',
    to: '/discover',
  },
  {
    icon: 'i-ri-user-line',
    activeIcon: 'i-ri-user-fill',
    title: '我的',
    to: '/user',
  },
]

// when using vue-router
// import { useRouter } from 'vue-router'
// const router = useRouter()
// const active = computed(() => router.currentRoute.value.path)
const active = ref('/')
function onClick(item: BottomMenuItem) {
  // router.push(item.to)
  active.value = item.to || ''
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
