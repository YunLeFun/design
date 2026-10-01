<script setup lang="ts">
import { ref } from 'vue'

const single = ref([40])
const range = ref([20, 70])
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <YlfSlider v-model="single" label="Volume" />
      <p class="m-0 text-sm op-70">
        Value: {{ single[0] }}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <YlfSlider v-model="range" label="Price range" :thumb-labels="['Minimum price', 'Maximum price']" />
      <p class="m-0 text-sm op-70">
        Range: {{ range[0] }} – {{ range[1] }}
      </p>
    </div>
  </div>
</template>
