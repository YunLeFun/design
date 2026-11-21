import { onMounted, shallowRef } from 'vue'

let hydrated = false

export function useHydrated() {
  const isHydrated = shallowRef(hydrated)
  onMounted(() => {
    hydrated = true
    isHydrated.value = true
  })
  return isHydrated
}
