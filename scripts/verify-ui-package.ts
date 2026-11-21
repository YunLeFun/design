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
  await writeFile(resolve(consumer, 'index.html'), '<main class="ylf-theme-dark ylf-pattern-grid" data-ylf-tone="pink" data-ylf-profile="admin">共享设计基础</main><script type="module" src="/main.js"></script>')
  await writeFile(resolve(consumer, 'main.js'), [
    'import \'@yunlefun/ui/css\'',
    'import \'@yunlefun/ui/tokens.css\'',
    'import \'@yunlefun/ui/compat.css\'',
    'import \'@yunlefun/ui/patterns.css\'',
    'import \'@yunlefun/ui/fonts.css\'',
    'import \'@yunlefun/ui/admin.css\'',
    'import \'@yunlefun/ui/editor.css\'',
    'import \'@yunlefun/ui/adapters/shadcn.css\'',
    'import \'@yunlefun/ui/adapters/nuxt-ui.css\'',
    'import \'@yunlefun/ui/adapters/tdesign.css\'',
    'import { ylfTokens, ylfPalette, ylfAccentTones } from \'@yunlefun/ui/tokens\'',
    'import { presetYunlefun } from \'@yunlefun/ui/unocss\'',
    'import tokensJson from \'@yunlefun/ui/tokens.json\'',
    'if (!ylfTokens.light[\'--ylf-c-brand\'] || ylfPalette.blue !== \'#2563eb\' || !ylfAccentTones.includes(\'blue\')) throw new Error(\'Invalid @yunlefun/ui/tokens export\')',
    'if (!presetYunlefun().theme?.colors || !tokensJson.palette?.blue?.$value) throw new Error(\'Invalid @yunlefun/ui/unocss or tokens.json export\')',
  ].join('\n'))
  // 使用工作区的构建器，但依赖从独立消费项目的 node_modules 解析。
  await run(resolve(root, 'node_modules/.bin/vite'), ['build'], consumer)
  await run(process.execPath, ['--input-type=module', '-e', `
import assert from 'node:assert/strict'
import { ylfTokens, ylfTokenNames } from '@yunlefun/ui/tokens'
import { presetYunlefun } from '@yunlefun/ui/unocss'
import tokensJson from '@yunlefun/ui/tokens.json' with { type: 'json' }
assert.equal(ylfTokens.palette.blue, '#2563eb')
assert.ok(ylfTokenNames.includes('--ylf-z-modal'))
assert.equal(presetYunlefun().name, 'unocss-preset-yunlefun')
assert.equal(tokensJson.palette.blue.$value, '#2563eb')
`], consumer)
  console.log('Packed CSS, adapters, tokens, DTCG JSON and UnoCSS preset resolve and build without Sass in the consumer.')
}
finally {
  await rm(consumer, { recursive: true, force: true })
}
