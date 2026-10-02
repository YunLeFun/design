import type { DemoScenario } from './demo-scenarios'

export interface DemoTask {
  id: string
  title: string
  status: 'queued' | 'running' | 'done'
}

export interface DemoRecommendation {
  id: string
  title: string
  description: string
  tone: 'blue' | 'green' | 'sun'
  colors: readonly string[]
}

export interface DemoDraft {
  title: string
  audience: string
  tone: 'friendly' | 'formal'
}

export interface DemoToolResult {
  name: 'read_theme' | 'list_examples'
  approved: boolean
  theme?: 'light' | 'dark'
  count?: number
  examples?: readonly string[]
}

export interface DemoState {
  phase: 'idle' | 'streaming' | 'awaiting_confirmation' | 'awaiting_input' | 'awaiting_form' | 'done' | 'declined'
  scenario: DemoScenario
  theme?: 'light' | 'dark'
  tasks?: readonly DemoTask[]
  progress?: number
  recommendations?: readonly DemoRecommendation[]
  selectedRecommendation?: string
  draft?: DemoDraft
  draftSubmitted?: boolean
  toolResults?: readonly DemoToolResult[]
}
