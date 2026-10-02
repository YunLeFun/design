import type { DemoScenario } from '../packages/.vitepress/theme/components/ag-ui/demo-scenarios'
import { EventType } from '@ag-ui/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { createDemoAgent } from '../packages/.vitepress/theme/components/ag-ui/demo-agent'
import { demoScenarios } from '../packages/.vitepress/theme/components/ag-ui/demo-scenarios'
import { useAgUiDemo } from '../packages/.vitepress/theme/components/ag-ui/useAgUiDemo'

const scopes: ReturnType<typeof effectScope>[] = []
function createSession(scenario: DemoScenario, english = false, delayMs = 0) {
  const scope = effectScope()
  scopes.push(scope)
  return { scope, demo: scope.run(() => useAgUiDemo(scenario, english, delayMs))! }
}

afterEach(() => {
  for (const scope of scopes.splice(0))
    scope.stop()
  vi.unstubAllGlobals()
})

describe('interactive AG-UI examples through local SSE and the official client', () => {
  it('streams text and shared state without requesting tools or connecting on setup', async () => {
    const { demo } = createSession('stream')
    expect(demo.events.value).toEqual([])
    expect(demo.messages.value).toEqual([])
    await demo.submit('展示流式回复')
    expect(demo.status.value).toBe('success')
    expect(demo.state.value).toEqual({ scenario: 'stream', phase: 'done' })
    expect(demo.messages.value.at(-1)?.content).toContain('分段到达')
    const types = demo.events.value.map(event => event.type)
    expect(types).toContain(EventType.STATE_SNAPSHOT)
    expect(types).toContain(EventType.STATE_DELTA)
    expect(types.filter(type => type === EventType.TEXT_MESSAGE_CONTENT).length).toBeGreaterThan(1)
    expect(types.at(-1)).toBe(EventType.RUN_FINISHED)
    expect(types).not.toContain(EventType.TOOL_CALL_START)
    expect(demo.isAwaitingInput.value).toBe(false)
  })

  it.each([true, false])('handles tool approval=%s and reads the page only when allowed', async (approved) => {
    const readTheme = vi.fn(() => true)
    vi.stubGlobal('document', { documentElement: { classList: { contains: readTheme } } })
    const { demo } = createSession('tool')
    await demo.submit('检查主题')
    expect(demo.pendingTool.value?.function).toMatchObject({ name: 'read_theme', arguments: '{}' })
    expect(demo.isAwaitingInput.value).toBe(true)
    expect(readTheme).not.toHaveBeenCalled()
    await demo.submit('不能绕过确认')
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
    await demo.confirmTool(approved)
    expect(demo.isAwaitingInput.value).toBe(false)
    expect(demo.pendingToolCallIds.value).toEqual([])
    expect(readTheme).toHaveBeenCalledTimes(approved ? 1 : 0)
    expect(demo.state.value).toEqual(approved
      ? { scenario: 'tool', phase: 'done', theme: 'dark' }
      : { scenario: 'tool', phase: 'declined' })
    const result = demo.messages.value.find(message => message.role === 'tool')
    expect(JSON.parse(String(result?.content))).toEqual(approved ? { approved, theme: 'dark' } : { approved })
    expect(demo.messages.value.at(-1)?.content).toContain(approved ? '已收到主题信息' : '已拒绝')
  })

  it.each([true, false])('resumes a protocol interrupt with approval=%s and clears pending input', async (approved) => {
    const { demo } = createSession('interrupt', true)
    await demo.submit('Pause first')
    expect(demo.status.value).toBe('interrupted')
    expect(demo.interrupts.value).toHaveLength(1)
    expect(demo.pendingToolCallIds.value).toEqual([])
    expect(demo.canRetry.value).toBe(false)
    await demo.resume(approved)
    expect(demo.status.value).toBe('success')
    expect(demo.isAwaitingInput.value).toBe(false)
    expect(demo.interrupts.value).toEqual([])
    expect(demo.state.value.phase).toBe(approved ? 'done' : 'declined')
    expect(demo.messages.value.at(-1)?.content).toContain(approved ? 'Confirmation received' : 'Continuation declined')
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
  })

  it('retries a service error without duplicating the user message or replaying the failure flag', async () => {
    const { demo } = createSession('stream')
    await demo.submit('Keep this request')
    await demo.simulateFailure()
    expect(demo.status.value).toBe('error')
    expect(demo.error.value?.message).toContain('模拟服务失败')
    expect(demo.canRetry.value).toBe(true)
    expect(demo.events.value.at(-1)?.type).toBe(EventType.RUN_ERROR)
    await demo.retry()
    expect(demo.status.value).toBe('success')
    expect(demo.error.value).toBeUndefined()
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
  })

  it('preserves partial output on stop and retries the same request', async () => {
    const { demo } = createSession('stream', false, 5)
    const sending = demo.submit('One request')
    await vi.waitFor(() => expect(demo.messages.value.some(message => message.role === 'assistant' && message.content)).toBe(true))
    demo.cancel()
    await sending
    expect(demo.status.value).toBe('cancelled')
    expect(demo.messages.value.at(-1)?.content).toBeTruthy()
    expect(demo.canRetry.value).toBe(true)
    await demo.retry()
    expect(demo.status.value).toBe('success')
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
  })

  it('keeps the resume response when retrying a stopped continuation', async () => {
    const { demo } = createSession('interrupt', true, 5)
    await demo.submit('Wait for confirmation')
    const continuing = demo.resume(true)
    await vi.waitFor(() => expect(demo.state.value.phase).toBe('streaming'))
    demo.cancel()
    await continuing
    expect(demo.canRetry.value).toBe(true)
    await demo.retry()
    expect(demo.status.value).toBe('success')
    expect(demo.state.value.phase).toBe('done')
    expect(demo.isAwaitingInput.value).toBe(false)
    expect(demo.messages.value.at(-1)?.content).toContain('Confirmation received')
  })

  it('keeps an approved tool result when retrying a stopped reply', async () => {
    vi.stubGlobal('document', { documentElement: { classList: { contains: () => false } } })
    const { demo } = createSession('tool', false, 5)
    await demo.submit('检查主题')
    const continuing = demo.confirmTool(true)
    await vi.waitFor(() => expect(demo.messages.value.at(-1)?.content).toContain('已收到'))
    demo.cancel()
    await continuing
    await demo.retry()
    expect(demo.status.value).toBe('success')
    expect(demo.state.value).toEqual({ scenario: 'tool', phase: 'done', theme: 'light' })
    expect(demo.pendingToolCallIds.value).toEqual([])
    expect(demo.messages.value.filter(message => message.role === 'tool')).toHaveLength(1)
  })

  it('does not reuse resolved resume entries in a later simulated failure', async () => {
    const { demo } = createSession('interrupt')
    await demo.submit('请暂停')
    await demo.resume(true)
    await demo.simulateFailure()
    expect(demo.status.value).toBe('error')
    await demo.retry()
    expect(demo.status.value).toBe('interrupted')
    expect(demo.interrupts.value).toHaveLength(1)
  })

  it('cancels a discarded session, ignores late events and starts with independent state', async () => {
    const old = createSession('stream', false, 5)
    const sending = old.demo.submit('Discard this')
    await vi.waitFor(() => expect(old.demo.events.value.length).toBeGreaterThan(0))
    old.scope.stop()
    const eventCount = old.demo.events.value.length
    await sending
    expect(old.demo.events.value).toHaveLength(eventCount)
    const next = createSession('tool')
    expect(next.demo.messages.value).toEqual([])
    expect(next.demo.events.value).toEqual([])
    expect(next.demo.state.value).toEqual({ phase: 'idle', scenario: 'tool' })
    expect(createDemoAgent(false).threadId).not.toBe(createDemoAgent(false).threadId)
  })

  it('bounds the event log while retaining monotonic event numbers', async () => {
    const { demo } = createSession('stream', true)
    for (let index = 0; index < 3; index++)
      await demo.submit(`Request ${index}`)
    expect(demo.events.value).toHaveLength(80)
    expect(demo.events.value[0]!.id).toBeGreaterThan(1)
    expect(demo.events.value.at(-1)?.type).toBe(EventType.RUN_FINISHED)
  })

  it('updates a task plan through step events and incremental progress', async () => {
    const { demo } = createSession('plan', true)
    await demo.submit('Plan a workshop')
    expect(demo.status.value).toBe('success')
    expect(demo.state.value.progress).toBe(100)
    expect(demo.state.value.tasks).toHaveLength(3)
    expect(demo.state.value.tasks?.every(task => task.status === 'done')).toBe(true)
    const starts = demo.events.value.filter(event => event.type === EventType.STEP_STARTED)
    const finishes = demo.events.value.filter(event => event.type === EventType.STEP_FINISHED)
    expect(starts).toHaveLength(3)
    expect(finishes.map(event => JSON.parse(event.payload).stepName)).toEqual(starts.map(event => JSON.parse(event.payload).stepName))
    const patches = demo.events.value.filter(event => event.type === EventType.STATE_DELTA).flatMap(event => JSON.parse(event.payload).delta)
    expect(patches.filter(patch => patch.path === '/progress').map(patch => patch.value)).toEqual([33, 67, 100])
  })

  it('streams structured cards and writes a valid selection back to shared state', async () => {
    const { demo } = createSession('cards')
    await demo.submit('配色建议')
    expect(demo.state.value.recommendations?.map(item => item.id)).toEqual(['sky', 'mint', 'sun'])
    expect(demo.events.value.filter(event => event.payload.includes('/recommendations/-'))).toHaveLength(3)
    demo.selectRecommendation('unknown')
    expect(demo.state.value.selectedRecommendation).toBe('')
    demo.selectRecommendation('mint')
    expect(demo.state.value.selectedRecommendation).toBe('mint')
    await demo.simulateFailure()
    await demo.retry()
    expect(demo.state.value.selectedRecommendation).toBe('mint')
  })

  it('returns edited form fields to the next run and prevents ordinary sends until confirmed', async () => {
    const { demo } = createSession('form')
    await demo.submit('帮我拟一份活动草稿')
    expect(demo.state.value.phase).toBe('awaiting_form')
    expect(demo.disabled.value).toBe(true)
    await demo.submit('不能跳过表单')
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
    const draft = { title: '周六绘画课', audience: '附近的朋友', tone: 'formal' as const }
    demo.updateDraft(draft)
    await demo.submitDraft()
    expect(demo.state.value.draft).toEqual(draft)
    expect(demo.state.value.draftSubmitted).toBe(true)
    expect(demo.state.value.phase).toBe('done')
    expect(demo.messages.value.at(-1)?.content).toContain('周六绘画课')
    expect(demo.messages.value.at(-1)?.content).toContain('附近的朋友')
    expect(demo.messages.value.at(-1)?.content).toContain('正式')
    demo.updateDraft({ ...draft, title: '不能修改已确认的草稿' })
    expect(demo.state.value.draft?.title).toBe('周六绘画课')
    await demo.simulateFailure()
    await demo.retry()
    expect(demo.state.value.draft).toEqual(draft)
    expect(demo.state.value.draftSubmitted).toBe(true)
  })

  it('keeps an incomplete form for correction without starting another run', async () => {
    const { demo } = createSession('form', true)
    await demo.submit('Draft a workshop')
    const eventCount = demo.events.value.length
    demo.updateDraft({ title: ' ', audience: 'Creators', tone: 'friendly' })
    await demo.submitDraft()
    expect(demo.state.value.phase).toBe('awaiting_form')
    expect(demo.actionError.value).toContain('Complete the title')
    expect(demo.events.value).toHaveLength(eventCount)
    demo.updateDraft({ title: 'Workshop', audience: 'Creators', tone: 'friendly' })
    await demo.submitDraft()
    expect(demo.actionError.value).toBeUndefined()
    expect(demo.state.value.phase).toBe('done')
  })

  it('preserves edited form data and the confirmation when retrying a stopped continuation', async () => {
    const { demo } = createSession('form', true, 5)
    await demo.submit('Draft a workshop')
    demo.updateDraft({ title: 'My edited workshop', audience: 'My friends', tone: 'formal' })
    const continuing = demo.submitDraft()
    await vi.waitFor(() => expect(demo.state.value.draftSubmitted).toBe(true))
    demo.cancel()
    await continuing
    await demo.retry()
    expect(demo.state.value.phase).toBe('done')
    expect(demo.state.value.draft?.title).toBe('My edited workshop')
    expect(demo.messages.value.at(-1)?.content).toContain('My edited workshop')
    expect(demo.messages.value.filter(message => message.role === 'user')).toHaveLength(1)
  })

  it.each([true, false])('waits for both tool answers, including out-of-order approval=%s', async (approveTheme) => {
    const readTheme = vi.fn(() => false)
    vi.stubGlobal('document', { documentElement: { classList: { contains: readTheme } } })
    const { demo } = createSession('multi-tool')
    await demo.submit('检查主题和示例')
    expect(demo.pendingTools.value.map(tool => tool.function.name)).toEqual(['read_theme', 'list_examples'])
    const [theme, catalog] = demo.pendingTools.value
    const eventCount = demo.events.value.length
    await demo.confirmTool(true, catalog!.id)
    expect(demo.pendingTools.value).toHaveLength(1)
    expect(demo.isAwaitingInput.value).toBe(true)
    expect(demo.events.value).toHaveLength(eventCount)
    expect(readTheme).not.toHaveBeenCalled()
    await demo.confirmTool(true, catalog!.id)
    expect(demo.messages.value.filter(message => message.role === 'tool')).toHaveLength(1)
    await demo.confirmTool(approveTheme, theme!.id)
    expect(demo.status.value).toBe('success')
    expect(demo.pendingToolCallIds.value).toEqual([])
    expect(readTheme).toHaveBeenCalledTimes(approveTheme ? 1 : 0)
    expect(demo.state.value.toolResults).toContainEqual({ name: 'list_examples', approved: true, count: demoScenarios.length, examples: demoScenarios.map(item => item.id) })
    expect(demo.state.value.toolResults).toContainEqual(approveTheme ? { name: 'read_theme', approved: true, theme: 'light' } : { name: 'read_theme', approved: false })
  })

  it('records two refusals without reading the page or blocking a new request', async () => {
    const readTheme = vi.fn()
    vi.stubGlobal('document', { documentElement: { classList: { contains: readTheme } } })
    const { demo } = createSession('multi-tool')
    await demo.submit('可以检查吗')
    const pending = [...demo.pendingTools.value]
    for (const tool of pending)
      await demo.confirmTool(false, tool.id)
    expect(demo.state.value.phase).toBe('declined')
    expect(demo.state.value.toolResults?.every(result => !result.approved)).toBe(true)
    expect(readTheme).not.toHaveBeenCalled()
    await demo.submit('重新申请')
    expect(demo.pendingTools.value).toHaveLength(2)
  })
})
