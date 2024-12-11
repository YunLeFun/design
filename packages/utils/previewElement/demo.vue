<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { previewElement } from './index'

const previewedElRef = ref<HTMLElement>()
const previewedCanvasRef = ref<HTMLCanvasElement>()

function onClick() {
  previewElement(previewedElRef.value)
}

function onCanvasClick() {
  /**
   * canvas 使用 cloneNode 会丢失上下文（绘制的内容）
   */
  previewElement(previewedCanvasRef.value, {
    clone: false,
    scale: 3,
  })
}

onMounted(() => {
  const canvas = previewedCanvasRef.value
  const ctx = canvas.getContext('2d')
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
