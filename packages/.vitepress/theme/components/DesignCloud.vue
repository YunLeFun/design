<script setup lang="ts">
import { useId } from 'vue'

const cloudId = `ylf-cloud-${useId()}`
const outline = 'M102 181c-30 0-53-21-53-48 0-28 24-50 53-50 7 0 14 1 20 4 5-36 35-62 72-62 36 0 66 25 72 58 8-3 17-5 26-5 34 0 61 24 61 53 0 28-26 50-58 50H102Z'
</script>

<template>
  <svg class="design-cloud" viewBox="0 0 400 220" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient :id="`${cloudId}-body`" x1="280" y1="40" x2="150" y2="181" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--cloud-mid)" />
        <stop offset="0.55" stop-color="var(--cloud-base)" />
        <stop offset="1" stop-color="var(--cloud-shade)" />
      </linearGradient>
      <radialGradient :id="`${cloudId}-volume`" cx="226" cy="61" r="96" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--cloud-lit)" stop-opacity="0.8" />
        <stop offset="0.5" stop-color="var(--cloud-mid)" stop-opacity="0.65" />
        <stop offset="1" stop-color="var(--cloud-mid)" stop-opacity="0" />
      </radialGradient>
      <radialGradient :id="`${cloudId}-left`" :href="`#${cloudId}-volume`" cx="115" cy="110" r="62" />
      <radialGradient :id="`${cloudId}-right`" :href="`#${cloudId}-volume`" cx="310" cy="99" r="75" />
      <linearGradient :id="`${cloudId}-under`" x1="200" y1="112" x2="200" y2="181" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--cloud-under)" stop-opacity="0" />
        <stop offset="1" stop-color="var(--cloud-under)" stop-opacity="0.85" />
      </linearGradient>
      <linearGradient :id="`${cloudId}-rim`" x1="310" y1="40" x2="130" y2="165" gradientUnits="userSpaceOnUse">
        <stop stop-color="var(--cloud-edge)" stop-opacity="0.6" />
        <stop offset="0.55" stop-color="var(--cloud-edge)" stop-opacity="0.2" />
        <stop offset="1" stop-color="var(--cloud-edge)" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path :d="outline" :fill="`url(#${cloudId}-body)`" />
    <path :d="outline" :fill="`url(#${cloudId}-volume)`" />
    <path :d="outline" :fill="`url(#${cloudId}-left)`" opacity="0.65" />
    <path :d="outline" :fill="`url(#${cloudId}-right)`" />
    <path :d="outline" :fill="`url(#${cloudId}-under)`" />
    <path :d="outline" :stroke="`url(#${cloudId}-rim)`" stroke-width="1.25" />
  </svg>
</template>

<style scoped>
.design-cloud {
  --cloud-lit: #ffffff;
  --cloud-mid: #f3f8ff;
  --cloud-base: #e5effb;
  --cloud-shade: #ccdded;
  --cloud-under: #bfd3e8;
  --cloud-edge: #ffffff;

  pointer-events: none;
}
.dark .design-cloud {
  --cloud-lit: #96a9bb;
  --cloud-mid: #4a6075;
  --cloud-base: #2c3e50;
  --cloud-shade: #202e3f;
  --cloud-under: #0c1724;
  --cloud-edge: #ccdce9;
}
</style>
