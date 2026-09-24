import { resolve } from 'node:path'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { postcssIsolateStyles } from 'vitepress'
import { groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { MarkdownTransform } from './.vitepress/plugins/markdownTransform'

export default defineConfig(async () => {
  return {
    css: {
      postcss: {
        plugins: [
          // Markdown 排版不应改变演示组件与 Portal 内部的标题、段落和按钮。
          postcssIsolateStyles({
            includeFiles: [/vp-doc\.css$/, /theme\/styles\/(index|fonts)\.css$/],
          }),
        ],
      },
    },
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [
          resolve(__dirname, '..'),
        ],
      },
    },
    plugins: [
      // custom
      MarkdownTransform(),

      // plugins
      Components({
        dirs: [
          resolve(__dirname, '.vitepress/theme/components'),
          resolve(__dirname, 'vue/components'),
        ],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: './.vitepress/components.d.ts',
        allowOverrides: true,
      }),

      UnoCSS(),

      groupIconVitePlugin({
        customIcon: {
          postcss: 'vscode-icons:file-type-postcss',
          playwright: 'vscode-icons:file-type-playwright',
          vitepress: 'simple-icons:vitepress',
          scss: 'vscode-icons:file-type-scss',
          typedoc: 'vscode-icons:file-type-typedoc',
        },
      }),
    ],
    resolve: {
      alias: {
        '@yunlefun/metadata': resolve(__dirname, 'metadata/index.ts'),
        '@yunlefun/ui/*': resolve(__dirname, 'ui/*'),
      },
      dedupe: [
        'vue',
        'vue-demi',
        '@vue/runtime-core',
      ],
    },
  }
})
