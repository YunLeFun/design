<template>
  <YlfPopover side="bottom" align="start" aria-label="About YunLeFun">
    <template #trigger>
      <YlfButton variant="primary">
        Open popover
      </YlfButton>
    </template>

    <div class="flex flex-col gap-2">
      <p class="m-0 text-sm font-600">
        YunLeFun popover
      </p>
      <p class="m-0 text-sm op-70">
        Reka UI provides positioning, outside dismissal and focus. YunLeFun tokens define the appearance.
      </p>
    </div>
  </YlfPopover>
</template>
