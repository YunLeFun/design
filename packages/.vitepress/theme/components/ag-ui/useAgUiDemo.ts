import type { BaseEvent, RunAgentParameters } from '@ag-ui/client'
import type { DemoScenario, DemoState } from './demo-agent'
import { computed, onScopeDispose, readonly, shallowRef } from 'vue'
import { useAgUiAgent } from '../../../../vue/src/ag-ui'
import { createDemoAgent, demoTools } from './demo-agent'

export interface DemoEvent {
  id: number
  type: BaseEvent['type']
  payload: string
}

/** Session orchestration stays separate from the conversation, form and event views. */
export function useAgUiDemo(scenario: DemoScenario, english: boolean, delayMs = 65) {
  const agent = createDemoAgent(english, scenario, delayMs)
  const binding = useAgUiAgent<DemoState>(agent)
  const events = shallowRef<DemoEvent[]>([])
  const actionError = shallowRef<string>()
  const lastParameters = shallowRef<RunAgentParameters>()
  let eventId = 0
  let disposed = false
  const subscription = agent.subscribe({
    onEvent({ event }) {
      if (disposed)
        return
      events.value = [...events.value.slice(-79), { id: ++eventId, type: event.type, payload: JSON.stringify(event, null, 2) }]
    },
  })
  onScopeDispose(() => {
    disposed = true
    subscription.unsubscribe()
  })

  const disabled = computed(() => binding.isRunning.value || binding.isAwaitingInput.value)
  const canRetry = computed(() => !binding.isRunning.value
    && !binding.pendingToolCallIds.value.length
    && (binding.status.value === 'error' || binding.status.value === 'cancelled')
    && binding.interrupts.value.every(interrupt => lastParameters.value?.resume?.some(entry => entry.interruptId === interrupt.id)))
  const pendingTool = computed(() => {
    const id = binding.pendingToolCallIds.value[0]
    return binding.messages.value.flatMap(message => message.role === 'assistant' ? message.toolCalls ?? [] : []).find(tool => tool.id === id)
  })

  async function execute(parameters?: RunAgentParameters) {
    actionError.value = undefined
    lastParameters.value = parameters
    await binding.run(parameters)
  }

  async function submit(content: string) {
    if (!content.trim() || disabled.value)
      return
    actionError.value = undefined
    lastParameters.value = scenario === 'tool' ? { tools: demoTools } : undefined
    await binding.send(content, lastParameters.value)
  }

  async function confirmTool(approved: boolean) {
    const tool = pendingTool.value
    if (!tool || binding.isRunning.value)
      return
    // Handle only the declared read-only tool with its empty-object argument schema.
    let valid = false
    try {
      const args: unknown = JSON.parse(tool.function.arguments)
      valid = tool.function.name === 'read_theme' && args !== null && typeof args === 'object' && !Array.isArray(args) && Object.keys(args).length === 0
    }
    catch {}
    if (!valid) {
      actionError.value = english ? 'Unsupported tool or arguments. Reset the example to continue.' : '工具名称或参数不受支持，请重置示例。'
      return
    }
    const result = approved ? { approved, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' } : { approved }
    binding.addToolResult(tool.id, JSON.stringify(result))
    await execute({ tools: demoTools })
  }

  async function resume(approved: boolean) {
    const interrupt = binding.interrupts.value[0]
    if (!interrupt || binding.isRunning.value)
      return
    await execute({ resume: [{ interruptId: interrupt.id, status: approved ? 'resolved' : 'cancelled', payload: approved }] })
  }

  async function simulateFailure() {
    if (disabled.value)
      return
    // Fail the same request shape, so retry retains any resume response or tool result.
    const retryParameters = binding.interrupts.value.length
      ? lastParameters.value
      : scenario === 'tool' ? { tools: demoTools } : undefined
    await execute({ ...retryParameters, forwardedProps: { ...retryParameters?.forwardedProps, fail: true } })
    lastParameters.value = retryParameters
  }

  async function retry() {
    if (canRetry.value)
      await execute(lastParameters.value)
  }

  return {
    ...binding,
    events: readonly(events),
    actionError: readonly(actionError),
    disabled,
    canRetry,
    pendingTool,
    submit,
    confirmTool,
    resume,
    simulateFailure,
    retry,
  }
}
