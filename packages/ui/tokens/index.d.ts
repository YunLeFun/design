export type YlfAccentTone = 'blue' | 'sun' | 'cyan' | 'coral' | 'pink' | 'green'
export type YlfStatus = 'success' | 'warning' | 'danger' | 'info'
export type YlfProfile = 'consumer' | 'admin' | 'editor'
export type YlfCloudShape = 'billow' | 'heap' | 'bank' | 'puff' | 'wisp'

export declare const ylfPalette: Readonly<Record<YlfAccentTone, string>>
export declare const ylfAccentTones: readonly YlfAccentTone[]
export declare const ylfStatuses: readonly YlfStatus[]
export declare const ylfProfiles: readonly YlfProfile[]
export declare const ylfCloudShapes: readonly YlfCloudShape[]
export declare const ylfCloudSilhouettes: Readonly<Record<YlfCloudShape, string>>
export declare const ylfTokenNames: readonly string[]
export declare const ylfCompatTokenNames: readonly string[]
export declare const ylfComponentTokenNames: readonly string[]

export declare const ylfTokens: {
  readonly palette: typeof ylfPalette
  readonly brand: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly hero: Readonly<Record<string, string>>
  readonly accents: Readonly<Record<Exclude<YlfAccentTone, 'blue'>, {
    readonly light: Readonly<Record<'base' | 'hover' | 'soft' | 'text' | 'on', string>>
    readonly dark: Readonly<Record<'soft' | 'text', string>>
  }>>
  readonly statusMap: Readonly<Record<YlfStatus, Exclude<YlfAccentTone, 'blue'>>>
  readonly neutrals: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly glass: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly radius: Readonly<Record<string, string>>
  readonly shadow: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly typography: {
    readonly fontFamily: Readonly<Record<'display' | 'wordmark' | 'heading' | 'body' | 'ui' | 'mono', string>>
    readonly fontSize: Readonly<Record<'2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | 'display', string>>
    readonly lineHeight: Readonly<Record<'heading' | 'normal' | 'body', string>>
  }
  readonly space: Readonly<Record<string, string>>
  readonly layout: Readonly<Record<'page' | 'reading', string>>
  readonly zIndex: Readonly<Record<'base' | 'sticky' | 'overlay' | 'modal' | 'popover' | 'tooltip' | 'toast', string>>
  readonly focusAndControls: Readonly<Record<string, string>>
  readonly interactionAndMotion: Readonly<Record<string, string>>
  readonly atmosphere: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly cloud: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
  readonly profiles: {
    readonly admin: Readonly<Record<'base' | 'coarse' | 'light' | 'dark', Readonly<Record<string, string>>>>
    readonly editor: Readonly<Record<'base' | 'coarse' | 'light' | 'dark', Readonly<Record<string, string>>>>
  }
  readonly light: Readonly<Record<string, string>>
  readonly dark: Readonly<Record<string, string>>
  readonly compat: {
    readonly light: Readonly<Record<string, string>>
    readonly dark: Readonly<Record<string, string>>
  }
}
