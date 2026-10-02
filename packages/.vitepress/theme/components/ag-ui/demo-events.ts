import type { Event, RunAgentInput, RunFinishedOutcome } from '@ag-ui/client'
import type { DemoScenario } from './demo-scenarios'
import type { DemoRecommendation, DemoState, DemoTask, DemoToolResult } from './demo-types'
import { EventType, randomUUID } from '@ag-ui/client'
import { getDemoTools } from './demo-tools'

interface Context {
  events: Event[]
  input: RunAgentInput
  english: boolean
  scenario: DemoScenario
  messageId: string
}

function snapshot(ctx: Context, state: Partial<DemoState> = {}) {
  ctx.events.push({ type: EventType.STATE_SNAPSHOT, snapshot: { phase: 'streaming', scenario: ctx.scenario, ...state } })
}

function reply(ctx: Context, content: string) {
  ctx.events.push({ type: EventType.TEXT_MESSAGE_START, messageId: ctx.messageId, role: 'assistant' })
  for (const delta of content.match(/.{1,5}/gu) ?? [])
    ctx.events.push({ type: EventType.TEXT_MESSAGE_CONTENT, messageId: ctx.messageId, delta })
  ctx.events.push({ type: EventType.TEXT_MESSAGE_END, messageId: ctx.messageId })
}

