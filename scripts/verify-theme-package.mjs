import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const directory = await mkdtemp(resolve(tmpdir(), 'yunlefun-vitepress-theme-'))
const tarball = resolve(directory, 'theme.tgz')
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit' })

try {
  run('pnpm', ['-C', 'packages/vitepress-theme-yunlefun', 'pack', '--out', tarball])
  const manifest = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }))
  assert.equal(manifest.name, 'vitepress-theme-yunlefun')
  assert.equal(manifest.dependencies['@yunlefun/ui'].includes('workspace:'), false)
  const files = execFileSync('tar', ['-tf', tarball], { encoding: 'utf8' })
  for (const file of ['index.mjs', 'index.d.ts', 'components/Layout.vue', 'components/YunlefunLogo.vue', 'brand-assets.mjs', 'styles/style.css', 'styles/workbench.css', 'dist/config.mjs', 'dist/config.d.mts', 'dist/appearance.mjs'])
    assert.ok(files.includes(`package/${file}`), `Missing package file: ${file}`)

  for (const version of ['1.6.4', '2.0.0-alpha.17', '2.0.0-alpha.19']) {
    const cwd = resolve(directory, version)
    await mkdir(resolve(cwd, 'docs/.vitepress/theme'), { recursive: true })
    await writeFile(resolve(cwd, 'package.json'), JSON.stringify({
      private: true,
      type: 'module',
      dependencies: { 'vitepress-theme-yunlefun': `file:${tarball}`, 'vitepress': version, 'vue': '3.5.41' },
    }))
    await writeFile(resolve(cwd, 'docs/.vitepress/config.mts'), `
import { withYunlefun, yunlefunMarkdown } from 'vitepress-theme-yunlefun/config'
export default withYunlefun({ themeConfig: { brand: { icon: 'design-mark' } }, markdown: { config: md => md.use(yunlefunMarkdown) } })
`)
    await writeFile(resolve(cwd, 'docs/.vitepress/theme/index.mts'), `
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'
import 'vitepress-theme-yunlefun/workbench.css'
export default Theme
`)
    await writeFile(resolve(cwd, 'docs/index.md'), '# Theme\n\n<div class="ylf-workbench"><div class="ylf-workbench-panel ylf-workbench-grid">Workbench</div></div>\n\n| Name | State |\n| --- | --- |\n| Theme | Ready |\n\n::: tip\nNative Markdown\n:::\n')
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], cwd)
    run(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'build', 'docs'], cwd)
    const html = await readFile(resolve(cwd, 'docs/.vitepress/dist/index.html'), 'utf8')
    assert.ok(html.includes('data-icon="ylf:design-mark"'), `Missing canonical brand on VitePress ${version}`)
    assert.ok(html.includes('ylf-doc-table'), `Missing table region on VitePress ${version}`)
    assert.ok(html.includes('aria-label="Theme"'), `Missing heading label on VitePress ${version}`)
    console.log(`Theme tarball verified on VitePress ${version}`)
  }
}
finally {
  await rm(directory, { recursive: true, force: true })
}
