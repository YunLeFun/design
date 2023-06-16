import { dirname, resolve } from 'node:path'

import { fileURLToPath } from 'node:url'

// other exports
export * from './types'

// shim
export const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

export const runtimeDir = resolve(_dirname, './runtime')
export const componentsDir = resolve(_dirname, './runtime/components')
