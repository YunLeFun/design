import Theme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import YlfLogo from '../../vue/components/YlfLogo.vue'

import './styles/vars.css'
import './styles/index.css'
import './styles/fonts.css'
import 'uno.css'
import 'virtual:group-icons.css'

import '../../css/index.scss'

import '@yunlefun/ui/styles'
import '@yunlefun/ui/styles/patterns.scss'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      'nav-bar-title-before': () => h(YlfLogo, { size: 'sm', wordmark: false, class: 'ylf-docs-mark' }),
    })
  },
}
