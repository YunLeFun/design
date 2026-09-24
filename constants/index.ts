export const GITHUB_BLOB_URL = 'https://github.com/YunLeFun/design/blob/main/packages'

function r(p: string) {
  return new URL(p, import.meta.url).pathname
}

export const DIR_PACKAGES = r('../packages')
export const DIR_PACKAGE_UTILS = r('../packages/utils')
