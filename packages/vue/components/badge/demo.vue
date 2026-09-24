<script setup lang="ts">
const tones = [
  { value: 'blue', label: '晴空蓝' },
  { value: 'sun', label: '精选集' },
  { value: 'cyan', label: '工具' },
  { value: 'coral', label: '活动' },
  { value: 'pink', label: '创作' },
  { value: 'green', label: '已完成' },
] as const
const appearances = [
  { value: 'solid', label: '实色' },
  { value: 'soft', label: '柔色' },
  { value: 'outline', label: '描边' },
] as const
const statuses = [
  { value: 'success', label: '已发布' },
  { value: 'warning', label: '测试中' },
  { value: 'danger', label: '发布失败' },
  { value: 'info', label: '待审核' },
] as const
</script>

<template>
  <div class="ylf-badge-demo">
    <div class="ylf-badge-demo__group">
      <p>品牌与内容</p>
      <div class="ylf-badge-demo__row">
        <YlfBadge>新上线</YlfBadge>
        <YlfBadge variant="featured">
          精选
        </YlfBadge>
        <YlfBadge variant="neutral">
          已归档
        </YlfBadge>
      </div>
    </div>
    <div class="ylf-badge-demo__group">
      <p>分类与强调</p>
      <div v-for="appearance in appearances" :key="appearance.value" class="ylf-badge-demo__row">
        <span class="ylf-badge-demo__label">{{ appearance.label }}</span>
        <YlfBadge v-for="tone in tones" :key="tone.value" variant="accent" :tone="tone.value" :appearance="appearance.value">
          {{ tone.label }}
        </YlfBadge>
      </div>
    </div>
    <div class="ylf-badge-demo__group">
      <p>状态与反馈</p>
      <div v-for="appearance in appearances" :key="appearance.value" class="ylf-badge-demo__row">
        <span class="ylf-badge-demo__label">{{ appearance.label }}</span>
        <YlfBadge v-for="status in statuses" :key="status.value" :variant="status.value" :appearance="appearance.value">
          {{ status.label }}
        </YlfBadge>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ylf-badge-demo {
  display: grid;
  gap: var(--ylf-space-6);
}

.ylf-badge-demo__group > p {
  margin: 0 0 var(--ylf-space-3);
  color: var(--ylf-c-text-2);
  font-size: 12px;
  line-height: 1.5;
}

.ylf-badge-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ylf-space-3);
  margin-top: var(--ylf-space-3);
}

.ylf-badge-demo__label {
  width: 100%;
  color: var(--ylf-c-text-2);
  font-size: 12px;
}
</style>
