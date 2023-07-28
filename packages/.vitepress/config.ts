import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

import { metadata } from '../metadata/metadata'

export const defaultSideBar: DefaultTheme.Sidebar = [
  { text: 'Get Started', link: '/guide/' },
]

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@YunLeFun/UI',
  description: 'UI for YunLeFun',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Vue', link: '/vue/' },
    ],

    sidebar: {
      '/guide/': defaultSideBar,
      '/vue/': getVueComponentsSidebar(),
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunLeFun/ui' },
      { icon: 'twitter', link: 'https://twitter.com/YunLeFun' },
    ],
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
