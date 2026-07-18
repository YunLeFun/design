import type { AddressInfo } from 'node:net'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const shadcnVue = resolve(root, `node_modules/.bin/shadcn-vue${process.platform === 'win32' ? '.cmd' : ''}`)

async function run(command: string, args: string[], cwd: string) {
  const { stderr, stdout } = await exec(command, args, {
    cwd,
    env: {
      ...process.env,
      CI: 'true',
    },
  })

  if (stdout)
    process.stdout.write(stdout)
  if (stderr)
    process.stderr.write(stderr)
}

await run(pnpm, ['registry:build'], root)

const registryPayload = await readFile(resolve(root, 'packages/public/r/ylf-button.json'))
const consumer = await mkdtemp(resolve(tmpdir(), 'yunlefun-registry-'))
const server = createServer((request, response) => {
  if (request.url !== '/r/ylf-button.json') {
    response.writeHead(404).end()
    return
  }

  response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
  response.end(registryPayload)
})

try {
  await mkdir(resolve(consumer, 'src'), { recursive: true })
  await Promise.all([
    writeFile(resolve(consumer, 'package.json'), `${JSON.stringify({
      name: 'yunlefun-registry-consumer',
      private: true,
      version: '0.0.0',
      type: 'module',
      packageManager: 'pnpm@9.15.0',
      scripts: {
        build: 'vue-tsc --noEmit && vite build',
      },
      dependencies: {
        vue: '^3.5.13',
      },
      devDependencies: {
        '@vitejs/plugin-vue': '^5.2.1',
        'typescript': '5.7.2',
        'vite': '^6.0.3',
        'vue-tsc': '^2.2.12',
      },
    }, null, 2)}\n`),
    writeFile(resolve(consumer, 'index.html'), '<div id="app"></div><script type="module" src="/src/main.ts"></script>\n'),
    writeFile(resolve(consumer, 'tsconfig.json'), `${JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        jsx: 'preserve',
        skipLibCheck: true,
        types: ['vite/client'],
      },
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }, null, 2)}\n`),
    writeFile(resolve(consumer, 'vite.config.ts'), `import vue from '@vitejs/plugin-vue'\nimport { defineConfig } from 'vite'\n\nexport default defineConfig({ plugins: [vue()] })\n`),
    writeFile(resolve(consumer, 'src/main.ts'), `import { createApp } from 'vue'\nimport YlfButton from './components/ui/YlfButton.vue'\nimport './styles/ylf-tokens.scss'\n\nconst App = { components: { YlfButton }, template: '<YlfButton variant="aurora">开始创作</YlfButton>' }\ncreateApp(App).mount('#app')\n`),
  ])

  await new Promise<void>(resolveListening => server.listen(0, '127.0.0.1', resolveListening))
  const { port } = server.address() as AddressInfo

  await run(shadcnVue, ['add', `http://127.0.0.1:${port}/r/ylf-button.json`, '--yes'], consumer)
  await run(pnpm, ['build'], consumer)

  const [installedButton, installedTokens, canonicalButton, canonicalTokens] = await Promise.all([
    readFile(resolve(consumer, 'src/components/ui/YlfButton.vue'), 'utf8'),
    readFile(resolve(consumer, 'src/styles/ylf-tokens.scss'), 'utf8'),
    readFile(resolve(root, 'packages/vue/components/YlfButton.vue'), 'utf8'),
    readFile(resolve(root, 'packages/ui/styles/css-vars.scss'), 'utf8'),
  ])

  if (installedButton !== canonicalButton || installedTokens !== canonicalTokens)
    throw new Error('Registry install output differs from the canonical YunLeFun sources.')

  console.log('Registry URL install and consumer production build passed.')
}
finally {
  await new Promise<void>(resolveClosed => server.close(() => resolveClosed()))
  await rm(consumer, { force: true, recursive: true })
}
