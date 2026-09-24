import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

for (const directory of ['packages/ui', 'packages/vue']) {
  const cwd = resolve(root, directory)
  const { name, version } = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'))
  const published = JSON.parse(execFileSync('npm', ['view', name, 'versions', '--json'], { encoding: 'utf8' }))

  if (published.includes(version)) {
    console.log(`${name}@${version} is already published`)
    continue
  }

  execFileSync('npm', ['publish', '--access', 'public'], { cwd, stdio: 'inherit' })
}
