import type { DemoScenario } from './demo-scenarios'
import type { DemoState } from './demo-types'
import { EventType, HttpAgent, randomUUID } from '@ag-ui/client'
import { createDemoEvents } from './demo-events'

export type { DemoScenario } from './demo-scenarios'
export type { DemoState } from './demo-types'

/** Local SSE fixture: exercises the real client parser without a model, credentials or network. */
export function createDemoAgent(english: boolean, scenario: DemoScenario = 'tool', delayMs = 65) {
  return new HttpAgent({
    url: '/__local-ag-ui-demo',
    threadId: randomUUID(),
    initialState: { phase: 'idle', scenario } satisfies DemoState,
    fetch: async (_url, init) => {
      const events = createDemoEvents(JSON.parse(String(init.body)), english, scenario)
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
            const event = events[index++]!
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
            if (index < events.length) {
              const isActiveTask = event.type === EventType.STATE_DELTA && event.delta.some(patch => patch.op === 'replace' && patch.path.endsWith('/status') && patch.value === 'running')
              timer = setTimeout(next, isActiveTask ? delayMs * 6 : delayMs)
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
