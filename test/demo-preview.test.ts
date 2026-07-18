import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('demo preview', () => {
  it('starts with a responsive light canvas', async () => {
    const previewModule = await import('../packages/.vitepress/theme/composables/useDemoPreview')
      .catch(() => ({ useDemoPreview: undefined }))

    expect(previewModule.useDemoPreview).toBeTypeOf('function')

    const preview = previewModule.useDemoPreview!()

    expect(preview.scheme.value).toBe('light')
    expect(preview.viewport.value).toBe('responsive')
    expect(preview.frameClass.value).toEqual({
      'ylf-theme-dark': false,
      'ylf-theme-light': true,
    })
    expect(preview.frameStyle.value).toEqual({ maxWidth: '100%' })
    expect(preview.sourceVisible.value).toBe(false)
  })

  it('updates the canvas without changing the surrounding documentation theme', async () => {
    const { useDemoPreview } = await import('../packages/.vitepress/theme/composables/useDemoPreview')
    const preview = useDemoPreview()

    preview.setScheme('dark')
    preview.setViewport('mobile')
    preview.toggleSource()

    expect(preview.scheme.value).toBe('dark')
    expect(preview.viewport.value).toBe('mobile')
    expect(preview.frameClass.value).toEqual({
      'ylf-theme-dark': true,
      'ylf-theme-light': false,
    })
    expect(preview.frameStyle.value).toEqual({ maxWidth: '390px' })
    expect(preview.sourceVisible.value).toBe(true)
  })

  it('keeps Reka portals inside the themed preview frame', async () => {
    const component = await readFile(
      resolve(import.meta.dirname, '../packages/.vitepress/theme/components/DemoContainer.vue'),
      'utf8',
    )

    expect(component).toContain('import { ConfigProvider } from \'reka-ui\'')
    expect(component).toContain('<ConfigProvider :teleport-to="portalTargetSelector">')
    expect(component).toContain(':id="portalTargetId" class="ylf-demo-preview__portal"')
  })
})
