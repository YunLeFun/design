export interface BottomMenuItem {
  title: string
  /**
   * @description icon class
   */
  icon: string
  /**
   * @description active icon class
   */
  activeIcon?: string
  /**
   * @description RouterLink to
   */
  to?: string
  /**
   * onClick
   * @returns
   */
  onClick?: () => void
}
