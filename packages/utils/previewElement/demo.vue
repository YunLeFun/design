<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { previewElement } from './index'

const previewedElRef = useTemplateRef<HTMLElement>('previewedElRef')
const previewedCanvasRef = useTemplateRef<HTMLCanvasElement>('previewedCanvasRef')

function onClick() {
  if (previewedElRef.value)
    previewElement(previewedElRef.value)
}

function onCanvasClick() {
  /**
   * canvas 使用 cloneNode 会丢失上下文（绘制的内容）
   */
  if (previewedCanvasRef.value) {
    previewElement(previewedCanvasRef.value, {
      clone: false,
      scale: 3,
    })
  }
}

onMounted(() => {
  const canvas = previewedCanvasRef.value
  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  canvas.width = 50
  canvas.height = 50
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 50, 50)

  ctx.fillStyle = 'blue'
  ctx.fillRect(20, 20, 10, 10)
})
</script>

<template>
  <div>
    <button
      ref="previewedElRef"
      type="button"
      class="m-2 size-50 cursor-pointer border-none bg-green p-2 text-left"
      @click="onClick"
    >
      PreviewElement
    </button>

    <button
      type="button"
      class="m-2 inline-flex cursor-pointer border-none bg-transparent p-0"
      aria-label="Preview canvas element"
      @click="onCanvasClick"
    >
      <canvas ref="previewedCanvasRef" class="size-50 bg-green p-2">
        PreviewElement
      </canvas>
    </button>
  </div>
</template>
