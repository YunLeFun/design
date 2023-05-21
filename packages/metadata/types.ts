export interface YunLeFunComponent {
  title: string
  title_zh?: string
  name: string
  description?: string
  lastUpdated?: number
}

export interface PackageIndexes {
  components: YunLeFunComponent[]
}
