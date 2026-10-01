<template>
  <div class="ylf-card-demo grid gap-4 sm:grid-cols-2">
    <YlfCard variant="soft" :hoverable="false">
      <div class="ic ic-sun">
        <div i-ri-sparkling-2-line />
      </div>
      <h3>Soft card</h3>
      <p>The default surface with a soft shadow for primary content.</p>
    </YlfCard>

    <YlfCard variant="glass" :hoverable="false">
      <div class="ic ic-brand">
        <div i-ri-cloud-line />
      </div>
      <h3>Cloud glass card</h3>
      <p>A translucent, blurred surface for overlays, navigation and cloud scenes.</p>
    </YlfCard>

    <YlfCard variant="accent" tone="coral" :hoverable="false">
      <div class="ic ic-coral">
        <div i-ri-add-circle-line />
      </div>
      <h3>Accent card</h3>
      <p>A coral edge highlights content while the reading surface stays calm.</p>
    </YlfCard>

    <YlfCard variant="tinted" tone="pink" :hoverable="false">
      <YlfBadge variant="accent" tone="pink" appearance="soft">
        Creation
      </YlfBadge>
      <h3 class="mt-3!">
        A little color for inspiration
      </h3>
      <p>Soft surfaces and solid accents share tokens to establish clear hierarchy.</p>
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
