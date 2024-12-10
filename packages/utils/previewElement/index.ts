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
  scale: number
} = {
  clone: true,
  scale: 2,
}) {
  const transformScale = `scale(${options.scale})`
  // copy element
  // el.cloneNode canvas will lose context

  // 只能占位
  const clonedNode = el.cloneNode(true) as HTMLElement
  const rawParent = el.parentElement
  const previewChild = options.clone ? clonedNode : el

  // 已经放大
  if (previewChild.style.transform === transformScale) {
    return
  }

  const container = document.createElement('div')
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
    e.stopPropagation()
    // console.log('disable')
  }
  if (!options.clone) {
    // 非拷贝时，需要替换原元素。不然 canvas 内容会丢失
    rawParent?.replaceChild(clonedNode, el)
    // previewChild.addEventListener('click', disableClick)
    previewChild.onclick = disableClick
  }
  previewChild.style.transform = `scale(${options.scale})`
  container.appendChild(previewChild)
  document.body.appendChild(container)

  overlay.addEventListener('click', () => {
    previewChild.style.transform = 'scale(1)'
    if (!options.clone) {
      rawParent?.replaceChild(el, clonedNode)

      previewChild.removeEventListener('click', disableClick)
    }
    clonedNode.remove()
    document.body.removeChild(container)
  })
}
