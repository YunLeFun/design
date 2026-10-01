<template>
  <div class="flex flex-wrap items-center gap-3">
    <YlfTooltip content="Hover above the clouds ☁️" side="top">
      <YlfButton variant="secondary">
        Top tooltip
      </YlfButton>
    </YlfTooltip>
    <YlfTooltip content="Behavior and positioning come from Reka UI" side="bottom">
      <YlfButton variant="secondary">
        Bottom tooltip
      </YlfButton>
    </YlfTooltip>
    <YlfTooltip content="Appearance uses YunLeFun tokens" side="right">
      <YlfButton variant="soft">
        Right tooltip
      </YlfButton>
    </YlfTooltip>
  </div>
</template>
