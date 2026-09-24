<template>
  <div class="ylf-card-demo grid gap-4 sm:grid-cols-2">
    <YlfCard variant="soft" :hoverable="false">
      <div class="ic ic-sun">
        <div i-ri-sparkling-2-line />
      </div>
      <h3>柔影卡片</h3>
      <p>默认表面，色彩浸染的柔和投影，承载主要内容。</p>
    </YlfCard>

    <YlfCard variant="glass" :hoverable="false">
      <div class="ic ic-brand">
        <div i-ri-cloud-line />
      </div>
      <h3>云玻璃卡片</h3>
      <p>背景模糊通透，适合浮层、导航与覆盖在彩云之上的内容。</p>
    </YlfCard>

    <YlfCard variant="accent" tone="coral" :hoverable="false">
      <div class="ic ic-coral">
        <div i-ri-add-circle-line />
      </div>
      <h3>纯色强调卡片</h3>
      <p>珊瑚橙标记精选内容，正文表面保持清晰安静。</p>
    </YlfCard>

    <YlfCard variant="tinted" tone="pink" :hoverable="false">
      <YlfBadge variant="accent" tone="pink" appearance="soft">
        创作
      </YlfBadge>
      <h3 class="mt-3!">
        给灵感一点颜色
      </h3>
      <p>柔色铺开在表面，实色留给重点。用同一组 token 组织内容层级。</p>
    </YlfCard>
  </div>
</template>

<style scoped>
.ylf-card-demo h3 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
}

.ylf-card-demo p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ylf-c-text-2);
}

.ylf-card-demo .ic {
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 22px;
}

.ylf-card-demo .ic-sun {
  background: var(--ylf-accent-sun);
  color: var(--ylf-accent-sun-on);
}

.ylf-card-demo .ic-brand {
  background: var(--ylf-c-brand);
  color: var(--ylf-c-text-on-accent);
}

.ylf-card-demo .ic-coral {
  background: var(--ylf-accent-coral);
  color: var(--ylf-accent-coral-on);
}
</style>
