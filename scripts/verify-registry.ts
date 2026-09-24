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
const publicRegistryBaseUrl = 'https://ui.yunle.fun/r'
const legacyRemoteRegistryUrl = process.env.YLF_REGISTRY_URL
const remoteRegistryBaseUrl = process.env.YLF_REGISTRY_BASE_URL
  ?? (legacyRemoteRegistryUrl
    ? new URL('.', legacyRemoteRegistryUrl).toString().replace(/\/$/, '')
    : undefined)

const registryFiles = {
  'ylf-button': 'ylf-button.json',
  'ylf-dialog': 'ylf-dialog.json',
  'ylf-tokens': 'ylf-tokens.json',
} as const

type RegistryItemName = keyof typeof registryFiles

interface ConsumerDefinition {
  item: Exclude<RegistryItemName, 'ylf-tokens'>
  componentFile: 'YlfButton.vue' | 'YlfDialog.vue'
  canonicalComponent: string
  mainSource: string
}

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

const payloadEntries = await Promise.all(
  Object.values(registryFiles).map(async file => [
    `/r/${file}`,
    await readFile(resolve(root, 'packages/public/r', file), 'utf8'),
  ] as const),
)
const registryPayloads = new Map(payloadEntries)
let localRegistryBaseUrl: string | undefined

const server = remoteRegistryBaseUrl
  ? undefined
  : createServer((request, response) => {
      const requestPath = request.url?.split('?')[0]
      const payload = requestPath ? registryPayloads.get(requestPath) : undefined

      if (!payload || !localRegistryBaseUrl) {
        response.writeHead(404).end()
        return
      }

      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
      response.end(payload.replaceAll(publicRegistryBaseUrl, localRegistryBaseUrl))
    })

const canonicalTokens = await readFile(resolve(root, 'packages/ui/styles/css-vars.scss'), 'utf8')
const consumers: ConsumerDefinition[] = [
  {
    item: 'ylf-button',
    componentFile: 'YlfButton.vue',
    canonicalComponent: await readFile(resolve(root, 'packages/vue/components/YlfButton.vue'), 'utf8'),
    mainSource: `import { createApp, h } from 'vue'
import YlfButton from './components/ui/YlfButton.vue'
import './styles/ylf-tokens.scss'

const App = { render: () => h(YlfButton, { variant: 'accent', tone: 'coral' }, () => '开始创作') }
createApp(App).mount('#app')
`,
  },
  {
    item: 'ylf-dialog',
    componentFile: 'YlfDialog.vue',
    canonicalComponent: await readFile(resolve(root, 'packages/vue/components/YlfDialog.vue'), 'utf8'),
    mainSource: `import { createApp, h } from 'vue'
import YlfDialog from './components/ui/YlfDialog.vue'
import './styles/ylf-tokens.scss'

const App = { render: () => h(YlfDialog, { open: true, title: '确认发布' }, () => 'Registry 验证') }
createApp(App).mount('#app')
`,
  },
]

try {
  if (server) {
    await new Promise<void>(resolveListening => server.listen(0, '127.0.0.1', resolveListening))
    const { port } = server.address() as AddressInfo
    localRegistryBaseUrl = `http://127.0.0.1:${port}/r`
  }

  const registryBaseUrl = remoteRegistryBaseUrl ?? localRegistryBaseUrl
  if (!registryBaseUrl)
    throw new Error('Registry base URL could not be resolved.')

  for (const definition of consumers) {
    const consumer = await mkdtemp(resolve(tmpdir(), `yunlefun-${definition.item}-`))

    try {
      await mkdir(resolve(consumer, 'src'), { recursive: true })
      await Promise.all([
        writeFile(resolve(consumer, 'package.json'), `${JSON.stringify({
          name: `yunlefun-${definition.item}-consumer`,
          private: true,
          version: '0.0.0',
          type: 'module',
          packageManager: 'pnpm@11.14.0',
          scripts: {
            build: 'vue-tsc --noEmit && vite build',
          },
          dependencies: {
            vue: '^3.5.40',
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^6.0.8',
            'typescript': '5.9.3',
            'vite': '^8.1.5',
            'vue-tsc': '^3.3.7',
          },
        }, null, 2)}\n`),
        writeFile(resolve(consumer, 'index.html'), '<div id="app"></div><script type="module" src="/src/main.ts"></script>\n'),
        writeFile(resolve(consumer, 'pnpm-workspace.yaml'), `allowBuilds:
  '@parcel/watcher': true
  esbuild: true
  vue-demi: true
`),
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
        writeFile(resolve(consumer, 'vite.config.ts'), `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [vue()] })
`),
        writeFile(resolve(consumer, 'src/main.ts'), definition.mainSource),
      ])

      await run(shadcnVue, ['add', `${registryBaseUrl}/${registryFiles[definition.item]}`, '--yes'], consumer)
      await run(pnpm, ['build'], consumer)

      const [installedComponent, installedTokens] = await Promise.all([
        readFile(resolve(consumer, 'src/components/ui', definition.componentFile), 'utf8'),
        readFile(resolve(consumer, 'src/styles/ylf-tokens.scss'), 'utf8'),
      ])

      if (installedComponent !== definition.canonicalComponent || installedTokens !== canonicalTokens)
        throw new Error(`${definition.item} install output differs from the canonical YunLeFun sources.`)

      console.log(`${definition.item} URL install and consumer production build passed.`)
    }
    finally {
      await rm(consumer, { force: true, recursive: true })
    }
  }
}
finally {
  if (server)
    await new Promise<void>(resolveClosed => server.close(() => resolveClosed()))
}
