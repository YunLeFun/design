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
        const partialName = name.slice(3)
        return {
          name: partialName,
          from: '@yunlefun/vue-components',
        }
      }
    },
  }
}
