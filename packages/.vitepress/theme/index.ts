import Theme from 'vitepress/theme'
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'

import './styles/vars.css'
import './styles/index.css'
import 'uno.css'
import 'virtual:group-icons.css'

import '../../css/index.scss'

import '@yunlefun/ui/styles/css-vars.scss'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/exvue-rtending-default-theme#layout-slots
    })
  },
  // eslint-disable-next-line unused-imports/no-unused-vars
  enhanceApp({ app, router, siteData }) {
    // ...
  },
}
