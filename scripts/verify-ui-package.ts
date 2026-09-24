import { execFile } from 'node:child_process'
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')
const ui = resolve(root, 'packages/ui')
const consumer = await mkdtemp(resolve(tmpdir(), 'yunlefun-css-consumer-'))
const pkg = JSON.parse(await readFile(resolve(ui, 'package.json'), 'utf8'))
const archive = `${pkg.name.slice(1).replace('/', '-')}-${pkg.version}.tgz`

async function run(command: string, args: string[], cwd: string) {
  const result = await exec(command, args, { cwd, env: { ...process.env, CI: 'true' } })
  if (result.stdout)
    process.stdout.write(result.stdout)
  if (result.stderr)
    process.stderr.write(result.stderr)
}

try {
  await run('npm', ['pack', '--pack-destination', consumer], ui)
  await writeFile(resolve(consumer, 'package.json'), JSON.stringify({
    name: 'yunlefun-css-consumer',
    private: true,
    type: 'module',
    dependencies: { '@yunlefun/ui': `file:./${archive}` },
  }))
  await run('pnpm', ['install', '--offline', '--ignore-scripts'], consumer)
  const sassInstalled = await access(resolve(consumer, 'node_modules/sass')).then(() => true, () => false)
  if (sassInstalled)
    throw new Error('CSS-only consumers must not require Sass.')
  await writeFile(resolve(consumer, 'index.html'), '<main class="ylf-theme-dark ylf-pattern-grid" data-ylf-tone="pink">共享设计基础</main><script type="module" src="/main.js"></script>')
  await writeFile(resolve(consumer, 'main.js'), 'import \'@yunlefun/ui/css\'\nimport \'@yunlefun/ui/patterns.css\'\n')
  // 使用工作区的构建器，但依赖从独立消费项目的 node_modules 解析。
  await run(resolve(root, 'node_modules/.bin/vite'), ['build'], consumer)
  console.log('Packed CSS entries resolve and build without Sass in the consumer.')
}
finally {
  await rm(consumer, { recursive: true, force: true })
}
