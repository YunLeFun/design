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
    <div ref="previewedElRef" class="m-2 size-50 cursor-pointer bg-green p-2" @click="onClick">
      PreviewElement
    </div>

    <canvas
      ref="previewedCanvasRef" class="m-2 size-50 cursor-pointer bg-green p-2"
      @click="onCanvasClick"
    >
      PreviewElement
    </canvas>
  </div>
</template>
