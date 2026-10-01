import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

export function useDocsLocale() {
  const { lang } = useData()
  const english = computed(() => lang.value.startsWith('en'))
  const text = (chinese: string, translated: string) => english.value ? translated : chinese
  const link = (path: string) => withBase(`${english.value ? '/en' : ''}${path}`)
  return { english, text, link }
}
