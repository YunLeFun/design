<script lang="ts" setup>
import type { YlfCloudShape } from './cloud'
import { computed, useId } from 'vue'

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

// 连续轮廓让云边保持柔软，不露出圆形拼接；每种轮廓都不同，缩放、翻转后也不会显得重复。
const silhouettes: Record<YlfCloudShape, string> = {
  // 层层鼓起的主云。
  billow: 'M 58 199 C 26 199 8 185 8 164 C 8 144 22 130 43 128 C 39 102 55 81 79 80 C 94 79 106 85 115 94 C 106 57 129 24 164 23 C 191 22 211 38 220 61 C 232 43 251 36 269 40 C 295 45 310 66 309 90 C 325 80 345 83 357 95 C 367 104 371 117 369 129 C 392 119 417 130 424 151 C 449 147 477 163 477 183 C 477 207 453 218 422 218 C 391 218 367 213 341 216 C 303 222 272 218 246 215 C 211 222 176 217 151 212 C 118 218 84 214 58 199 Z',
  // 宽厚的近景积云，右侧堆得更高。
  heap: 'M 40 205 C 14 205 4 190 10 174 C 16 158 34 152 52 156 C 50 126 74 106 102 112 C 112 78 150 62 182 76 C 198 44 240 30 274 46 C 302 30 344 38 360 66 C 392 58 424 78 426 108 C 456 110 482 132 480 162 C 486 190 466 208 436 210 C 380 214 330 212 280 214 C 220 216 160 214 110 212 C 84 212 60 208 40 205 Z',
  // 贴着地平线的扁长云堤。
  bank: 'M 30 212 C 10 212 2 200 8 188 C 14 176 30 172 46 176 C 52 156 74 148 94 156 C 108 136 138 132 156 146 C 172 124 208 120 228 138 C 246 118 284 118 300 140 C 318 126 352 128 362 150 C 380 140 410 144 418 162 C 444 158 470 172 474 190 C 478 206 462 214 440 214 C 380 216 300 214 230 216 C 160 218 90 214 30 212 Z',
  // 圆鼓鼓的小团云。
  puff: 'M 120 210 C 88 210 70 192 76 170 C 82 150 102 142 122 148 C 120 112 150 86 186 90 C 204 60 250 52 278 76 C 300 64 336 74 344 104 C 376 102 404 126 400 156 C 412 182 396 210 366 212 C 300 214 220 214 120 210 Z',
  // 远处拉长的薄云。
  wisp: 'M 20 200 C 6 200 2 190 10 184 C 18 178 30 178 40 180 C 52 166 80 162 98 170 C 120 156 160 154 182 166 C 206 152 248 150 270 164 C 296 152 336 154 352 168 C 376 160 410 162 426 174 C 452 170 482 178 484 190 C 486 202 470 206 446 206 C 380 208 300 206 230 208 C 160 210 80 206 20 200 Z',
}

const d = computed(() => silhouettes[props.shape] ?? silhouettes.billow)
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

<style lang="scss">
// 配色来自 @yunlefun/ui 的 --ylf-cloud-* token，随主题切换；
// --ylf-cloud-haze（0–1）把远处的云混向天空色，形成空气透视。
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
