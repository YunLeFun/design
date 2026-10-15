<script setup lang="ts">
import type { YlfCloudShape } from '../cloud'
import { computed, ref, useId } from 'vue'

const shape = ref<YlfCloudShape>('billow')
const haze = ref([0])
const volumetric = ref(true)
const face = ref(false)
const volumetricId = useId()
const faceId = useId()

const shapes: { value: YlfCloudShape, label: string }[] = [
  { value: 'billow', label: '积云' },
  { value: 'heap', label: '堆云' },
  { value: 'bank', label: '云堤' },
  { value: 'puff', label: '团云' },
  { value: 'wisp', label: '薄云' },
]
const hazeValue = computed(() => haze.value[0] / 100)
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="cloud-demo__sky">
      <!-- 远处的云混入天空色，近处保持清晰：同一组件靠 --ylf-cloud-haze 拉开层次。 -->
      <YlfCloud shape="wisp" class="cloud-demo__far" style="--ylf-cloud-haze: 0.7" />
      <YlfCloud shape="bank" class="cloud-demo__mid" style="--ylf-cloud-haze: 0.4" />
      <YlfCloud
        :shape="shape"
        :volumetric="volumetric"
        :face="face"
        class="cloud-demo__near"
        :style="{ '--ylf-cloud-haze': hazeValue, '--ylf-cloud-face-opacity': face ? 0.85 : 0 }"
      />
    </div>
    <YlfSegmentedControl v-model="shape" :options="shapes" label="云朵形状" />
    <div class="flex flex-col gap-2">
      <YlfSlider v-model="haze" label="空气透视" />
      <p class="m-0 text-sm op-70">
        --ylf-cloud-haze：{{ hazeValue.toFixed(2) }}
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <label class="flex items-center gap-2 text-sm" :for="volumetricId">
        <YlfSwitch :id="volumetricId" v-model="volumetric" size="sm" />
        体积光
      </label>
      <label class="flex items-center gap-2 text-sm" :for="faceId">
        <YlfSwitch :id="faceId" v-model="face" size="sm" />
        小脸
      </label>
    </div>
  </div>
</template>

<style scoped>
.cloud-demo__sky {
  position: relative;
  height: 220px;
  overflow: hidden;
  border-radius: var(--ylf-radius-lg);
  background: linear-gradient(180deg, var(--ylf-c-sky), var(--ylf-cloud-haze-color));
}

.cloud-demo__sky > * {
  position: absolute;
}

.cloud-demo__far {
  top: 8%;
  right: -6%;
  width: 46%;
}

.cloud-demo__mid {
  bottom: -8%;
  left: -8%;
  width: 62%;
}

.cloud-demo__near {
  bottom: 0;
  left: 50%;
  width: min(380px, 70%);
  translate: -50% 0;
  transition: translate var(--ylf-duration-slow) var(--ylf-ease-spring);
}

.cloud-demo__near:hover {
  translate: -50% -6px;
}
</style>
