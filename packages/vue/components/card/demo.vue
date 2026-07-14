<template>
  <div class="ylf-card-demo grid gap-4 sm:grid-cols-3">
    <YlfCard variant="soft">
      <div class="ic ic-aurora">
        <div i-ri-sparkling-2-line />
      </div>
      <h3>柔影卡片</h3>
      <p>默认表面，色彩浸染的柔和投影，承载主要内容。</p>
    </YlfCard>

    <YlfCard variant="glass">
      <div class="ic ic-brand">
        <div i-ri-cloud-line />
      </div>
      <h3>云玻璃卡片</h3>
      <p>背景模糊通透，适合浮层、导航与覆盖在彩云之上的内容。</p>
    </YlfCard>

    <YlfCard variant="gradient">
      <div class="ic ic-iris">
        <div i-ri-add-circle-line />
      </div>
      <h3>流光描边卡片</h3>
      <p>极光做边，强调重点内容或精选项，仅在需要时使用。</p>
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

.ic-aurora {
  background: var(--ylf-gradient-aurora);
}

.ic-brand {
  background: var(--ylf-c-brand);
}

.ic-iris {
  background: var(--ylf-aurora-iris);
}
</style>
