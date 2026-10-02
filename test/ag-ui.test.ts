import type { BaseEvent, RunAgentInput } from '@ag-ui/client'
import { EventType, HttpAgent } from '@ag-ui/client'
import { describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useAgUiAgent } from '../packages/vue/src/ag-ui'

function createHarness() {
  let controller: ReadableStreamDefaultController<Uint8Array>
  let input: RunAgentInput
  let signal: AbortSignal | undefined
  let ready!: () => void
  const started = new Promise<void>((resolve) => {
    ready = resolve
  })
  const fetch = vi.fn(async (_url: string, init: RequestInit) => {
    input = JSON.parse(String(init.body))
    signal = init.signal ?? undefined
    const stream = new ReadableStream<Uint8Array>({
      start(value) {
        controller = value
        signal?.addEventListener('abort', () => controller.error(new DOMException('Aborted', 'AbortError')), { once: true })
        ready()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
  })
  const agent = new HttpAgent({ url: 'https://agent.example.test/run', fetch })
  const scope = effectScope()
  const binding = scope.run(() => useAgUiAgent(agent))!
  function emit(event: BaseEvent) {
    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`))
  }
  return {
    agent,
    binding,
    scope,
    fetch,
    started,
    emit,
    input: () => input,
    signal: () => signal,
    close: () => controller.close(),
    start: () => emit({ type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId } as BaseEvent),
    finish: () => {
      emit({ type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId } as BaseEvent)
      controller.close()
    },
  }
}

describe('aG-UI optional Vue binding through the real HttpAgent SSE parser', () => {
  it('does not connect on setup and streams messages and JSON Patch state', async () => {
    const h = createHarness()
    expect(h.fetch).not.toHaveBeenCalled()
    h.binding.setState({ theme: 'light' })
    const running = h.binding.send('Inspect the theme')
    expect(h.binding.isRunning.value).toBe(true)
    await h.started
    expect(h.input().messages.at(-1)).toMatchObject({ role: 'user', content: 'Inspect the theme' })
    expect(h.input().state).toEqual({ theme: 'light' })
    h.start()
    h.emit({ type: EventType.STATE_SNAPSHOT, snapshot: { phase: 'checking' } } as BaseEvent)
    h.emit({ type: EventType.TEXT_MESSAGE_START, messageId: 'reply', role: 'assistant' } as BaseEvent)
    h.emit({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'reply', delta: 'Hello ' } as BaseEvent)
    await vi.waitFor(() => expect(h.binding.messages.value.at(-1)?.content).toBe('Hello '))
    h.emit({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'reply', delta: 'YunLeFun' } as BaseEvent)
    h.emit({ type: EventType.TEXT_MESSAGE_END, messageId: 'reply' } as BaseEvent)
    h.emit({ type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/phase', value: 'done' }] } as BaseEvent)
    h.finish()
    await running
    expect(h.binding.messages.value.at(-1)?.content).toBe('Hello YunLeFun')
    expect(h.binding.state.value).toEqual({ phase: 'done' })
    expect(h.binding.status.value).toBe('success')
    expect(h.binding.isRunning.value).toBe(false)
    h.scope.stop()
  })

  it('exposes tool calls for explicit host handling and rejects duplicate results', async () => {
    const h = createHarness()
    const running = h.binding.run({ tools: [{ name: 'inspect_theme', description: 'Read theme', parameters: { type: 'object' } }] })
    await h.started
    h.start()
    h.emit({ type: EventType.TOOL_CALL_START, toolCallId: 'tool-1', toolCallName: 'inspect_theme', parentMessageId: 'assistant-1' } as BaseEvent)
    h.emit({ type: EventType.TOOL_CALL_ARGS, toolCallId: 'tool-1', delta: '{}' } as BaseEvent)
    h.emit({ type: EventType.TOOL_CALL_END, toolCallId: 'tool-1' } as BaseEvent)
    h.finish()
    await running
    expect(h.binding.pendingToolCallIds.value).toEqual(['tool-1'])
    expect(h.binding.isAwaitingInput.value).toBe(true)
    expect(h.binding.messages.value.some(message => message.role === 'tool')).toBe(false)
    await expect(h.binding.run()).rejects.toThrow('tool results')
    expect(() => h.binding.send('Premature')).toThrow('tool results')
    expect(h.binding.pendingToolCallIds.value).toEqual(['tool-1'])
    h.binding.addToolResult('tool-1', '{"theme":"light"}')
    expect(h.binding.messages.value.at(-1)).toMatchObject({ role: 'tool', toolCallId: 'tool-1' })
    expect(h.binding.pendingToolCallIds.value).toEqual([])
    expect(() => h.binding.addToolResult('tool-1', '{}')).toThrow('not awaiting')
    h.scope.stop()
  })

  it('cancels the request, prevents overlapping sends and preserves partial output', async () => {
    const h = createHarness()
    const running = h.binding.send('First')
    await h.started
    h.start()
    h.emit({ type: EventType.TEXT_MESSAGE_START, messageId: 'reply', role: 'assistant' } as BaseEvent)
    h.emit({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: 'reply', delta: 'Partial' } as BaseEvent)
    await vi.waitFor(() => expect(h.binding.messages.value.at(-1)?.content).toBe('Partial'))
    expect(() => h.binding.send('Second')).toThrow('current AG-UI run')
    expect(h.agent.messages.filter(message => message.role === 'user')).toHaveLength(1)
    h.binding.cancel()
    expect(h.signal()?.aborted).toBe(true)
    await running
    expect(h.binding.status.value).toBe('cancelled')
    expect(h.binding.error.value).toBeUndefined()
    expect(h.binding.messages.value.at(-1)?.content).toBe('Partial')
    h.scope.stop()
  })

  it('surfaces protocol errors without an unhandled rejection', async () => {
    const h = createHarness()
    const running = h.binding.run()
    await h.started
    h.start()
    h.emit({ type: EventType.RUN_ERROR, message: 'Service unavailable' } as BaseEvent)
    h.close()
    await running
    expect(h.binding.status.value).toBe('error')
    expect(h.binding.error.value?.message).toContain('Service unavailable')
    expect(h.binding.isRunning.value).toBe(false)
    h.scope.stop()
  })

  it('retains interrupts and forwards explicit resume entries to the next run', async () => {
    const h = createHarness()
    const running = h.binding.run()
    await h.started
    h.start()
    h.emit({
      type: EventType.RUN_FINISHED,
      threadId: h.input().threadId,
      runId: h.input().runId,
      outcome: { type: 'interrupt', interrupts: [{ id: 'approval-1', reason: 'approval', message: 'Continue?' }] },
    } as BaseEvent)
    h.close()
    await running
    expect(h.binding.status.value).toBe('interrupted')
    expect(h.binding.interrupts.value).toEqual([{ id: 'approval-1', reason: 'approval', message: 'Continue?' }])
    expect(h.binding.isAwaitingInput.value).toBe(true)
    const resume = [{ interruptId: 'approval-1', status: 'resolved' as const, payload: true }]
    const resumed = h.binding.run({ resume })
    await vi.waitFor(() => expect(h.fetch).toHaveBeenCalledTimes(2))
    expect(h.input().resume).toEqual(resume)
    h.start()
    h.finish()
    await resumed
    expect(h.binding.status.value).toBe('success')
    expect(h.binding.interrupts.value).toEqual([])
    expect(h.binding.isAwaitingInput.value).toBe(false)
    h.scope.stop()
  })

  it('allows retry after a transport error and clears the previous error', async () => {
    const h = createHarness()
    h.fetch.mockRejectedValueOnce(new TypeError('Network unavailable'))
    await h.binding.send('Retry me')
    expect(h.binding.error.value?.message).toContain('Network unavailable')
    expect(h.binding.status.value).toBe('error')
    const retry = h.binding.run()
    await h.started
    expect(h.input().messages).toHaveLength(1)
    h.start()
    h.finish()
    await retry
    expect(h.binding.status.value).toBe('success')
    expect(h.binding.error.value).toBeUndefined()
    h.scope.stop()
  })

  it('aborts and unsubscribes on scope disposal and ignores late notifications', async () => {
    const h = createHarness()
    const running = h.binding.send('Cancel on unmount')
    await h.started
    h.start()
    h.scope.stop()
    expect(h.signal()?.aborted).toBe(true)
    expect(h.agent.subscribers).toHaveLength(0)
    const previous = h.binding.messages.value
    h.agent.setMessages([])
    await running
    expect(h.binding.messages.value).toEqual(previous)
    expect(() => h.binding.send('Late')).toThrow('disposed')
    h.binding.dispose()
  })
})
