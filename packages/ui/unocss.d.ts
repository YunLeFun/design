export interface YunlefunThemeColors {
  [key: string]: string | YunlefunThemeColors
}

export interface YunlefunPreset {
  name: string
  rules: Array<[string, Record<string, string>]>
  theme: {
    colors: YunlefunThemeColors
    borderRadius: Record<string, string>
    fontFamily: Record<string, string>
    zIndex: Record<string, string>
  }
}

export declare function presetYunlefun(): YunlefunPreset
export default presetYunlefun
