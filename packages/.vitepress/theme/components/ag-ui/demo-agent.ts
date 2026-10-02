import type { BaseEvent, RunAgentInput } from '@ag-ui/client'
import { EventType, HttpAgent, randomUUID } from '@ag-ui/client'

/** Local SSE fixture: exercises the real client parser without a model, credentials or network. */
export function createDemoAgent(english: boolean) {
  return new HttpAgent({
    url: '/__local-ag-ui-demo',
    threadId: 'yunlefun-demo',
    initialState: { phase: 'idle' },
    fetch: async (_url, init) => {
      const input: RunAgentInput = JSON.parse(String(init.body))
      const id = randomUUID()
      const events: (BaseEvent & Record<string, unknown>)[] = [
        { type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId },
      ]
      if (input.forwardedProps?.fail) {
        events.push({ type: EventType.RUN_ERROR, message: english ? 'Demo connection failed. Try sending again.' : '模拟连接失败，可以重新发送。' })
      }
      else {
        const last = input.messages.at(-1)
        const approved = last?.role === 'tool' && JSON.parse(String(last.content)).approved === true
        const hasResult = last?.role === 'tool'
        const reply = hasResult
          ? approved
            ? english ? 'Theme context received. Use the shared brand color for actions and neutral surfaces for the workspace. Keep product icons in their original palette.' : '已收到主题信息。建议主操作使用共享品牌色，工作区使用中性表面；产品图标保留原始配色。'
            : english ? 'Theme access declined. No page information was read.' : '已拒绝读取主题，没有获取页面信息。'
          : english ? 'I can suggest a palette using this page’s theme. Confirm the read-only theme request below to continue.' : '我可以根据当前页面主题给出配色建议。请确认下方的主题读取请求，再继续生成。'
        events.push(
          { type: EventType.STATE_SNAPSHOT, snapshot: { phase: 'streaming', request: 'theme_advice' } },
          { type: EventType.TEXT_MESSAGE_START, messageId: id, role: 'assistant' },
        )
        for (const delta of reply.match(/.{1,5}/gu) ?? [])
          events.push({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: id, delta })
        events.push({ type: EventType.TEXT_MESSAGE_END, messageId: id })
        if (!hasResult) {
          events.push(
            { type: EventType.TOOL_CALL_START, toolCallId: `theme-${id}`, toolCallName: 'read_theme', parentMessageId: id },
            { type: EventType.TOOL_CALL_ARGS, toolCallId: `theme-${id}`, delta: '{}' },
            { type: EventType.TOOL_CALL_END, toolCallId: `theme-${id}` },
          )
        }
        events.push(
          { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/phase', value: hasResult ? 'done' : 'awaiting_confirmation' }] },
          { type: EventType.RUN_FINISHED, threadId: input.threadId, runId: input.runId },
        )
      }
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
          const next = () => {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(events[index++])}\n\n`))
            if (index < events.length) {
              timer = setTimeout(next, 65)
            }
            else {
              cleanup()
              controller.close()
            }
          }
          timer = setTimeout(next, 65)
        },
        cancel: () => cleanup(),
      })
      return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
    },
  })
}
