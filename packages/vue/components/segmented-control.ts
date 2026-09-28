/** One choice in a single-selection segmented control. */
export interface YlfSegmentedOption<T extends string = string> {
  value: T
  label: string
  disabled?: boolean
  count?: number
  ariaLabel?: string
}
