<script setup lang="ts">
import { useData } from 'vitepress'
import { useNavigationIndicator } from 'vitepress-theme-yunlefun/navigation'
import { onMounted, shallowRef, useTemplateRef, watch } from 'vue'

const { theme } = useData()
const anchor = useTemplateRef<HTMLElement>('anchor')
const menu = shallowRef<HTMLElement | null>(null)
function bindMenu() {
  menu.value = anchor.value?.parentElement?.querySelector<HTMLElement>('.VPNavBarMenu') ?? null
}
onMounted(bindMenu)
watch(() => theme.value.nav, bindMenu, { flush: 'post' })

const indicator = useNavigationIndicator(menu, {
  links: element => Array.from(element.querySelectorAll<HTMLElement>(':scope > .VPNavBarMenuLink')),
  active: link => link.classList.contains('active'),
  attributes: ['class', 'aria-current'],
})
</script>

<template>
  <span ref="anchor" hidden aria-hidden="true" />
  <Teleport v-if="menu && indicator" :to="menu">
    <span class="ylf-docs-nav-indicator" aria-hidden="true" :style="{ transform: `translate(${indicator.x}px, ${indicator.y}px)` }" />
  </Teleport>
</template>
