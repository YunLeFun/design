import { execFile } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')
const consumer = await mkdtemp(resolve(tmpdir(), 'yunlefun-vue-consumer-'))

async function run(command: string, args: string[], cwd: string) {
  const { stdout, stderr } = await exec(command, args, { cwd, env: { ...process.env, CI: 'true' } })
  if (stdout)
    process.stdout.write(stdout)
  if (stderr)
    process.stderr.write(stderr)
}

try {
  const dependencies: Record<string, string> = { vue: '3.5.41', sass: '1.101.0' }
  for (const directory of ['packages/ui', 'packages/vue']) {
    const cwd = resolve(root, directory)
    const pkg = JSON.parse(await readFile(resolve(cwd, 'package.json'), 'utf8'))
    const archive = `${pkg.name.slice(1).replace('/', '-')}-${pkg.version}.tgz`
    await run('npm', ['pack', '--pack-destination', consumer], cwd)
    dependencies[pkg.name] = `file:./${archive}`
  }

  await writeFile(resolve(consumer, 'package.json'), JSON.stringify({
    name: 'yunlefun-vue-consumer',
    private: true,
    type: 'module',
    dependencies,
    devDependencies: {
      '@vitejs/plugin-vue': '6.0.8',
      'typescript': '5.9.3',
      'vite': '8.1.5',
      'vue-tsc': '3.3.7',
    },
  }))
  await run('pnpm', ['install', '--ignore-scripts'], consumer)

  const names = (await readdir(resolve(root, 'packages/vue/components')))
    .filter(name => /^Ylf.*\.vue$/.test(name))
    .map(name => name.slice(0, -4))
    .sort()
  const imports = names.map(name => `import ${name} from '@yunlefun/vue/components/${name}.vue'`).join('\n')
  await Promise.all([
    writeFile(resolve(consumer, 'index.html'), '<div id="app"></div><script type="module" src="/main.ts"></script>'),
    writeFile(resolve(consumer, 'main.ts'), `import { createApp } from 'vue'
import type { YlfAccentTone } from '@yunlefun/vue'
import App from './App.vue'
import '@yunlefun/ui/css'
${imports}

const tone: YlfAccentTone = 'blue'
const app = createApp(App, { tone })
const components = { ${names.join(', ')} }
for (const [name, component] of Object.entries(components))
  app.component(name, component)
app.mount('#app')
`),
    writeFile(resolve(consumer, 'App.vue'), `<script setup lang="ts">
import { shallowRef } from 'vue'
import YlfSelect from '@yunlefun/vue/components/YlfSelect.vue'
import YlfSegmentedControl from '@yunlefun/vue/components/YlfSegmentedControl.vue'
import YlfSlider from '@yunlefun/vue/components/YlfSlider.vue'
const color = shallowRef<'blue' | 'sun'>('blue')
const volume = shallowRef([50])
const options = [{ value: 'blue', label: '晴空蓝' }, { value: 'sun', label: '明黄' }] as const
</script>
<template>
  <form>
    <YlfSelect v-model="color" :options="options" name="color" required aria-label="主题颜色" />
    <YlfSegmentedControl v-model="color" :options="options" label="主题颜色" />
    <YlfSlider v-model="volume" label="音量" />
  </form>
</template>
`),
    writeFile(resolve(consumer, 'vite.config.ts'), `import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
export default defineConfig({ plugins: [vue()] })
`),
    writeFile(resolve(consumer, 'tsconfig.json'), JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        skipLibCheck: true,
        types: ['vite/client'],
      },
      include: ['*.ts', '*.vue'],
    })),
  ])
  await run(resolve(consumer, 'node_modules/.bin/vue-tsc'), ['--noEmit'], consumer)
  await run(resolve(consumer, 'node_modules/.bin/vite'), ['build'], consumer)
  await run(process.execPath, ['--input-type=module', '-e', `
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
assert.throws(() => require.resolve('@ag-ui/client'), { code: 'MODULE_NOT_FOUND' })
`], consumer)
  await run('pnpm', ['add', '@ag-ui/client@1.0.1', '--ignore-scripts'], consumer)
  await writeFile(resolve(consumer, 'App.vue'), `<script setup lang="ts">
import { HttpAgent } from '@ag-ui/client'
import { useAgUiAgent } from '@yunlefun/vue/ag-ui'
const { state, status, messages, send, cancel } = useAgUiAgent<{ phase?: string }>(new HttpAgent({ url: '/api/agent' }))
</script>
<template>
  <p>{{ status }} {{ state.phase }} {{ messages.length }}</p>
  <button @click="send('Hello')">Send</button>
  <button @click="cancel">Stop</button>
</template>
`)
  await run(resolve(consumer, 'node_modules/.bin/vue-tsc'), ['--noEmit'], consumer)
  await run(resolve(consumer, 'node_modules/.bin/vite'), ['build'], consumer)
  await run(process.execPath, ['--input-type=module', '-e', `
import assert from 'node:assert/strict'
import { HttpAgent } from '@ag-ui/client'
import { useAgUiAgent } from '@yunlefun/vue/ag-ui'
const binding = useAgUiAgent(new HttpAgent({ url: 'http://127.0.0.1:1/must-not-connect' }))
assert.equal(binding.status.value, 'idle')
binding.dispose()
`], consumer)
  console.log('Optional AG-UI subpath typechecks, builds and imports on the server without connecting.')
  console.log(`All ${names.length} packed Vue components resolve, typecheck and build in an independent consumer.`)
}
finally {
  await rm(consumer, { recursive: true, force: true })
}
