// @vitest-environment happy-dom
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import YlfAgentCard from '../packages/vue/components/YlfAgentCard.vue'
import YlfAgentStatus from '../packages/vue/components/YlfAgentStatus.vue'
import YlfAgentTask from '../packages/vue/components/YlfAgentTask.vue'

enableAutoUnmount(afterEach)

describe('aI agent presentation contracts', () => {
  it('keeps unverified and listening states explicit and live announcements opt-in', async () => {
    const wrapper = mount(YlfAgentStatus, { props: { state: 'unknown', label: '未验证' } })
    expect(wrapper.text()).toBe('未验证')
    expect(wrapper.attributes('role')).toBeUndefined()
    await wrapper.setProps({ state: 'waiting', label: '回调已监听', live: true })
    expect(wrapper.attributes('data-state')).toBe('waiting')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-atomic')).toBe('true')
    expect(wrapper.text()).not.toContain('已连接')
  })

  it('names separate cards with their own headings and keeps identity text escaped', () => {
    const wrapper = mount({ render: () => h('div', [
      h(YlfAgentCard, { name: '<img src=x onerror=alert(1)>', state: 'unknown', statusLabel: '未验证' }),
      h(YlfAgentCard, { name: 'Assistant', state: 'ready', statusLabel: 'Ready' }),
    ]) })
    const cards = wrapper.findAll('article')
    const ids = cards.map(card => card.attributes('aria-labelledby'))
    expect(new Set(ids).size).toBe(2)
    for (const card of cards)
      expect(card.get('h2').attributes('id')).toBe(card.attributes('aria-labelledby'))
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('<img src=x onerror=alert(1)>')
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('shows a waiting task without fabricated progress or executing a slotted action', async () => {
    const approve = vi.fn()
    const wrapper = mount(YlfAgentTask, {
      props: { title: '当前任务', state: 'waiting', statusLabel: '等待审批', taskId: 'task-001', description: '<script>approve()</script>' },
      slots: { actions: () => h('button', { disabled: true, onClick: approve }, '批准') },
    })
    expect(wrapper.get('code').text()).toBe('task-001')
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('%')
    await wrapper.setProps({ state: 'working', statusLabel: '执行中' })
    expect(approve).not.toHaveBeenCalled()
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })

  it('distributes exactly the same agent source and types through Registry', async () => {
    const root = resolve(import.meta.dirname, '..')
    const payload = JSON.parse(await readFile(resolve(root, 'packages/public/r/ylf-agent.json'), 'utf8'))
    expect(payload.meta.status).toBe('experimental')
    expect(payload.dependencies).toContain('@yunlefun/ui@0.0.6')
    expect(payload.files.map((file: { path: string }) => file.path)).toHaveLength(4)
    for (const file of payload.files) {
      expect(file.content).toBe(await readFile(resolve(root, file.path), 'utf8'))
      expect(file.target).toBe(`~/src/components/ui/${file.path.split('/').at(-1)}`)
    }
  })
})
