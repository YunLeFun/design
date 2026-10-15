---
outline: deep
---

<script setup>
import MobileInteractionDemo from '../.vitepress/theme/components/MobileInteractionDemo.vue'
</script>

# 移动端与动效

移动端沿用相同的颜色、字体角色、圆角和状态语义，按输入方式调整触控区域。无需给手机重新维护一套主题，也不替换应用已有的导航框架。

<MobileInteractionDemo />

## 触控与空间

- 在 `pointer: coarse` 设备上，按钮、分段选项、菜单项、选择器和关闭按钮至少提供 `44 × 44 CSS px` 触控范围。`size="sm"` 保留紧凑视觉，也满足触控要求。
- Switch 与 Checkbox 保留原有轨道 / 方框尺寸，用透明命中区和外边距共同扩大点击范围；布局请保留这部分外边距，避免相邻控件的命中区重叠。可见标签使用 `for` 关联控件。
- 只有 `hover: hover` 且 `pointer: fine` 时提供悬停反馈。触屏依赖按压、选中、展开状态反馈；不将重要操作藏在悬停后。
- 长按钮文案可以换行，文字分段控件随可用宽度收缩。分段建议 2–3 个简短选项；空间紧张的低频视图选择放在现有工具栏菜单中，并展示当前视图。
- 输入框建议使用 16px 正文字号，保留缩放能力。当前输入组件仍由应用提供；本轮不新增输入组件或手机专用导航组件。

44 CSS px 是本库的 Web 触控约定，不等同于所有设备上的原生 pt。设计方向参考 [Apple 按钮指南](https://developer.apple.com/design/human-interface-guidelines/buttons)；Web 验证仍需覆盖目标浏览器与实际设备。

## 一套动效语言

| 用途           | 公共变量                                     | 默认值                       | 行为                          |
| -------------- | -------------------------------------------- | ---------------------------- | ----------------------------- |
| 触控目标       | `--ylf-touch-target`                         | 44px                         | 触屏点击范围                  |
| 视口留白       | `--ylf-viewport-gutter`                      | 16px                         | Dialog 与屏幕边缘的距离       |
| 按下           | `--ylf-duration-press` / `--ylf-press-scale` | 100ms / 0.98                 | 轻微缩小，立即响应            |
| 状态变化与释放 | `--ylf-duration-fast`                        | 160ms                        | 颜色、边框与按钮释放          |
| 进入、展开     | `--ylf-duration-enter`                       | 240ms                        | 弹层淡入 / 小幅缩放，内容展开 |
| 离开、收起     | `--ylf-duration-exit`                        | 160ms                        | Dialog 淡出、Accordion 收起   |
| 选择位置变化   | `--ylf-duration-normal`                      | 240ms                        | 开关与选中指示器              |
| 鼠标轻抬       | `--ylf-hover-lift`                           | -1px                         | 按钮悬停；不用于触屏          |
| 常规缓动       | `--ylf-ease-standard`                        | `cubic-bezier(0.2, 0, 0, 1)` | 常规组件避免多余回弹          |
| 软弹簧         | `--ylf-ease-spring` / `--ylf-duration-slow`  | `linear()` 弹簧 / 480ms      | 开关拇指、云朵等「软」的位移  |

软弹簧只用于回应操作的小幅位移，例如开关按下时拇指拉长、松开后回弹；颜色、透明度和弹层进出仍用常规缓动。旧的时长和 `--ylf-ease-bounce` 变量继续保留。Card 的悬停抬升仅适用于可交互内容；静态信息卡使用 `:hoverable="false"`。

动效只解释状态与空间关系，不延迟点击处理。遵循 [Apple Motion 指南](https://developer.apple.com/design/human-interface-guidelines/motion)的可选动效原则：在 `prefers-reduced-motion: reduce` 下取消过渡、弹层 / 折叠动画、按钮 / 卡片位移和加载旋转。开关、箭头与标签仍直接反映最终状态；加载态保留 `aria-busy` 和可读文案。

## 浮层、主题与返回

Dialog 使用动态视口高度 `100dvh`（保留 `vh` 回退），预留安全区域，长内容内部滚动。Popover、Select 和 DropdownMenu 使用 Reka 的可用空间与碰撞检测，不溢出窄屏。

键盘焦点、Escape、关闭后的焦点返回和选择状态由 Reka 负责；不要另加一套焦点管理。局部主题中的弹层用 `portalTo` 或 Reka `ConfigProvider` 的 `teleportTo` 指向同一主题容器，示例也采用此方式。

路由、底部导航、安全区页面壳仍由应用管理。Cook 继续使用 Ionic；design 负责视觉与基础控件。不要给已有工具栏增加常驻说明行，也不要为视图切换重置食材或其他业务状态。

## 渐进接入与验证

新增变量为兼容性扩展，不改变组件公开的 `v-model`、事件与数据规则。触屏命中区、换行和弹层尺寸有所改善，升级时应检查紧凑布局。经典页面可继续锁定旧版本；在新视图主题边界内先映射变量，再替换组件。发布包后才升级消费应用，不能把仓库修改视为线上已生效。

复验入口：`pnpm exec vite --config test/mobile/vite.config.ts`；另一个终端运行 `python3 scripts/qa/mobile.py http://127.0.0.1:3102`（需 Python Playwright 和 Chrome）。脚本覆盖窄屏 / 暗色 / 减少动态效果、触控命中区、选择与禁用项、弹层滚动与焦点恢复，并输出截图和 JSON 记录。页面模拟不能代替 iOS 真机、软键盘与 VoiceOver 验证。
