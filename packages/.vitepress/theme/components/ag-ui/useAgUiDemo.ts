import type { BaseEvent, RunAgentParameters } from '@ag-ui/client'
import type { DemoScenario } from './demo-scenarios'
import type { DemoDraft, DemoState } from './demo-types'
import { computed, onScopeDispose, readonly, shallowRef, toRaw } from 'vue'
import { useAgUiAgent } from '../../../../vue/src/ag-ui'
import { createDemoAgent } from './demo-agent'
import { demoScenarios } from './demo-scenarios'
import { getDemoTools } from './demo-tools'

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

  const disabled = computed(() => binding.isRunning.value || binding.isAwaitingInput.value || binding.state.value.phase === 'awaiting_form')
  const canRetry = computed(() => !binding.isRunning.value
    && !binding.pendingToolCallIds.value.length
    && (binding.status.value === 'error' || binding.status.value === 'cancelled')
    && binding.interrupts.value.every(interrupt => lastParameters.value?.resume?.some(entry => entry.interruptId === interrupt.id)))
  const pendingTools = computed(() => binding.messages.value
    .flatMap(message => message.role === 'assistant' ? message.toolCalls ?? [] : [])
    .filter(tool => binding.pendingToolCallIds.value.includes(tool.id)))
  const pendingTool = computed(() => pendingTools.value[0])

  function toolParameters(): RunAgentParameters | undefined {
    const tools = getDemoTools(scenario)
    return tools.length ? { tools } : undefined
  }

  async function execute(parameters?: RunAgentParameters) {
    actionError.value = undefined
    lastParameters.value = parameters
    await binding.run(parameters)
  }

  async function submit(content: string) {
    if (!content.trim() || disabled.value)
      return
    actionError.value = undefined
    lastParameters.value = toolParameters()
    await binding.send(content, lastParameters.value)
  }

  async function confirmTool(approved: boolean, toolCallId = pendingTool.value?.id) {
    const tool = pendingTools.value.find(item => item.id === toolCallId)
    if (!tool || binding.isRunning.value)
      return
    // Handle only the declared read-only tool with its empty-object argument schema.
    let valid = false
    try {
      const args: unknown = JSON.parse(tool.function.arguments)
      valid = getDemoTools(scenario).some(item => item.name === tool.function.name)
        && args !== null && typeof args === 'object' && !Array.isArray(args) && Object.keys(args).length === 0
    }
    catch {}
    if (!valid) {
      actionError.value = english ? 'Unsupported tool or arguments. Reset the example to continue.' : '工具名称或参数不受支持，请重置示例。'
      return
    }
    const result = !approved
      ? { approved }
      : tool.function.name === 'read_theme'
        ? { approved, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' }
        : { approved, count: demoScenarios.length, examples: demoScenarios.map(item => item.id) }
    binding.addToolResult(tool.id, JSON.stringify(result))
    if (!binding.pendingToolCallIds.value.length)
      await execute(toolParameters())
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
    const retryParameters = binding.interrupts.value.length || (scenario === 'form' && binding.state.value.draftSubmitted)
      ? lastParameters.value
      : toolParameters()
    await execute({ ...retryParameters, forwardedProps: { ...retryParameters?.forwardedProps, fail: true } })
    lastParameters.value = retryParameters
  }

  async function retry() {
    if (canRetry.value)
      await execute(lastParameters.value)
  }

  function selectRecommendation(id: string) {
    if (scenario !== 'cards' || binding.isRunning.value || !binding.state.value.recommendations?.some(item => item.id === id))
      return
    binding.setState({ ...toRaw(binding.state.value), selectedRecommendation: id })
  }

  function updateDraft(draft: DemoDraft) {
    if (scenario !== 'form' || binding.isRunning.value || binding.state.value.draftSubmitted)
      return
    binding.setState({ ...toRaw(binding.state.value), draft: { ...draft } })
  }

  async function submitDraft() {
    const draft = binding.state.value.draft
    if (scenario !== 'form' || binding.isRunning.value || binding.state.value.phase !== 'awaiting_form')
      return
    if (!draft?.title.trim() || !draft.audience.trim() || !['friendly', 'formal'].includes(draft.tone)) {
      actionError.value = english ? 'Complete the title and audience before confirming.' : '请补全活动名称和参与对象后再确认。'
      return
    }
    await execute({ forwardedProps: { draftSubmitted: true } })
  }

  return {
    ...binding,
    events: readonly(events),
    actionError: readonly(actionError),
    disabled,
    canRetry,
    pendingTool,
    pendingTools,
    submit,
    confirmTool,
    resume,
    simulateFailure,
    retry,
    selectRecommendation,
    updateDraft,
    submitDraft,
  }
}
