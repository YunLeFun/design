<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const saved = ref(false)

function saveWork() {
  saved.value = true
  open.value = false
}
</script>

<template>
  <YlfDialog
    v-model:open="open"
    close-label="Close"
    title="Above the clouds"
    description="Give inspiration a place to land. Save this creation and pick up where you left off."
  >
    <template #trigger>
      <YlfButton variant="primary">
        <template #icon>
          <svg class="dialog-demo__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M7 18a5 5 0 0 1-.5-10 6 6 0 0 1 11.4 1.5A4.3 4.3 0 0 1 18 18H7Z" />
          </svg>
        </template>
        Open dialog
      </YlfButton>
    </template>

    <div class="dialog-demo__work">
      <div class="dialog-demo__thumbnail" aria-hidden="true">
        <svg viewBox="0 0 80 64" fill="none">
          <circle cx="53" cy="20" r="10" fill="var(--ylf-accent-sun)" />
          <path d="M16 47a11 11 0 0 1 3-22 15 15 0 0 1 28 6 9 9 0 0 1 1 18H16Z" fill="var(--ylf-c-surface)" stroke="var(--ylf-c-border)" />
        </svg>
      </div>
      <div class="dialog-demo__work-copy">
        <strong>A cloud of inspiration</strong>
        <span>Creative draft · Just edited</span>
      </div>
      <YlfBadge variant="featured">
        Original
      </YlfBadge>
    </div>

    <div class="dialog-demo__destination">
      <svg class="dialog-demo__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <path d="M7 18a5 5 0 0 1-.5-10 6 6 0 0 1 11.4 1.5A4.3 4.3 0 0 1 18 18H7Z" />
      </svg>
      <div><strong>My cloud space</strong><span>Syncs across your devices</span></div>
      <svg class="dialog-demo__icon dialog-demo__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
    </div>

    <div class="dialog-demo__actions">
      <YlfButton variant="secondary" @click="open = false">
        Maybe later
      </YlfButton>
      <YlfButton variant="primary" @click="saveWork">
        Save to cloud
      </YlfButton>
    </div>
  </YlfDialog>
  <p v-if="saved" class="dialog-demo__saved" role="status">
    Saved to the cloud. Keep creating with peace of mind.
  </p>
</template>

<style scoped>
.dialog-demo__icon {
  width: 20px;
  height: 20px;
  flex: none;
}
.dialog-demo__work {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--ylf-c-border);
  border-radius: var(--ylf-radius);
  background: var(--ylf-c-surface-raised);
  box-shadow: var(--ylf-shadow-control);
}
.dialog-demo__thumbnail {
  width: 64px;
  height: 64px;
  flex: none;
  border-radius: 12px;
  background: var(--ylf-c-sky);
  overflow: hidden;
}
.dialog-demo__thumbnail svg {
  width: 100%;
  height: 100%;
}
.dialog-demo__work-copy {
  display: grid;
  flex: 1;
  gap: 5px;
  min-width: 0;
}
.dialog-demo__work strong,
.dialog-demo__destination strong {
  font-size: 14px;
  font-weight: 600;
}
.dialog-demo__work-copy span,
.dialog-demo__destination span {
  font-size: 12px;
  color: var(--ylf-c-text-2);
  line-height: 1.6;
}
.dialog-demo__destination {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 4px;
  color: var(--ylf-c-brand);
}
.dialog-demo__destination > div {
  display: grid;
  flex: 1;
  gap: 4px;
}
.dialog-demo__destination strong {
  color: var(--ylf-c-text);
}
.dialog-demo__check {
  width: 18px;
}
.dialog-demo__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid var(--ylf-c-border);
}
.dialog-demo__saved {
  margin: 18px 0 0;
  color: var(--ylf-c-text-2);
  font-size: 14px;
}
@media (max-width: 400px) {
  .dialog-demo__work {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr);
    gap: 8px 12px;
  }
  .dialog-demo__thumbnail {
    width: 52px;
    height: 52px;
  }
  .dialog-demo__work :deep(.ylf-badge) {
    grid-column: 2;
    justify-self: start;
  }
  .dialog-demo__thumbnail {
    grid-row: 1 / 3;
  }
  .dialog-demo__actions :deep(.ylf-button) {
    padding-inline: 18px;
  }
}
</style>
