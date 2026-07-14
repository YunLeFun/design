<script lang="ts" setup>
import { AvatarFallback, AvatarImage, AvatarRoot } from 'reka-ui'

withDefaults(defineProps<{
  src?: string
  alt?: string
  /** 图片加载失败/缺省时显示的文字（如姓名首字） */
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
  fallback: '',
})
</script>

<template>
  <AvatarRoot class="ylf-avatar" :class="`ylf-avatar--${size}`">
    <AvatarImage v-if="src" :src="src" :alt="alt" class="ylf-avatar__img" />
    <AvatarFallback class="ylf-avatar__fallback" :delay-ms="200">
      {{ fallback }}
    </AvatarFallback>
  </AvatarRoot>
</template>

<style lang="scss">
.ylf-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  border-radius: 50%;
  user-select: none;
  background: var(--ylf-c-brand-soft, #ece9ff);

  &--sm {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }

  &--md {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  &--lg {
    width: 64px;
    height: 64px;
    font-size: 22px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-weight: 600;
    color: var(--ylf-c-brand, #6d5cff);
  }
}
</style>
