import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const directory = await mkdtemp(resolve(tmpdir(), 'yunlefun-vitepress-theme-'))
const tarball = resolve(directory, 'theme.tgz')
const uiTarball = resolve(directory, 'ui.tgz')
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit' })

try {
  run('pnpm', ['-C', 'packages/vitepress-theme-yunlefun', 'pack', '--out', tarball])
  const manifest = JSON.parse(execFileSync('tar', ['-xOf', tarball, 'package/package.json'], { encoding: 'utf8' }))
  assert.equal(manifest.name, 'vitepress-theme-yunlefun')
  assert.equal(manifest.dependencies['@yunlefun/ui'].includes('workspace:'), false)
  // Verify against the tokens this checkout ships; a bumped @yunlefun/ui may not be on npm yet.
  run('pnpm', ['-C', 'packages/ui', 'pack', '--out', uiTarball])
  const files = execFileSync('tar', ['-tf', tarball], { encoding: 'utf8' })
  for (const file of ['index.mjs', 'index.d.ts', 'components/Layout.vue', 'components/YunlefunLogo.vue', 'components/NavigationIndicator.vue', 'brand-assets.mjs', 'styles/style.css', 'styles/workbench.css', 'dist/config.mjs', 'dist/config.d.mts', 'dist/appearance.mjs', 'dist/navigation.mjs'])
    assert.ok(files.includes(`package/${file}`), `Missing package file: ${file}`)

  for (const version of ['1.6.4', '2.0.0-alpha.17', '2.0.0-alpha.19']) {
    const cwd = resolve(directory, version)
    const mermaid = version === '1.6.4'
    await mkdir(resolve(cwd, 'docs/.vitepress/theme'), { recursive: true })
    await writeFile(resolve(cwd, 'package.json'), JSON.stringify({
      private: true,
      type: 'module',
      dependencies: {
        'vitepress-theme-yunlefun': `file:${tarball}`,
        'vitepress': version,
        'vue': '3.5.44',
        // Personal sites compose the theme with Mermaid; cover that on the stable line.
        ...(mermaid && { 'mermaid': '11.16.1', 'vitepress-plugin-mermaid': '2.0.17' }),
      },
      overrides: { '@yunlefun/ui': `file:${uiTarball}` },
    }))
    await writeFile(resolve(cwd, 'docs/.vitepress/config.mts'), mermaid
      ? `
import { withMermaid } from 'vitepress-plugin-mermaid'
import { withYunlefun, yunlefunMarkdown } from 'vitepress-theme-yunlefun/config'
const site = { body: '<circle cx="12" cy="12" r="10" fill="currentColor"/>', width: 24, height: 24 }
export default withMermaid(withYunlefun({ themeConfig: { brand: { icon: site, hero: true } }, markdown: { config: md => md.use(yunlefunMarkdown) } }))
`
      : `
import { withYunlefun, yunlefunMarkdown } from 'vitepress-theme-yunlefun/config'
export default withYunlefun({ themeConfig: { brand: { icon: 'design-mark' } }, markdown: { config: md => md.use(yunlefunMarkdown) } })
`)
    await writeFile(resolve(cwd, 'docs/.vitepress/theme/index.mts'), `
import Theme from 'vitepress-theme-yunlefun'
import 'vitepress-theme-yunlefun/style.css'
import 'vitepress-theme-yunlefun/workbench.css'
export default Theme
`)
    await writeFile(resolve(cwd, 'docs/index.md'), `# Theme\n\n<div class="ylf-workbench"><div class="ylf-workbench-panel ylf-workbench-grid">Workbench</div></div>\n\n| Name | State |\n| --- | --- |\n| Theme | Ready |\n\n::: tip\nNative Markdown\n:::\n${mermaid ? '\n```mermaid\nflowchart LR\n  A --> B\n```\n' : ''}`)
    run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], cwd)
    run(process.execPath, ['node_modules/vitepress/bin/vitepress.js', 'build', 'docs'], cwd)
    const html = await readFile(resolve(cwd, 'docs/.vitepress/dist/index.html'), 'utf8')
    assert.ok(html.includes(mermaid ? 'data-icon="site"' : 'data-icon="ylf:design-mark"'), `Missing brand mark on VitePress ${version}`)
    if (mermaid)
      assert.ok(html.includes('<div class="mermaid">'), `Missing Mermaid component on VitePress ${version}`)
    assert.ok(html.includes('ylf-doc-table'), `Missing table region on VitePress ${version}`)
    assert.ok(html.includes('aria-label="Theme"'), `Missing heading label on VitePress ${version}`)
    // The dev optimizer must not pre-bundle the theme: a bundled copy carries its own VitePress and `useData()` throws.
    await writeFile(resolve(cwd, 'dev-check.mjs'), `
import process from 'node:process'
import { createServer } from 'vitepress'
const server = await createServer('docs')
await server.listen()
const { code } = await server.transformRequest('/@fs' + process.cwd() + '/docs/.vitepress/theme/index.mts')
console.log(code.match(/^import Theme from "([^"]+)"/m)?.[1] ?? '')
process.exit(0)
`)
    const themeImport = execFileSync(process.execPath, ['dev-check.mjs'], { cwd, encoding: 'utf8' }).trim().split('\n').at(-1)
    assert.match(themeImport, /\/node_modules\/vitepress-theme-yunlefun\/index\.mjs/, `Dev server pre-bundles the theme on VitePress ${version}: ${themeImport}`)
    console.log(`Theme tarball verified on VitePress ${version}`)
  }
}
finally {
  await rm(directory, { recursive: true, force: true })
}
