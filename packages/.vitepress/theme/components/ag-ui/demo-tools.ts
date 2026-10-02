import type { DemoScenario } from './demo-scenarios'

export const demoTools = [{
  name: 'read_theme',
  description: 'Read the current page theme after confirmation',
  parameters: { type: 'object', properties: {}, additionalProperties: false },
}, {
  name: 'list_examples',
  description: 'Read the local example catalog after confirmation',
  parameters: { type: 'object', properties: {}, additionalProperties: false },
}]

export function getDemoTools(scenario: DemoScenario) {
  return scenario === 'multi-tool' ? demoTools : scenario === 'tool' ? demoTools.slice(0, 1) : []
}

export function getDemoToolLabel(name: string, english: boolean) {
  if (name === 'read_theme')
    return english ? 'Read the page theme' : '读取页面亮暗主题'
  if (name === 'list_examples')
    return english ? 'Read the example catalog' : '读取示例目录'
  return name
}