function finish(ctx: Context, phase: DemoState['phase'] = 'done', outcome: RunFinishedOutcome = { type: 'success' }) {
  ctx.events.push(
    { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/phase', value: phase }] },
    { type: EventType.RUN_FINISHED, threadId: ctx.input.threadId, runId: ctx.input.runId, outcome },
  )
}

function createStream(ctx: Context) {
  snapshot(ctx)
  reply(ctx, ctx.english
    ? 'This local example streams a reply in small chunks. Messages and shared state update through the real AG-UI client. Try stopping midway, then retrying the same request.'
    : '这是本地示例回复，文字会分段到达。消息与共享状态由真实的 AG-UI 客户端同步。你可以在接收中停止，再重试同一条请求。')
  finish(ctx)
}

function currentToolResults(input: RunAgentInput): DemoToolResult[] {
  // A stopped continuation may already have appended a partial assistant message.
  const lastUserIndex = input.messages.findLastIndex(message => message.role === 'user')
  const current = input.messages.slice(lastUserIndex + 1)
  const calls = current.flatMap(message => message.role === 'assistant' ? message.toolCalls ?? [] : [])
  return current.filter(message => message.role === 'tool').flatMap((message) => {
    const name = calls.find(call => call.id === message.toolCallId)?.function.name
    if (name !== 'read_theme' && name !== 'list_examples')
      return []
    return [{ ...JSON.parse(String(message.content)), name }]
  })
}

function createTools(ctx: Context) {
  const results = currentToolResults(ctx.input)
  const themeResult = results.find(result => result.name === 'read_theme')
  const hasResults = results.length === getDemoTools(ctx.scenario).length
  const state: Partial<DemoState> = {}
  if (themeResult?.approved)
    state.theme = themeResult.theme
  if (ctx.scenario === 'multi-tool' && results.length)
    state.toolResults = results
  snapshot(ctx, state)

  if (hasResults) {
    if (ctx.scenario === 'multi-tool') {
      const approved = results.filter(result => result.approved).length
      reply(ctx, ctx.english
        ? `Both tool requests are answered. ${approved} approved and ${results.length - approved} declined. The results below reflect only the approved reads.`
        : `两个工具请求均已答复：允许 ${approved} 个，拒绝 ${results.length - approved} 个。下方仅展示获准读取的信息。`)
      finish(ctx, approved ? 'done' : 'declined')
    }
    else {
      reply(ctx, themeResult?.approved
        ? ctx.english ? 'Theme context received. Use the shared brand color for actions and neutral surfaces for the workspace. Keep product icons in their original palette.' : '已收到主题信息。建议主操作使用共享品牌色，工作区使用中性表面；产品图标保留原始配色。'
        : ctx.english ? 'Theme access declined. No page information was read.' : '已拒绝读取主题，没有获取页面信息。')
      finish(ctx, themeResult?.approved ? 'done' : 'declined')
    }
    return
  }

  reply(ctx, ctx.scenario === 'multi-tool'
    ? ctx.english ? 'Two independent tools are ready: reading the page theme and listing local examples. Answer each request; the run continues after both results are returned.' : '准备调用两个独立工具：读取页面主题、列出本地示例。请分别答复；两个结果齐备后再继续。'
    : ctx.english ? 'I can suggest a palette using this page’s theme. Confirm the read-only theme request below to continue.' : '我可以根据当前页面主题给出配色建议。请确认下方的主题读取请求，再继续生成。')
  for (const tool of getDemoTools(ctx.scenario).filter(tool => !results.some(result => result.name === tool.name))) {
    const toolCallId = `${tool.name}-${ctx.messageId}`
    ctx.events.push(
      { type: EventType.TOOL_CALL_START, toolCallId, toolCallName: tool.name, parentMessageId: ctx.messageId },
      { type: EventType.TOOL_CALL_ARGS, toolCallId, delta: '{' },
      { type: EventType.TOOL_CALL_ARGS, toolCallId, delta: '}' },
      { type: EventType.TOOL_CALL_END, toolCallId },
    )
  }
  finish(ctx, 'awaiting_confirmation')
}

function createInterrupt(ctx: Context) {
  snapshot(ctx)
  const resumed = ctx.input.resume?.[0]
  if (resumed) {
    const approved = resumed.status === 'resolved' && resumed.payload === true
    reply(ctx, approved
      ? ctx.english ? 'Confirmation received. The paused run has continued with your explicit resume response.' : '已收到确认，暂停的流程已根据你的 resume 回复继续完成。'
      : ctx.english ? 'Continuation declined. The paused request has been closed.' : '已取消继续，暂停的请求已结束。')
    finish(ctx, approved ? 'done' : 'declined')
    return
  }
  reply(ctx, ctx.english ? 'The next step needs your confirmation. This run will pause until you choose to continue or decline.' : '下一步需要你的确认。本次运行会暂停，等待你选择继续或取消。')
  finish(ctx, 'awaiting_input', {
    type: 'interrupt',
    interrupts: [{
      id: `approval-${ctx.messageId}`,
      reason: 'approval',
      message: ctx.english ? 'Continue the paused example?' : '继续这个暂停的示例吗？',
      responseSchema: { type: 'boolean' },
    }],
  })
}

function createPlan(ctx: Context) {
  const titles = ctx.english ? ['Define the workshop goal', 'Prepare the materials', 'Arrange the schedule'] : ['确定活动目标', '准备创作材料', '安排活动流程']
  const tasks: DemoTask[] = titles.map((title, index) => ({ id: `task-${index + 1}`, title, status: 'queued' }))
  snapshot(ctx, { tasks, progress: 0 })
  for (const [index, task] of tasks.entries()) {
    ctx.events.push(
      { type: EventType.STEP_STARTED, stepName: task.title },
      { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: `/tasks/${index}/status`, value: 'running' }] },
      { type: EventType.STATE_DELTA, delta: [
        { op: 'replace', path: `/tasks/${index}/status`, value: 'done' },
        { op: 'replace', path: '/progress', value: Math.round((index + 1) / tasks.length * 100) },
      ] },
      { type: EventType.STEP_FINISHED, stepName: task.title },
    )
  }
  reply(ctx, ctx.english ? 'The three planning steps are complete. Each step event updated the task list and progress bar below.' : '三个规划步骤已完成。每个步骤事件都同步更新了下方的任务列表和进度条。')
  finish(ctx)
}

