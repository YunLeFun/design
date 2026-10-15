import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { parse, parseAllDocuments } from 'yaml'

const root = resolve(import.meta.dirname, '..')
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const localFixes = {
  'GHSA-vfj7-8cjw-p6xm': 'braces@3.0.3',
  'GHSA-86w9-cpqp-85rv': 'node-forge@1.4.0',
  'GHSA-hp3w-g68c-fv3c': 'sprintf-js@1.0.3',
}

// Never suppress an advisory unless the installed fix passes its exploit regression.
execFileSync(pnpm, ['exec', 'vitest', 'run', 'test/dependency-security.test.ts'], { cwd: root, stdio: 'inherit' })

const result = spawnSync(pnpm, ['audit', '--json', '--audit-level', 'low'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
})
if (result.error)
  throw result.error
assert.ok(result.status === 0 || result.status === 1, result.stderr || 'Audit process failed')
const report = JSON.parse(result.stdout)
assert.ok(report.metadata?.vulnerabilities && report.advisories, 'Registry did not return a complete audit report')

const workspace = parse(readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8'))
const lockfile = parseAllDocuments(readFileSync(resolve(root, 'pnpm-lock.yaml'), 'utf8'))
  .map(document => document.toJS())
  .find(document => document.patchedDependencies && document.snapshots)
assert.ok(lockfile, 'Dependency lockfile is missing')
let failures = 0
let patched = 0

for (const advisory of Object.values(report.advisories)) {
  const id = advisory.url.split('/').at(-1)
  const selector = localFixes[id]
  if (!selector) {
    console.error(`${advisory.severity}: ${advisory.module_name}: ${advisory.title} (${advisory.url})`)
    failures++
    continue
  }

  const version = selector.slice(selector.lastIndexOf('@') + 1)
  assert.equal(`${advisory.module_name}@${version}`, selector, `${id}: advisory package changed`)
  assert.ok(advisory.findings.length > 0, `${id}: missing affected dependency paths`)
  assert.ok(advisory.findings.every(finding => finding.version === version), `${id}: unpatched package version detected`)
  const patchPath = workspace.patchedDependencies?.[selector]
  assert.ok(patchPath, `${id}: local patch is not configured`)
  const hash = createHash('sha256').update(readFileSync(resolve(root, patchPath))).digest('hex')
  assert.equal(lockfile.patchedDependencies?.[selector], hash, `${id}: patch does not match the lockfile`)
  const snapshots = Object.keys(lockfile.snapshots).filter(key => key === selector || key.startsWith(`${selector}(`))
  assert.ok(snapshots.length > 0, `${id}: patched dependency is absent from the lockfile`)
  assert.ok(snapshots.every(key => key.includes(`(patch_hash=${hash})`)), `${id}: dependency path bypasses the patch`)
  console.log(`${id}: ${selector} fixed locally; patch hash, dependency paths and exploit regression verified`)
  patched++
}

if (failures > 0)
  throw new Error(`${failures} unmitigated security advisories`)
assert.ok(result.status === 0 || patched > 0, 'Audit failed without a verified local fix')
console.log(`Audit passed: no unmitigated advisories; ${patched} upstream advisories addressed by verified local patches.`)
