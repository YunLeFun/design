export type PlaygroundMode = 'studio' | 'story'
export type PlaygroundView = 'document' | 'preview'

export interface PlaygroundScene {
  id: string
  name: string
  title: string
  body: string
  direction: string
  duration: number
  status: 'draft' | 'ready'
}

export interface PlaygroundProject {
  title: string
  subtitle: string
  scenes: PlaygroundScene[]
}
