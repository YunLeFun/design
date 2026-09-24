<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
function fakeLoad() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1600)
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="primary">
        晴空蓝 Primary
      </YlfButton>
      <YlfButton variant="accent">
        默认强调
      </YlfButton>
      <YlfButton variant="accent" tone="sun">
        发现精选
      </YlfButton>
      <YlfButton variant="secondary">
        Secondary
      </YlfButton>
      <YlfButton variant="soft">
        Soft
      </YlfButton>
      <YlfButton variant="ghost">
        Ghost
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="accent" tone="cyan">
        打开工具
      </YlfButton>
      <YlfButton variant="accent" tone="coral">
        参与活动
      </YlfButton>
      <YlfButton variant="accent" tone="pink">
        开始创作
      </YlfButton>
      <YlfButton variant="accent" tone="green">
        完成设置
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="accent" tone="pink" appearance="soft">
        收藏灵感
      </YlfButton>
      <YlfButton variant="accent" tone="cyan" appearance="outline">
        看看工具
      </YlfButton>
      <YlfButton variant="success" appearance="soft">
        保存成功
      </YlfButton>
      <YlfButton variant="danger" appearance="outline">
        移除内容
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton variant="success">
        成功
      </YlfButton>
      <YlfButton variant="warning">
        提醒
      </YlfButton>
      <YlfButton variant="danger">
        危险
      </YlfButton>
      <YlfButton variant="secondary" disabled>
        禁用
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton size="sm">
        Small
      </YlfButton>
      <YlfButton size="md">
        Medium
      </YlfButton>
      <YlfButton size="lg">
        Large
      </YlfButton>
      <YlfButton :round="false">
        标准圆角
      </YlfButton>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <YlfButton :loading="loading" @click="fakeLoad">
        <template #icon>
          <div i-ri-magic-line />
        </template>
        {{ loading ? '召唤中…' : '点我加载' }}
      </YlfButton>
    </div>
  </div>
</template>
