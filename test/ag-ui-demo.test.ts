import { EventType } from '@ag-ui/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { createDemoAgent } from '../packages/.vitepress/theme/components/ag-ui/demo-agent'
import { useAgUiDemo } from '../packages/.vitepress/theme/components/ag-ui/useAgUiDemo'

const scopes: ReturnType<typeof effectScope>[] = []
function createSession(scenario: 'stream' | 'tool' | 'interrupt', english = false, delayMs = 0) {
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
})
