import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'

import { withYunlefun } from 'vitepress-theme-yunlefun/config'
import { metadata } from '../metadata/metadata'
import { markdownTables } from './plugins/markdownTables'

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
    text: 'Admin · 后台管理',
    items: [
      { text: '后台设计规范', link: '/guide/admin' },
    ],
  },
  {
    text: 'Editor · 复杂操作界面',
    items: [
      { text: '编辑器设计规范', link: '/guide/editor' },
    ],
  },
  {
    text: '开发与接入',
    items: [
      { text: '开始使用', link: '/guide/' },
      { text: 'VitePress 主题', link: '/guide/vitepress-theme' },
      { text: 'AG-UI 接入', link: '/guide/ag-ui' },
      { text: '子包职责', link: '/guide/packages' },
      { text: '组件架构', link: '/guide/architecture' },
      { text: '组件验收', link: '/guide/component-acceptance' },
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

const englishLabels: Record<string, string> = {
  '设计语言': 'Design language',
  'Design 与 UI': 'Design and UI',
  '视觉基础': 'Visual foundations',
  '色彩与组件': 'Colors and components',
  '品牌与界面': 'Brand and interfaces',
  '字体规范': 'Typography',
  'Admin · 后台管理': 'Admin interfaces',
  '后台设计规范': 'Admin design guidelines',
  'Editor · 复杂操作界面': 'Editor interfaces',
  '编辑器设计规范': 'Editor design guidelines',
  '开发与接入': 'Development and adoption',
  '开始使用': 'Get started',
  'VitePress 主题': 'VitePress theme',
  'AG-UI 接入': 'AG-UI integration',
  '子包职责': 'Package responsibilities',
  '组件架构': 'Component architecture',
  '组件验收': 'Component acceptance',
  '公共使用与发布': 'Public use and releases',
  'Registry 分发': 'Registry distribution',
  '应用迁移': 'Application migration',
  '样式与实验': 'Styles and experiments',
  '样式示例': 'Style examples',
  'Pulse 动效': 'Pulse animation',
  '实验工具': 'Experimental utilities',
  '元素预览': 'Element preview',
}

const englishSidebar: DefaultTheme.Sidebar = defaultSideBar.map(section => ({
  ...section,
  text: englishLabels[section.text!],
  items: section.items?.map(item => ({
    ...item,
    text: englishLabels[item.text!],
    link: `/en${item.link}`,
  })),
}))

// https://vitepress.dev/reference/site-config
export default defineConfig(withYunlefun({
  lang: 'zh-Hans',
  title: '云乐坊设计系统',
  description: '云乐坊设计系统：统一的设计规范、品牌视觉、设计变量与可复用 UI 组件。',
  lastUpdated: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-Hans',
      themeConfig: { siteTitle: '云乐坊设计' },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'YunLeFun Design',
      description: 'YunLeFun Design: shared design principles, brand visuals, tokens and reusable UI components.',
      themeConfig: {
        siteTitle: 'YunLeFun Design',
        langMenuLabel: 'Change language',
        skipToContentLabel: 'Skip to content',
        outline: { label: 'On this page', level: [2, 3] },
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to daylight',
        darkModeSwitchTitle: 'Switch to night sky',
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated' },
        editLink: {
          pattern: 'https://github.com/YunLeFun/design/edit/main/packages/:path',
          text: 'Edit this page on GitHub',
        },
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Design system', link: '/en/guide/design-system' },
          { text: 'Get started', link: '/en/guide/' },
          { text: 'Vue components', link: '/en/vue/' },
          { text: 'AG-UI examples', link: '/en/guide/ag-ui' },
          { text: 'Icons', link: 'https://icons.yunle.fun/' },
        ],
        sidebar: {
          '/en/guide/': englishSidebar,
          '/en/vue/': getVueComponentsSidebar(true),
          '/en/': englishSidebar,
        },
      },
    },
  },

  // 圆体展示字（仅 display 角色）：拉丁 Baloo 2 + 中文 ZCOOL KuaiLe 站酷快乐体。
  // 详见 /guide/typography 与 @yunlefun/ui/styles/css-vars.scss。
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'icon', href: '/favicon-32.png', sizes: '32x32' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
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
    brand: { icon: 'design-mark' },
    langMenuLabel: '切换语言',
    skipToContentLabel: '跳至内容',
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
        locales: {
          en: {
            translations: {
              button: { buttonText: 'Search docs', buttonAriaLabel: 'Search docs' },
              modal: {
                displayDetails: 'Display detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results found',
                footer: { selectText: 'Select', navigateText: 'Navigate', closeText: 'Close' },
              },
            },
          },
        },
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
      { text: 'AG-UI 示例', link: '/guide/ag-ui' },
      { text: '图标库', link: 'https://icons.yunle.fun/' },
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
      md.use(markdownTables)
    },
  },
}))

function getVueComponentsSidebar(english = false) {
  const prefix = english ? '/en' : ''
  const links: DefaultTheme.Sidebar = [{
    text: 'Vue',
    link: `${prefix}/vue/`,
  }, {
    text: english ? 'AG-UI examples' : 'AG-UI 示例',
    link: `${prefix}/guide/ag-ui`,
  }]

  const components = metadata.components.filter(i => i.name)

  links.push({
    text: english ? 'Vue components' : 'Vue 组件',
    collapsed: false,
    items: components.map(i => ({
      text: i.title + (!english && i.title_zh ? ` - ${i.title_zh}` : ''),
      link: `${prefix}/vue/components/${i.name}/`,
    })),
  })

  return links
}
