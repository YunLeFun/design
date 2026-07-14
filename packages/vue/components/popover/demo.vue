<template>
  <YlfPopover side="bottom" align="start">
    <template #trigger>
      <YlfButton variant="primary">
        打开浮层
      </YlfButton>
    </template>

    <div class="flex flex-col gap-2">
      <p class="m-0 text-sm font-600">
        云乐坊浮层
      </p>
      <p class="m-0 text-sm op-70">
        定位、点击外部关闭、焦点管理都来自 reka-ui，皮肤是云乐坊 token。
      </p>
    </div>
  </YlfPopover>
</template>
