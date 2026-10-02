export const demoScenarios = [
  {
    id: 'stream',
    label: ['流式对话', 'Streaming chat'],
    description: ['发送消息，观察分段回复和共享状态同步。', 'Send a message and watch text chunks and shared state arrive.'],
    prompt: ['展示流式回复的过程', 'Show me how streaming works'],
  },
  {
    id: 'tool',
    label: ['主题工具确认', 'Theme tool approval'],
    description: ['允许或拒绝读取亮暗主题，再回传工具结果。', 'Allow or decline reading the page theme, then return a tool result.'],
    prompt: ['请检查主题并给出配色建议', 'Inspect the theme and suggest a palette'],
  },
  {
    id: 'interrupt',
    label: ['中断与继续', 'Interrupt and resume'],
    description: ['运行暂停后，显式确认继续或取消。', 'When the run pauses, explicitly choose to continue or decline.'],
    prompt: ['请在继续之前暂停并征求确认', 'Pause and ask me before continuing'],
  },
  {
    id: 'plan',
    label: ['任务规划与进度', 'Task plan and progress'],
    description: ['观察步骤依次开始、完成，以及任务列表和进度条同步更新。', 'Watch steps start and finish as the task list and progress bar update.'],
    prompt: ['帮我规划一次小型创作活动', 'Plan a small creative workshop'],
  },
  {
    id: 'cards',
    label: ['结构化推荐卡片', 'Structured recommendation cards'],
    description: ['逐张生成配色推荐，选择喜欢的一组，将选择写回共享状态。', 'Generate palette cards, then select one to update the shared state.'],
    prompt: ['推荐三组适合云乐坊的配色', 'Recommend three palettes for YunLeFun'],
  },
  {
    id: 'form',
    label: ['表单补全与回传', 'Form fill and return'],
    description: ['自动填入活动草稿，修改字段，再确认回传并继续生成。', 'Fill a workshop draft, edit the fields, then confirm and continue.'],
    prompt: ['帮我拟一份周末创作活动草稿', 'Draft a weekend creative workshop'],
  },
  {
    id: 'multi-tool',
    label: ['多个工具协作', 'Multiple tool calls'],
    description: ['分别允许或拒绝两个工具，结果齐备后继续运行并汇总。', 'Allow or decline two tools independently, then continue with their results.'],
    prompt: ['检查页面主题和可用示例，给出汇总', 'Inspect the page theme and available examples, then summarize'],
  },
] as const

export type DemoScenario = typeof demoScenarios[number]['id']

export function getDemoScenario(scenario: DemoScenario, english: boolean) {
  const entry = demoScenarios.find(item => item.id === scenario)!
  const index = english ? 1 : 0
  return { value: entry.id, label: entry.label[index], description: entry.description[index], prompt: entry.prompt[index] }
}
