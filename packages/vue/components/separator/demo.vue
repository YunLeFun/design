<template>
  <div class="ylf-separator-demo">
    <div>
      <h3>给生活一点颜色</h3>
      <p>六段纯色，连接云乐坊的每一份好奇。</p>
      <YlfSeparator variant="spectrum" class="my-4" />
      <div class="flex flex-wrap gap-2">
        <YlfBadge variant="accent" tone="cyan" appearance="soft">
          探索工具
        </YlfBadge>
        <YlfBadge variant="accent" tone="pink" appearance="soft">
          记录灵感
        </YlfBadge>
        <YlfBadge variant="accent" tone="coral" appearance="soft">
          参加活动
        </YlfBadge>
      </div>
    </div>
    <div class="text-sm">
      <p>正文分节保持安静</p>
      <YlfSeparator class="my-3" />
      <p>中性细线负责结构，彩色线用于品牌或分类。</p>
    </div>
    <div class="flex items-center gap-3 text-sm">
      <span>探索</span>
      <YlfSeparator orientation="vertical" variant="accent" tone="cyan" class="h-4!" />
      <span>创作</span>
      <YlfSeparator orientation="vertical" variant="accent" tone="pink" class="h-4!" />
      <span>分享</span>
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
