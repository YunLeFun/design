/**
 * 放大元素
 */
export async function previewElement(el: HTMLElement, options: {
  /**
   * 是否复制元素
   */
  clone?: boolean
  /**
   * 放大倍数
   */
  scale?: number
} = {}) {
  const { clone = true, scale = 2 } = options
  const transformScale = `scale(${scale})`
  const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : undefined
  // copy element
  // el.cloneNode canvas will lose context

  // 只能占位
  const clonedNode = el.cloneNode(true) as HTMLElement
  if (clone) {
    clonedNode.removeAttribute('id')
    for (const descendant of clonedNode.querySelectorAll('[id]'))
      descendant.removeAttribute('id')
  }
  const rawParent = el.parentElement
  const previewChild = clone ? clonedNode : el

  // 已经放大
  if (previewChild.style.transform === transformScale) {
    return
  }

  const previousTransform = previewChild.style.transform

  const container = document.createElement('div')
  container.setAttribute('role', 'dialog')
  container.setAttribute('aria-modal', 'true')
  container.tabIndex = -1
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.zIndex = '9999'
  container.style.display = 'flex'
  container.style.justifyContent = 'center'
  container.style.alignItems = 'center'

  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  overlay.style.cursor = 'zoom-out'

  container.appendChild(overlay)

  const disableClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()
  }
  if (!clone) {
    // 非拷贝时，需要替换原元素。不然 canvas 内容会丢失
    rawParent?.replaceChild(clonedNode, el)
    previewChild.addEventListener('click', disableClick, true)
  }
  previewChild.style.transform = transformScale
  container.appendChild(previewChild)
  document.body.appendChild(container)
  container.focus()

  let closed = false
  const close = () => {
    if (closed)
      return
    closed = true
    document.removeEventListener('keydown', onKeydown)
    previewChild.style.transform = previousTransform
    if (!clone) {
      rawParent?.replaceChild(el, clonedNode)
      previewChild.removeEventListener('click', disableClick, true)
    }
    clonedNode.remove()
    container.remove()
    if (previousFocus && previousFocus.isConnected)
      previousFocus.focus()
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  document.addEventListener('keydown', onKeydown)
  overlay.addEventListener('click', close)
}
