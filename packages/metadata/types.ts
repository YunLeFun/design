export interface YunLeFunComponent {
  title: string
  title_zh?: string
  name: string
  description?: string
  lastUpdated?: number
  docs?: string
}

export interface PackageIndexes {
  components: YunLeFunComponent[]
}
