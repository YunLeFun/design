import type { PackageIndexes } from './types'
import _metadata from './index.json'

export const metadata = _metadata as PackageIndexes
export const components = metadata.components as PackageIndexes['components']

export const componentNames = components.map(f => f.name)

export function getComponent(name: string) {
  return components.find(f => f.name === name)
}
