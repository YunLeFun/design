import type { AbstractAgent, Interrupt, Message, RunAgentParameters, RunAgentResult } from '@ag-ui/client'
import type { ComputedRef, DeepReadonly, Ref } from 'vue'
import { randomUUID, structuredClone_ } from '@ag-ui/client'
import { computed, getCurrentScope, onScopeDispose, readonly, shallowRef } from 'vue'

export type AgUiStatus = 'idle' | 'running' | 'success' | 'cancelled' | 'interrupted' | 'error'

export interface AgUiBinding<TState> {
  messages: Readonly<Ref<readonly DeepReadonly<Message>[]>>
  state: Readonly<Ref<DeepReadonly<TState>>>
  status: Readonly<Ref<AgUiStatus>>
  isRunning: Readonly<Ref<boolean>>
  error: Readonly<Ref<Error | undefined>>
  interrupts: Readonly<Ref<readonly DeepReadonly<Interrupt>[]>>
  pendingToolCallIds: Readonly<Ref<readonly string[]>>
  isAwaitingInput: ComputedRef<boolean>
  run: (parameters?: RunAgentParameters) => Promise<RunAgentResult | undefined>
  send: (content: string, parameters?: RunAgentParameters) => Promise<RunAgentResult | undefined>
  cancel: () => void
  setState: (value: TState) => void
  addToolResult: (toolCallId: string, content: string) => void
  dispose: () => void
}

/** One agent per owner. SDK events remain the source of truth; no transport runs on setup/SSR. */
export function useAgUiAgent<TState = Record<string, unknown>>(agent: AbstractAgent): AgUiBinding<TState> {
  const messages = shallowRef<Message[]>(structuredClone_(agent.messages))
  const state = shallowRef<TState>(structuredClone_(agent.state))
  const status = shallowRef<AgUiStatus>('idle')
  const isRunning = shallowRef(false)
  const error = shallowRef<Error>()
  const interrupts = shallowRef<Interrupt[]>(structuredClone_(agent.pendingInterrupts))
  const pendingToolCallIds = shallowRef<string[]>([])
  let disposed = false
  let cancelRequested = false

  function sync() {
    if (disposed)
      return
    messages.value = structuredClone_(agent.messages)
    state.value = structuredClone_(agent.state)
    interrupts.value = structuredClone_(agent.pendingInterrupts)
  }

  const subscription = agent.subscribe({
    onMessagesChanged: sync,
    onStateChanged: sync,
    onRunFinishedEvent(result) {
      if (disposed || cancelRequested)
        return
      status.value = result.outcome === 'interrupt' ? 'interrupted' : result.outcome === 'cancelled' ? 'cancelled' : 'success'
      pendingToolCallIds.value = result.outcome === 'success' ? [...result.pendingToolCallIds] : []
    },
    onRunErrorEvent({ event }) {
      if (disposed || cancelRequested)
        return
      error.value = new Error(event.message)
      status.value = 'error'
    },
  })

  function assertAvailable() {
    if (disposed)
      throw new Error('This AG-UI binding has been disposed.')
    if (isRunning.value || agent.isRunning)
      throw new Error('Wait for the current AG-UI run to finish before starting another.')
  }

  function assertReadyToRun() {
    assertAvailable()
    if (pendingToolCallIds.value.length)
      throw new Error('Provide the pending tool results before starting another AG-UI run.')
  }

  /** Failed requests resolve undefined; inspect error/status. Invalid concurrent use throws. */
  async function run(parameters?: RunAgentParameters): Promise<RunAgentResult | undefined> {
    assertReadyToRun()
    cancelRequested = false
    error.value = undefined
    status.value = 'running'
    isRunning.value = true
    try {
      const result = await agent.runAgent(parameters)
      if (!disposed && !cancelRequested && status.value === 'running')
        status.value = 'success'
      return result
    }
    catch (cause) {
      if (!disposed && !cancelRequested) {
        error.value = cause instanceof Error ? cause : new Error(String(cause))
        status.value = 'error'
      }
    }
    finally {
      if (!disposed) {
        if (cancelRequested)
          status.value = 'cancelled'
        isRunning.value = false
        sync()
      }
    }
  }

  function send(content: string, parameters?: RunAgentParameters) {
    assertReadyToRun()
    if (!content.trim())
      return Promise.resolve(undefined)
    agent.addMessage({ id: randomUUID(), role: 'user', content })
    sync()
    return run(parameters)
  }

  function cancel() {
    if (disposed || !isRunning.value)
      return
    cancelRequested = true
    agent.abortRun()
  }

  function setState(value: TState) {
    assertAvailable()
    agent.setState(structuredClone_(value))
    sync()
  }

  /** The host validates/executes tools, then explicitly supplies a result. Nothing auto-executes. */
  function addToolResult(toolCallId: string, content: string) {
    assertAvailable()
    if (!pendingToolCallIds.value.includes(toolCallId))
      throw new Error('The tool call is not awaiting a result.')
    agent.addMessage({ id: randomUUID(), role: 'tool', toolCallId, content })
    pendingToolCallIds.value = pendingToolCallIds.value.filter(id => id !== toolCallId)
    sync()
  }

  function dispose() {
    if (disposed)
      return
    cancel()
    disposed = true
    subscription.unsubscribe()
    isRunning.value = false
    if (cancelRequested)
      status.value = 'cancelled'
  }

  if (getCurrentScope())
    onScopeDispose(dispose)

  return {
    messages: readonly(messages),
    state: readonly(state),
    status: readonly(status),
    isRunning: readonly(isRunning),
    error: readonly(error),
    interrupts: readonly(interrupts),
    pendingToolCallIds: readonly(pendingToolCallIds),
    isAwaitingInput: computed(() => !isRunning.value && (interrupts.value.length > 0 || pendingToolCallIds.value.length > 0)),
    run,
    send,
    cancel,
    setState,
    addToolResult,
    dispose,
  }
}
