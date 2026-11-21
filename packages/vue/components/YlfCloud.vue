<script lang="ts" setup>
import type { YlfCloudShape } from './cloud'
import { computed, useId } from 'vue'
import { ylfCloudSilhouettes } from './cloud'

const props = withDefaults(defineProps<{
  shape?: YlfCloudShape
  /** 用模糊滤镜塑造亮面体积；只给少数视觉焦点开启，其余用渐变近似以降低绘制开销。 */
  volumetric?: boolean
  /** 渲染一张平时隐藏的小脸，由 --ylf-cloud-face-opacity 唤醒。 */
  face?: boolean
}>(), {
  shape: 'billow',
  volumetric: false,
  face: false,
})

const id = `ylf-cloud-${useId()}`

const d = computed(() => ylfCloudSilhouettes[props.shape] ?? ylfCloudSilhouettes.billow)
</script>

<template>
  <svg
    class="ylf-cloud"
    :data-shape="shape"
    viewBox="0 0 490 250"
    fill="none"
    focusable="false"
    aria-hidden="true"
  >
    <defs>
      <!-- 光从左上方来：亮面 → 云体 → 背光面。 -->
      <linearGradient :id="`${id}-body`" x1="210" y1="35" x2="246" y2="222" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--_ylf-cloud-highlight)" />
        <stop offset="0.46" stop-color="var(--_ylf-cloud-body)" />
        <stop offset="1" stop-color="var(--_ylf-cloud-shade)" />
      </linearGradient>
      <radialGradient :id="`${id}-light`" cx="0.3" cy="0.2" r="0.8">
        <stop stop-color="var(--_ylf-cloud-highlight)" stop-opacity="0.9" />
        <stop offset="1" stop-color="var(--_ylf-cloud-highlight)" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="`${id}-shade`" cx="0.5" cy="0.9" r="0.65">
        <stop stop-color="var(--_ylf-cloud-shadow)" stop-opacity="0.34" />
        <stop offset="1" stop-color="var(--_ylf-cloud-shadow)" stop-opacity="0" />
      </radialGradient>
      <!-- 顶部逆光描边：亮面沿轮廓收成一道细光，向下逐渐消失。 -->
      <linearGradient :id="`${id}-rim`" x1="0" y1="30" x2="0" y2="170" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--ylf-cloud-rim, #ffffff)" stop-opacity="0.95" />
        <stop offset="0.55" stop-color="var(--ylf-cloud-rim, #ffffff)" stop-opacity="0.25" />
        <stop offset="1" stop-color="var(--ylf-cloud-rim, #ffffff)" stop-opacity="0" />
      </linearGradient>
      <clipPath :id="`${id}-clip`">
        <path :d="d" />
      </clipPath>
      <filter
        v-if="volumetric"
        :id="`${id}-soften`"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        color-interpolation-filters="sRGB"
      >
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>

    <g :clip-path="`url(#${id}-clip)`">
      <path :d="d" :fill="`url(#${id}-body)`" />
      <ellipse class="ylf-cloud__underside" cx="240" cy="181" rx="218" ry="61" :fill="`url(#${id}-shade)`" />
      <g v-if="volumetric" class="ylf-cloud__volume" :filter="`url(#${id}-soften)`">
        <path d="M 63 172 C 84 149 108 164 121 141 C 133 122 119 107 124 83 C 131 40 177 25 204 53 C 229 79 201 113 223 130 C 247 149 277 139 291 162 C 307 188 268 208 218 209 L 80 203 Z" :fill="`url(#${id}-light)`" />
        <path d="M 230 174 C 255 163 261 152 257 131 C 252 101 273 83 296 93 C 311 100 312 119 325 128 C 341 138 367 133 374 154 C 383 181 350 199 313 201 L 228 207 Z" :fill="`url(#${id}-light)`" opacity="0.56" />
      </g>
      <g v-else class="ylf-cloud__volume">
        <ellipse cx="190" cy="96" rx="190" ry="86" :fill="`url(#${id}-light)`" />
        <ellipse cx="350" cy="128" rx="110" ry="58" :fill="`url(#${id}-light)`" opacity="0.5" />
      </g>
      <path :d="d" class="ylf-cloud__rim" :stroke="`url(#${id}-rim)`" stroke-width="7" />
    </g>

    <!-- 若隐若现的小脸：宿主在悬停、聚焦或被戳时调高 --ylf-cloud-face-opacity。 -->
    <g v-if="face" class="ylf-cloud__face">
      <ellipse class="ylf-cloud__eye" cx="214" cy="150" rx="6" ry="8" />
      <ellipse class="ylf-cloud__eye" cx="268" cy="150" rx="6" ry="8" />
      <path d="M 230 166 Q 241 176 252 166" stroke-width="5" stroke-linecap="round" />
      <ellipse cx="196" cy="168" rx="11" ry="6" class="ylf-cloud__blush" />
      <ellipse cx="286" cy="168" rx="11" ry="6" class="ylf-cloud__blush" />
    </g>
  </svg>
</template>

<style>
/* 配色来自 @yunlefun/ui 的 --ylf-cloud-* token，随主题切换；
 * --ylf-cloud-haze（0–1）把远处的云混向天空色，形成空气透视。 */
.ylf-cloud {
  --_ylf-cloud-haze-color: var(--ylf-cloud-haze-color, #9cc6ef);
  --_ylf-cloud-highlight: color-mix(
    in srgb,
    var(--ylf-cloud-highlight, #fffefa),
    var(--_ylf-cloud-haze-color) calc(var(--ylf-cloud-haze, 0) * 70%)
  );
  --_ylf-cloud-body: color-mix(
    in srgb,
    var(--ylf-cloud-body, #f2f8ff),
    var(--_ylf-cloud-haze-color) calc(var(--ylf-cloud-haze, 0) * 85%)
  );
  --_ylf-cloud-shade: color-mix(
    in srgb,
    var(--ylf-cloud-shade, #c6dff5),
    var(--_ylf-cloud-haze-color) calc(var(--ylf-cloud-haze, 0) * 100%)
  );
  --_ylf-cloud-shadow: color-mix(
    in srgb,
    var(--ylf-cloud-shadow, #83addb),
    var(--_ylf-cloud-haze-color) calc(var(--ylf-cloud-haze, 0) * 100%)
  );

  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  pointer-events: none;
}

.ylf-cloud__underside {
  opacity: calc(1 - var(--ylf-cloud-haze, 0) * 0.8);
}

.ylf-cloud__rim {
  fill: none;
  opacity: calc(0.85 - var(--ylf-cloud-haze, 0) * 0.6);
}

.ylf-cloud__face {
  opacity: var(--ylf-cloud-face-opacity, 0);
  fill: var(--ylf-cloud-face, #5a7fae);
  stroke: var(--ylf-cloud-face, #5a7fae);
  transition: opacity var(--ylf-duration-slow, 480ms) var(--ylf-ease-standard, cubic-bezier(0.2, 0, 0, 1));
}

.ylf-cloud__face path {
  fill: none;
}

.ylf-cloud__blush {
  fill: var(--ylf-palette-pink, #ec4899);
  stroke: none;
  opacity: 0.28;
}

.ylf-cloud__eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: ylf-cloud-blink 5.2s ease-in-out 3s infinite;
}

@keyframes ylf-cloud-blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }

  95% {
    transform: scaleY(0.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ylf-cloud__face {
    transition: none;
  }

  .ylf-cloud__eye {
    animation: none;
  }
}
</style>
