import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const packages = ['packages/ui', 'packages/vue', 'packages/vitepress-theme-yunlefun']

function publishedVersions(name) {
  try {
    const versions = JSON.parse(execFileSync('npm', ['view', name, 'versions', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }))
    return Array.isArray(versions) ? versions : [versions]
  }
  catch (error) {
    // A package that has never been published answers E404.
    if (String(error.stdout).includes('E404'))
      return []
    throw error
  }
}

for (const directory of packages) {
  const cwd = resolve(root, directory)
  const manifest = readFileSync(resolve(cwd, 'package.json'), 'utf8')
  const { name, version } = JSON.parse(manifest)

  if (publishedVersions(name).includes(version)) {
    console.log(`${name}@${version} is already published`)
    continue
  }

  if (!manifest.includes('"workspace:')) {
    execFileSync('npm', ['publish', '--access', 'public'], { cwd, stdio: 'inherit' })
    continue
  }

  // npm publish keeps workspace: ranges; pnpm pack rewrites them, then npm uploads the tarball through OIDC.
  const outDir = mkdtempSync(resolve(tmpdir(), 'yunlefun-publish-'))
  try {
    const tarball = resolve(outDir, 'package.tgz')
    execFileSync('pnpm', ['pack', '--out', tarball], { cwd, stdio: 'inherit' })
    execFileSync('npm', ['publish', tarball, '--access', 'public'], { cwd, stdio: 'inherit' })
  }
  finally {
    rmSync(outDir, { recursive: true, force: true })
  }
}
