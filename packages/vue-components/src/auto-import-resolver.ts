import type { ComponentResolver } from 'unplugin-vue-components'

export interface YlfResolverOptions {}

/**
 * Resolver for Vant
 *
 * @link https://github.com/youzan/vant
 */
export function YlfResolver(_options: YlfResolverOptions = {}): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Ylf')) {
        return {
          name,
          from: '@yunlefun/vue-components',
        }
      }
    },
  }
}
