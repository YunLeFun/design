// @vitest-environment happy-dom
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { compile } from 'sass'
import { afterEach, describe, expect, it } from 'vitest'
import { ylfCloudShapes } from '../packages/vue/components/cloud'
import YlfCloud from '../packages/vue/components/YlfCloud.vue'
import * as root from '../packages/vue/src/types'

enableAutoUnmount(afterEach)

const css = compile(resolve(import.meta.dirname, '../packages/ui/styles/css-vars.scss')).css

function declarations(selector: string) {
  const block = css.split(`${selector} {`)[1]?.split('}')[0] ?? ''
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):([^;]+);/g)].map(match => [match[1], match[2].trim()]))
}

describe('ylfCloud', () => {
  it('stays decorative and out of the accessibility tree', () => {
    const svg = mount(YlfCloud).get('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('focusable')).toBe('false')
    expect(svg.attributes('viewBox')).toBe('0 0 490 250')
    expect(svg.find('title').exists()).toBe(false)
  })

  it('draws a distinct silhouette for every shape', () => {
    const outlines = ylfCloudShapes.map((shape) => {
      const wrapper = mount(YlfCloud, { props: { shape } })
      expect(wrapper.attributes('data-shape')).toBe(shape)
      return wrapper.get('clipPath path').attributes('d')
    })
    expect(new Set(outlines).size).toBe(ylfCloudShapes.length)
    expect(root.ylfCloudShapes).toBe(ylfCloudShapes)
  })

  it('keeps gradient and clip ids unique per instance', () => {
    const wrapper = mount({
      components: { YlfCloud },
      template: '<div><YlfCloud /><YlfCloud /></div>',
    })
    const ids = wrapper.findAll('[id]').map(node => node.attributes('id'))
    expect(new Set(ids).size).toBe(ids.length)
    for (const svg of wrapper.findAll('svg')) {
      const clip = svg.get('clipPath').attributes('id')
      expect(svg.get('g').attributes('clip-path')).toBe(`url(#${clip})`)
    }
  })

  it('only pays for the blur filter on volumetric clouds', async () => {
    const wrapper = mount(YlfCloud)
    expect(wrapper.find('filter').exists()).toBe(false)
    await wrapper.setProps({ volumetric: true })
    const filter = wrapper.get('filter').attributes('id')
    expect(wrapper.get('.ylf-cloud__volume').attributes('filter')).toBe(`url(#${filter})`)
  })

  it('renders the face only on request, hidden until the host reveals it', async () => {
    const wrapper = mount(YlfCloud)
    expect(wrapper.find('.ylf-cloud__face').exists()).toBe(false)
    await wrapper.setProps({ face: true })
    expect(wrapper.findAll('.ylf-cloud__eye')).toHaveLength(2)
    const source = await readFile(resolve(import.meta.dirname, '../packages/vue/components/YlfCloud.vue'), 'utf8')
    expect(source).toContain('opacity: var(--ylf-cloud-face-opacity, 0)')
    expect(source).toMatch(/prefers-reduced-motion: reduce[\s\S]*\.ylf-cloud__eye \{\s*animation: none;/)
  })
})

describe('shared cloud and motion tokens', () => {
  const cloudTokens = ['highlight', 'body', 'shade', 'shadow', 'rim', 'face', 'haze-color'].map(name => `--ylf-cloud-${name}`)

  it.each(['.ylf-theme-light', '.ylf-theme-dark'])('%s defines the cloud palette', (selector) => {
    const tokens = declarations(selector)
    for (const token of cloudTokens)
      expect(tokens[token], token).toMatch(/^#[\da-f]{6}$/i)
  })

  it('ships the soft spring and slow duration, zeroed for reduced motion', () => {
    const light = declarations('.ylf-theme-light')
    expect(light['--ylf-ease-spring']).toMatch(/^linear\(/)
    expect(light['--ylf-duration-slow']).toBe('480ms')
    const reduced = css.split('@media (prefers-reduced-motion: reduce)')[1]
    expect(reduced).toMatch(/--ylf-duration-slow:\s*0ms/)
  })
})
