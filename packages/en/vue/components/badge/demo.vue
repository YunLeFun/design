<script setup lang="ts">
const tones = [
  { value: 'blue', label: 'Sky blue' },
  { value: 'sun', label: 'Featured' },
  { value: 'cyan', label: 'Tools' },
  { value: 'coral', label: 'Events' },
  { value: 'pink', label: 'Creation' },
  { value: 'green', label: 'Completed' },
] as const
const appearances = [
  { value: 'solid', label: 'Solid' },
  { value: 'soft', label: 'Soft' },
  { value: 'outline', label: 'Outline' },
] as const
const statuses = [
  { value: 'success', label: 'Published' },
  { value: 'warning', label: 'Testing' },
  { value: 'danger', label: 'Publish failed' },
  { value: 'info', label: 'Pending review' },
] as const
</script>

<template>
  <div class="ylf-badge-demo">
    <div class="ylf-badge-demo__group">
      <p>Brand and content</p>
      <div class="ylf-badge-demo__row">
        <YlfBadge>New</YlfBadge>
        <YlfBadge variant="featured">
          Featured
        </YlfBadge>
        <YlfBadge variant="neutral">
          Archived
        </YlfBadge>
      </div>
    </div>
    <div class="ylf-badge-demo__group">
      <p>Categories and emphasis</p>
      <div v-for="appearance in appearances" :key="appearance.value" class="ylf-badge-demo__row">
        <span class="ylf-badge-demo__label">{{ appearance.label }}</span>
        <YlfBadge v-for="tone in tones" :key="tone.value" variant="accent" :tone="tone.value" :appearance="appearance.value">
          {{ tone.label }}
        </YlfBadge>
      </div>
    </div>
    <div class="ylf-badge-demo__group">
      <p>States and feedback</p>
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
