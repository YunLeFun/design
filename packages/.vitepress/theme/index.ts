import Theme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'

import './styles/vars.css'
import './styles/index.css'
import './styles/markdown.css'
import './styles/appearance.css'
import './styles/fonts.css'
import 'uno.css'
import 'virtual:group-icons.css'

import '../../css/index.scss'

import '@yunlefun/ui/styles'
import '@yunlefun/ui/styles/patterns.scss'

export default {
  ...Theme,
  Layout,
}