function createCards(ctx: Context) {
  const recommendations: DemoRecommendation[] = [
    { id: 'sky', title: ctx.english ? 'Clear sky' : '晴空蓝', description: ctx.english ? 'Clear actions and light surfaces.' : '清晰的主操作，搭配轻盈表面。', tone: 'blue', colors: ['#2563eb', '#93c5fd', '#eff6ff'] },
    { id: 'mint', title: ctx.english ? 'Fresh mint' : '薄荷绿', description: ctx.english ? 'A relaxed palette for creative spaces.' : '适合创作空间的轻松配色。', tone: 'green', colors: ['#16a34a', '#86efac', '#f0fdf4'] },
    { id: 'sun', title: ctx.english ? 'Warm sunshine' : '暖阳黄', description: ctx.english ? 'Bright accents for featured moments.' : '为精选内容带来明亮点缀。', tone: 'sun', colors: ['#ca8a04', '#fde047', '#fefce8'] },
  ]
  snapshot(ctx, { recommendations: [], selectedRecommendation: ctx.input.state?.selectedRecommendation ?? '' })
  for (const recommendation of recommendations)
    ctx.events.push({ type: EventType.STATE_DELTA, delta: [{ op: 'add', path: '/recommendations/-', value: recommendation }] })
  reply(ctx, ctx.english ? 'Three structured palettes are ready. Choose a card below; your choice is written back to the shared state.' : '三组结构化配色已生成。请选择下方卡片，你的选择会写回共享状态。')
  finish(ctx)
}

function createForm(ctx: Context) {
  if (ctx.input.forwardedProps?.draftSubmitted) {
    const draft = ctx.input.state?.draft
    snapshot(ctx, { draft, draftSubmitted: true })
    reply(ctx, ctx.english
      ? `Draft confirmed: ${draft.title}. Audience: ${draft.audience}. Tone: ${draft.tone === 'formal' ? 'formal' : 'friendly'}. Your edited fields were included in this request.`
      : `已确认草稿：${draft.title}。面向${draft.audience}，采用${draft.tone === 'formal' ? '正式' : '亲切'}语气。本次请求已携带你修改后的字段。`)
    finish(ctx)
    return
  }
  snapshot(ctx, { draft: { title: '', audience: '', tone: 'friendly' }, draftSubmitted: false })
  ctx.events.push(
    { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/draft/title', value: ctx.english ? 'YunLeFun weekend workshop' : '云乐坊周末创作活动' }] },
    { type: EventType.STATE_DELTA, delta: [{ op: 'replace', path: '/draft/audience', value: ctx.english ? 'First-time creators' : '第一次参加的创作者' }] },
  )
  reply(ctx, ctx.english ? 'The draft form is filled. Edit any field, then confirm to send your changes back and continue.' : '活动草稿已填入表单。可以修改任意字段，确认后将修改回传，再继续生成。')
  finish(ctx, 'awaiting_form')
}

/** Scripted application scenarios produce valid events for the real SDK parser. */
export function createDemoEvents(input: RunAgentInput, english: boolean, scenario: DemoScenario): Event[] {
  const events: Event[] = [{ type: EventType.RUN_STARTED, threadId: input.threadId, runId: input.runId }]
  if (input.forwardedProps?.fail) {
    events.push({ type: EventType.RUN_ERROR, message: english ? 'Demo service failed. Retry this run to continue.' : '模拟服务失败，可以重试本次运行。' })
    return events
  }
  const ctx: Context = { events, input, english, scenario, messageId: randomUUID() }
  if (scenario === 'stream')
    createStream(ctx)
  else if (scenario === 'tool' || scenario === 'multi-tool')
    createTools(ctx)
  else if (scenario === 'interrupt')
    createInterrupt(ctx)
  else if (scenario === 'plan')
    createPlan(ctx)
  else if (scenario === 'cards')
    createCards(ctx)
  else
    createForm(ctx)
  return events
}
