import { computed, ref } from 'vue'

export type DemoPreviewScheme = 'light' | 'dark'
export type DemoPreviewViewport = 'responsive' | 'tablet' | 'mobile'

const VIEWPORT_WIDTHS: Record<DemoPreviewViewport, string> = {
  responsive: '100%',
  tablet: '768px',
  mobile: '390px',
}

export function useDemoPreview() {
  const scheme = ref<DemoPreviewScheme>('light')
  const viewport = ref<DemoPreviewViewport>('responsive')
  const sourceVisible = ref(false)

  const frameClass = computed(() => ({
    'ylf-theme-dark': scheme.value === 'dark',
    'ylf-theme-light': scheme.value === 'light',
  }))

  const frameStyle = computed(() => ({
    maxWidth: VIEWPORT_WIDTHS[viewport.value],
  }))

  function setScheme(value: DemoPreviewScheme) {
    scheme.value = value
  }

  function setViewport(value: DemoPreviewViewport) {
    viewport.value = value
  }

  function toggleSource() {
    sourceVisible.value = !sourceVisible.value
  }

  return {
    frameClass,
    frameStyle,
    scheme,
    setScheme,
    setViewport,
    sourceVisible,
    toggleSource,
    viewport,
  }
}
