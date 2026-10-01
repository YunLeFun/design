<script lang="ts" setup>
import type { BottomMenuItem } from '../../../../vue/components/bottom-menu'
import { ref } from 'vue'

const items: BottomMenuItem[] = [
  {
    icon: 'i-ri-home-line',
    activeIcon: 'i-ri-home-fill',
    title: 'Home',
    to: '/',
  },
  {
    icon: 'i-ri-compass-2-line',
    activeIcon: 'i-ri-compass-2-fill',
    title: 'Discover',
    to: '/discover',
  },
  {
    icon: 'i-ri-copper-coin-line',
    activeIcon: 'i-ri-copper-coin-fill',
    title: 'Coins',
    to: '/coin',
  },
  {
    icon: 'i-ri-user-line',
    activeIcon: 'i-ri-user-fill',
    title: 'Profile',
    to: '/user',
  },
]

// when using vue-router
// import { useRoute, useRouter } from 'vue-router'
// const route = useRoute()
// const router = useRouter()
// const active = computed(() => route.path)

const active = ref('/')
function onClick(item: BottomMenuItem) {
  // router.push(item.to || '/')
  active.value = item.to || ''
}
</script>

<template>
  <div class="mx-auto max-w-xs overflow-hidden border border-$ylf-c-border rounded-ylf-xl">
    <div class="h-28 op-90 bg-brand-gradient" />
    <YlfBottomMenu shadow>
      <YlfBottomMenuItem
        v-for="item in items"
        :key="item.to"
        :item="item"
        :active="active === item.to"
        @click="onClick"
      />
    </YlfBottomMenu>
  </div>
</template>
