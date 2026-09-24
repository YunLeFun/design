import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ComponentInfo from '../packages/.vitepress/theme/components/ComponentInfo.vue'

vi.mock('@yunlefun/metadata', () => ({
  components: [{ name: 'button', lastUpdated: '2026-09-24T16:41:00.000Z' }],
}))

afterEach(() => vi.useRealTimers())

describe('static component metadata', () => {
  it('renders the same date at build time and when viewed later', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-24T17:00:00Z'))
    const built = await renderToString(createSSRApp(ComponentInfo, { comp: 'button' }))
    vi.setSystemTime(new Date('2026-10-01T10:00:00Z'))
    const visited = await renderToString(createSSRApp(ComponentInfo, { comp: 'button' }))
    expect(visited).toBe(built)
    expect(visited).toContain('2026-09-24 UTC')
    expect(visited).toContain('datetime="2026-09-24T16:41:00.000Z"')
  })
})
