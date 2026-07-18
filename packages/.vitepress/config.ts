import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { metadata } from '../metadata/metadata'

export const defaultSideBar: DefaultTheme.Sidebar = [
  { text: 'Get Started', link: '/guide/' },
  { text: 'Architecture', link: '/guide/architecture' },
  { text: 'Registry Pilot', link: '/guide/registry' },
  { text: 'Typography', link: '/guide/typography' },
  {
    text: 'CSS',
    items: [
      { text: 'pulse', link: '/css/pulse/' },
    ],
  },
  {
    text: 'Utils',
    items: [
      { text: 'previewElement', link: '/utils/previewElement/' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@YunLeFun/UI',
  description: '云乐坊 · 缤纷多彩 —— 以「云」与极光光谱为灵魂的 UI 组件库',
  lastUpdated: true,

  // 圆体展示字（仅 display 角色）：拉丁 Baloo 2 + 中文 ZCOOL KuaiLe 站酷快乐体。
  // 详见 /guide/typography 与 @yunlefun/ui/styles/css-vars.scss。
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // 拉丁圆体 Baloo 2（仅展示常用字重）
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap' }],
    // 中文圆体 ZCOOL KuaiLe — 品牌字「云乐坊」文本子集（首屏即刻，体积极小）
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&text=%E4%BA%91%E4%B9%90%E5%9D%8A&display=swap' }],
    // 中文圆体 ZCOOL KuaiLe — 完整字族（Google Fonts 自动按 unicode-range 分片，只下用到的字形）
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap' }],
  ],

  themeConfig: {
    editLink: {
      pattern: 'https://github.com/YunLeFun/ui/edit/main/packages/:path',
    },

    search: {
      provider: 'local',
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Vue', link: '/vue/' },
    ],

    sidebar: {
      '/guide/': defaultSideBar,
      '/vue/': getVueComponentsSidebar(),
      '/': defaultSideBar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunLeFun/ui' },
      { icon: 'twitter', link: 'https://twitter.com/YunLeFun' },
    ],

  },

  markdown: {
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },
})

function getVueComponentsSidebar() {
  const links: DefaultTheme.Sidebar = [{
    text: 'Vue',
    link: '/vue/',
  }]

  const components = metadata.components.filter(i => i.name)

  links.push({
    text: 'Vue Components',
    collapsed: false,
    items: components.map(i => ({
      text: i.title + (i.title_zh ? ` - ${i.title_zh}` : ''),
      link: `/vue/components/${i.name}/`,
    })),
  })

  return links
}
