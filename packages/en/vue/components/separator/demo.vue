<template>
  <div class="ylf-separator-demo">
    <div>
      <h3>A little color for life</h3>
      <p>Six solid colors connect every curious idea.</p>
      <YlfSeparator variant="spectrum" class="my-4" />
      <div class="flex flex-wrap gap-2">
        <YlfBadge variant="accent" tone="cyan" appearance="soft">
          Explore tools
        </YlfBadge>
        <YlfBadge variant="accent" tone="pink" appearance="soft">
          Capture ideas
        </YlfBadge>
        <YlfBadge variant="accent" tone="coral" appearance="soft">
          Join events
        </YlfBadge>
      </div>
    </div>
    <div class="text-sm">
      <p>Quiet structure for reading</p>
      <YlfSeparator class="my-3" />
      <p>Neutral lines organize content; color marks brands and categories.</p>
    </div>
    <div class="flex items-center gap-3 text-sm">
      <span>Explore</span>
      <YlfSeparator orientation="vertical" variant="accent" tone="cyan" class="h-4!" />
      <span>Creation</span>
      <YlfSeparator orientation="vertical" variant="accent" tone="pink" class="h-4!" />
      <span>Share</span>
    </div>
  </div>
</template>

<style scoped>
.ylf-separator-demo {
  display: grid;
  gap: var(--ylf-space-8);
  width: 100%;
  max-width: 560px;
}
.ylf-separator-demo h3 {
  margin: 0 0 var(--ylf-space-2);
  font-size: var(--ylf-text-lg);
  font-weight: 600;
}
.ylf-separator-demo p {
  margin: 0;
  color: var(--ylf-c-text-2);
  font-size: var(--ylf-text-sm);
  line-height: var(--ylf-leading-body);
}
</style>
