export interface BrandPalette {
  light: string
  dark: string
  background: string
}
export type BrandMark = 'brand-mark' | 'design-mark'
/** A site's own mark as Iconify data; paint with `currentColor`. */
export interface BrandIcon {
  body: string
  width?: number
  height?: number
}
export function readBrandPalette(css: string): BrandPalette
export function renderBrandAssets(mark: BrandMark | BrandIcon, palette: BrandPalette): {
  mark: string
  light: string
  dark: string
  favicon: string
  raster: string
  app: string
}
export function generateBrandAssets(options: {
  outDir: string
  icon?: BrandMark | BrandIcon
  title?: string
  /** Requires rsvg-convert when true (default). */
  png?: boolean
  /** Override token colors, e.g. a site accent; values must be hex. */
  palette?: Partial<BrandPalette>
}): Promise<void>
