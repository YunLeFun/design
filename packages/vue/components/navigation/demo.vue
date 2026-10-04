<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import YlfDropdownMenu from '../YlfDropdownMenu.vue'
import YlfNavigation from '../YlfNavigation.vue'
import YlfNavigationLink from '../YlfNavigationLink.vue'
import YlfNavigationTrigger from '../YlfNavigationTrigger.vue'

const current = shallowRef('blog')
const site = shallowRef('website')
const items = [
  { id: 'help', label: '帮助' },
  { id: 'membership', label: '会员' },
  { id: 'blog', label: '博客' },
  { id: 'updates', label: '日志' },
]
const sites = [
  { value: 'website', label: '官网' },
  { value: 'apps', label: '应用' },
  { value: 'studio', label: '工作室' },
]
const siteLabel = computed(() => sites.find(item => item.value === site.value)?.label)
const currentLabel = computed(() => items.find(item => item.id === current.value)?.label)
</script>

<template>
  <div class="ylf-navigation-demo">
    <div class="ylf-navigation-demo__header">
      <div class="ylf-navigation-demo__brand">
        <strong>云乐坊</strong>
        <YlfDropdownMenu :items="sites" @select="site = $event">
          <template #trigger>
            <YlfNavigationTrigger>{{ siteLabel }}</YlfNavigationTrigger>
          </template>
        </YlfDropdownMenu>
      </div>
      <YlfNavigation label="主导航预览">
        <YlfNavigationLink
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          :active="current === item.id"
          @click.prevent="current = item.id"
        >
          {{ item.label }}
        </YlfNavigationLink>
      </YlfNavigation>
    </div>

    <p class="ylf-navigation-demo__status" aria-live="polite">
      当前选择：{{ siteLabel }} / {{ currentLabel }}
    </p>
    <div class="ylf-navigation-demo__vertical">
      <YlfNavigation label="抽屉导航预览" orientation="vertical">
        <YlfNavigationLink
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          :active="current === item.id"
          @click.prevent="current = item.id"
        >
          {{ item.label }}
        </YlfNavigationLink>
      </YlfNavigation>
    </div>
    <YlfNavigationTrigger disabled>
      更多站点
    </YlfNavigationTrigger>
  </div>
</template>

<style scoped>
.ylf-navigation-demo {
  display: grid;
  justify-items: start;
  gap: var(--ylf-space-4);
  width: 100%;
}
.ylf-navigation-demo__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--ylf-space-4);
  width: 100%;
  padding-block: var(--ylf-space-2);
  border-bottom: 1px solid var(--ylf-c-border);
}
.ylf-navigation-demo__brand {
  display: flex;
  align-items: center;
  gap: var(--ylf-space-3);
}
.ylf-navigation-demo__status {
  margin: 0;
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-sm);
}
.ylf-navigation-demo__vertical {
  box-sizing: border-box;
  width: min(100%, 280px);
  padding: var(--ylf-space-2);
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius);
}
</style>
