<script setup lang="ts">
import { Layout } from 'vitepress-theme-yunlefun'
import YlfLogo from '../../vue/components/YlfLogo.vue'
</script>

<template>
  <Layout>
    <template #nav-bar-title-before>
      <YlfLogo size="sm" :wordmark="false" class="ylf-docs-mark" />
    </template>
  </Layout>
</template>
