export interface BrandPalette {
  light: string
  dark: string
  background: string
}
export type BrandMark = 'brand-mark' | 'design-mark'
export function readBrandPalette(css: string): BrandPalette
export function renderBrandAssets(name: BrandMark, palette: BrandPalette): {
  mark: string
  light: string
  dark: string
  favicon: string
  raster: string
  app: string
}
export function generateBrandAssets(options: {
  outDir: string
  icon?: BrandMark
  title?: string
  /** Requires rsvg-convert when true (default). */
  png?: boolean
}): Promise<void>
