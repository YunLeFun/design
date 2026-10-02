import type { Event, RunAgentInput, RunFinishedOutcome } from '@ag-ui/client'
import { EventType, HttpAgent, randomUUID } from '@ag-ui/client'

export type DemoScenario = 'stream' | 'tool' | 'interrupt'

export interface DemoState {
  phase: 'idle' | 'streaming' | 'awaiting_confirmation' | 'awaiting_input' | 'done' | 'declined'
  scenario: DemoScenario
  theme?: 'light' | 'dark'
}

export const demoTools = [{
  name: 'read_theme',
  description: 'Read the current page theme after confirmation',
  parameters: { type: 'object', properties: {}, additionalProperties: false },
}]

function createEvents(input: RunAgentInput, english: boolean, scenario: DemoScenario): Event[] {
  const id = randomUUID()
  const events: Event[] = [{ type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId }]
  if (input.forwardedProps?.fail) {
    events.push({ type: EventType.RUN_ERROR, message: english ? 'Demo service failed. Retry this run to continue.' : '模拟服务失败，可以重试本次运行。' })
    return events
  }

  // A stopped continuation may already have appended a partial assistant message.
  // Look for the current request's result rather than assuming it is the last message.
  const lastUserIndex = input.messages.findLastIndex(message => message.role === 'user')
  const toolMessage = input.messages.slice(lastUserIndex + 1).findLast(message => message.role === 'tool')
  const toolResult = toolMessage ? JSON.parse(String(toolMessage.content)) : undefined
  const resumed = input.resume?.[0]
  const approved = toolResult?.approved === true
  const continued = resumed?.status === 'resolved' && resumed.payload === true
  let reply: string
  let phase: DemoState['phase'] = 'done'
  let outcome: RunFinishedOutcome = { type: 'success' }

  if (scenario === 'stream') {
    reply = english
      ? 'This local example streams a reply in small chunks. Messages and shared state update through the real AG-UI client. Try stopping midway, then retrying the same request.'
      : '这是本地示例回复，文字会分段到达。消息与共享状态由真实的 AG-UI 客户端同步。你可以在接收中停止，再重试同一条请求。'
  }
  else if (scenario === 'interrupt') {
    if (resumed) {
      reply = continued
        ? english ? 'Confirmation received. The paused run has continued with your explicit resume response.' : '已收到确认，暂停的流程已根据你的 resume 回复继续完成。'
        : english ? 'Continuation declined. The paused request has been closed.' : '已取消继续，暂停的请求已结束。'
      phase = continued ? 'done' : 'declined'
    }
    else {
      reply = english ? 'The next step needs your confirmation. This run will pause until you choose to continue or decline.' : '下一步需要你的确认。本次运行会暂停，等待你选择继续或取消。'
      phase = 'awaiting_input'
      outcome = {
        type: 'interrupt',
        interrupts: [{
          id: `approval-${id}`,
          reason: 'approval',
          message: english ? 'Continue the paused example?' : '继续这个暂停的示例吗？',
          responseSchema: { type: 'boolean' },
        }],
      }
    }
  }
  else if (toolResult) {
    reply = approved
      ? english ? 'Theme context received. Use the shared brand color for actions and neutral surfaces for the workspace. Keep product icons in their original palette.' : '已收到主题信息。建议主操作使用共享品牌色，工作区使用中性表面；产品图标保留原始配色。'
      : english ? 'Theme access declined. No page information was read.' : '已拒绝读取主题，没有获取页面信息。'
    phase = approved ? 'done' : 'declined'
  }
  else {
    reply = english ? 'I can suggest a palette using this page’s theme. Confirm the read-only theme request below to continue.' : '我可以根据当前页面主题给出配色建议。请确认下方的主题读取请求，再继续生成。'
    phase = 'awaiting_confirmation'
  }

  const snapshot: DemoState = { phase: 'streaming', scenario }
  if (approved)
    snapshot.theme = toolResult.theme
  events.push(
    { type: EventType.STATE_SNAPSHOT, snapshot },
    { type: EventType.TEXT_MESSAGE_START, messageId: id, role: 'assistant' },
  )
  for (const delta of reply.match(/.{1,5}/gu) ?? [])
    events.push({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: id, delta })
  events.push({ type: EventType.TEXT_MESSAGE_END, messageId: id })
  if (scenario === 'tool' && !toolResult) {
    events.push(
      { type: EventType.TOOL_CALL_START, toolCallId: `theme-${id}`, toolCallName: 'read_theme', parentMessageId: id },
      { type: EventType.TOOL_CALL_ARGS, toolCallId: `theme-${id}`, delta: '{}' },
      { type: EventType.TOOL_CALL_END, toolCallId: `theme-${id}` },
    )
  }
  events.push(
    { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/phase', value: phase }] },
    { type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId, outcome },
  )
  return events
}

/** Local SSE fixture: exercises the real client parser without a model, credentials or network. */
export function createDemoAgent(english: boolean, scenario: DemoScenario = 'tool', delayMs = 65) {
  return new HttpAgent({
    url: '/__local-ag-ui-demo',
    threadId: randomUUID(),
    initialState: { phase: 'idle', scenario } satisfies DemoState,
    fetch: async (_url, init) => {
      const events = createEvents(JSON.parse(String(init.body)), english, scenario)
      let timer: ReturnType<typeof setTimeout> | undefined
      let cleanup = () => {}
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          let index = 0
          const abort = () => {
            cleanup()
            controller.error(new DOMException('Aborted', 'AbortError'))
          }
          cleanup = () => {
            clearTimeout(timer)
            init.signal?.removeEventListener('abort', abort)
          }
          if (init.signal?.aborted) {
            abort()
            return
          }
          init.signal?.addEventListener('abort', abort, { once: true })
          const encoder = new TextEncoder()
          const next = () => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(events[index++])}\n\n`))
            if (index < events.length) {
              timer = setTimeout(next, delayMs)
            }
            else {
              cleanup()
              controller.close()
            }
          }
          timer = setTimeout(next, delayMs)
        },
        cancel: () => cleanup(),
      })
      return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
    },
  })
}
