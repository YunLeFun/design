import { describe, expect, it } from 'vitest'
import { readBrandPalette, renderBrandAssets } from '../packages/vitepress-theme-yunlefun/brand-assets.mjs'

describe('shared brand assets', () => {
  it('resolves light aliases and dark overrides from UI CSS', () => {
    const palette = readBrandPalette(':root{--ylf-palette-blue:#2563eb;--ylf-c-brand:var(--ylf-palette-blue);--ylf-c-bg:#fff}.dark,.ylf-theme-dark{--ylf-c-brand:#60a5fa;--ylf-c-bg:#10151d}')
    expect(palette).toEqual({ light: '#2563eb', dark: '#60a5fa', background: '#10151d' })
    for (const name of ['brand-mark', 'design-mark'] as const) {
      const assets = renderBrandAssets(name, palette)
      expect(assets.favicon).toContain('@media(prefers-color-scheme:dark)')
      expect(assets.dark).toContain('#60a5fa')
      expect(assets.app).toContain(name === 'brand-mark' ? '#60a5fa' : '#2563eb')
      expect(assets.mark).toContain('currentColor')
    }
  })

  it('renders a site-provided Iconify mark with an accent palette', () => {
    const assets = renderBrandAssets({ body: '<path fill="currentColor" d="M0 0h24v24H0z"/>', width: 24, height: 24 }, { light: '#0f766e', dark: '#5eead4', background: '#10151d' })
    expect(assets.mark).toContain('viewBox="0 0 24 24"')
    expect(assets.dark).toContain('#5eead4')
    expect(assets.app).toContain('#10151d')
  })

  it('fails clearly when tokens or canonical names are missing', () => {
    expect(() => readBrandPalette(':root{}')).toThrow('Expected a hex color')
    expect(() => renderBrandAssets('missing' as never, {} as never)).toThrow('Unsupported site mark')
    expect(() => renderBrandAssets({} as never, {} as never)).toThrow('Iconify data with a body')
  })
})
