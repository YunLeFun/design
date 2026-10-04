<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import YlfDropdownMenu from '../../../../vue/components/YlfDropdownMenu.vue'
import YlfNavigation from '../../../../vue/components/YlfNavigation.vue'
import YlfNavigationLink from '../../../../vue/components/YlfNavigationLink.vue'
import YlfNavigationTrigger from '../../../../vue/components/YlfNavigationTrigger.vue'

const current = shallowRef('blog')
const site = shallowRef('website')
const items = [
  { id: 'help', label: 'Help' },
  { id: 'membership', label: 'Member' },
  { id: 'blog', label: 'Blog' },
  { id: 'updates', label: 'Updates' },
]
const sites = [
  { value: 'website', label: 'Website' },
  { value: 'apps', label: 'Apps' },
  { value: 'studio', label: 'Studio' },
]
const siteLabel = computed(() => sites.find(item => item.value === site.value)?.label)
const currentLabel = computed(() => items.find(item => item.id === current.value)?.label)
</script>

<template>
  <div class="ylf-navigation-demo">
    <div class="ylf-navigation-demo__header">
      <div class="ylf-navigation-demo__brand">
        <strong>YunLeFun</strong>
        <YlfDropdownMenu :items="sites" @select="site = $event">
          <template #trigger>
            <YlfNavigationTrigger>{{ siteLabel }}</YlfNavigationTrigger>
          </template>
        </YlfDropdownMenu>
      </div>
      <YlfNavigation label="Main navigation preview">
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
      Current selection: {{ siteLabel }} / {{ currentLabel }}
    </p>
    <div class="ylf-navigation-demo__vertical">
      <YlfNavigation label="Drawer navigation preview" orientation="vertical">
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
      More sites
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
