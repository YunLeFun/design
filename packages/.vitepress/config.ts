import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { metadata } from '../metadata/metadata'

export const defaultSideBar: DefaultTheme.Sidebar = [
  {
    text: '设计语言',
    items: [
      { text: 'Design 与 UI', link: '/guide/design-system' },
      { text: '视觉基础', link: '/guide/foundations' },
      { text: '色彩与组件', link: '/guide/colors' },
      { text: '品牌与界面', link: '/guide/patterns' },
      { text: '字体规范', link: '/guide/typography' },
    ],
  },
  {
    text: '开发与接入',
    items: [
      { text: '开始使用', link: '/guide/' },
      { text: '子包职责', link: '/guide/packages' },
      { text: '组件架构', link: '/guide/architecture' },
      { text: '公共使用与发布', link: '/guide/adoption' },
      { text: 'Registry 分发', link: '/guide/registry' },
      { text: '应用迁移', link: '/guide/migration' },
    ],
  },
  {
    text: '样式与实验',
    items: [
      { text: '样式示例', link: '/css/' },
      { text: 'Pulse 动效', link: '/css/pulse/' },
      { text: '实验工具', link: '/utils/' },
      { text: '元素预览', link: '/utils/previewElement/' },
    ],
  },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'YunLeFun Design',
  description: '云乐坊设计系统：统一的设计规范、品牌视觉、设计变量与可复用 UI 组件。',
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
    outline: { label: '本页内容', level: [2, 3] },
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到晴空模式',
    darkModeSwitchTitle: '切换到夜空模式',
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最近更新' },
    editLink: {
      pattern: 'https://github.com/YunLeFun/design/edit/main/packages/:path',
      text: '在 GitHub 编辑此页',
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            displayDetails: '显示详细内容',
            resetButtonTitle: '清空搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有找到相关内容',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
          },
        },
      },
    },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '设计体系', link: '/guide/design-system' },
      { text: '开始使用', link: '/guide/' },
      { text: 'Vue 组件', link: '/vue/' },
    ],

    sidebar: {
      '/guide/': defaultSideBar,
      '/vue/': getVueComponentsSidebar(),
      '/': defaultSideBar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunLeFun/design' },
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
    text: 'Vue 组件',
    collapsed: false,
    items: components.map(i => ({
      text: i.title + (i.title_zh ? ` - ${i.title_zh}` : ''),
      link: `/vue/components/${i.name}/`,
    })),
  })

  return links
}
