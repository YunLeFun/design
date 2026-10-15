---
outline: deep
---

<script setup>
import EditorSpecimen from '../.vitepress/theme/components/EditorSpecimen.vue'
</script>

# Editor · 复杂操作界面

Editor 是云乐坊设计体系面向绘画、图像、时间线与其他复杂工作台的分类。共享晴空蓝品牌与语义状态，独立维护密度、中性表面和属性控件。首个应用是 **云绘 Saier** 的主画板与水印插件。

消费页面继续使用舒展的阅读间距与大圆角；Editor 以作品为视觉中心。借鉴 macOS 工具面板的清晰层次、紧凑属性行和细分隔线，不复制窗口红黄绿按钮等浏览器中没有对应行为的装饰。

## 交互样板

可切换明暗主题、选择图层并调整透明度。样板展示设计语言，不模拟绘画引擎。

<EditorSpecimen />

## 工作台 Playground

[打开完整的编辑器 Playground](/guide/editor-playground)，体验「制作工作台」与「叙事编辑器」两种示例。两者共享 Editor 的中性表面、晴空蓝、控件尺寸和圆角，通过项目内容与工作区文案表达不同任务。

- 切换浅色 / 深色，观察工具栏、文稿与属性面板的层级；作品预览保持自己的配色。
- 从项目目录或分镜顺序选择片段，正文与检查器同步更新。
- 编辑正文、标题、时长和画面说明，再切换预览查看结果；切换片段或隐藏属性不会丢失本页输入。
- 搜索片段、折叠属性、恢复示例，并在窄屏或触屏下检查重排与命中面积。

这是候选工作区的设计演示，使用内存中的虚构内容，刷新后恢复，不连接真实项目或发布流程，也不代表 ADV.JS / Studio 已完成迁移。普通管理列表、审批与配置继续使用 [Admin 规范](/guide/admin)。

实现位于 `packages/.vitepress/theme/components/editor/`：`EditorPlayground` 管理演示状态，`EditorOutline`、`EditorCanvas`、`EditorInspector` 分别展示目录、内容和属性，通过 props / emits 联动。按钮与分段选择复用现有共享组件，尺寸适配仅作用于样板；它们尚不是新的公共 Editor 组件 API。

## 视觉基础

| 角色   | 浅色      | 深色      |
| ------ | --------- | --------- |
| 面板   | `#f6f6f7` | `#292a2d` |
| 工具栏 | `#ebebed` | `#303033` |
| 输入框 | `#ffffff` | `#353639` |
| 工作区 | `#d7d7da` | `#202123` |
| 正文   | `#292a2e` | `#eeeef0` |
| 强调   | `#2563eb` | `#60a5fa` |

- 使用系统 UI 字体，macOS 优先系统字体，中文使用苹方；不下载展示字体。属性 12px、辅助 11px，数值使用等宽数字。
- 控件圆角 5px、浮动面板 10px；通过表面、1px 分隔线和柔和中性阴影区分层级。
- 品牌六色集中在标志；蓝色表示当前选择、键盘焦点与主操作。画布周围保持中性，实际图像不参与主题切换。
- 不在编辑器面板使用消费端的大标题、营销卡片、重复嵌套卡片或大面积渐变。

## 密度与控件

| 元素            | 鼠标 / 触控板 | 粗指针         |
| --------------- | ------------- | -------------- |
| 小按钮          | 24px          | 40px           |
| 输入 / 标准按钮 | 28px          | 40px           |
| 图层 / 工具栏行 | 32px          | 44px           |
| 面板标题        | 32px          | 44px           |
| 面板宽度        | 272px 起      | 根据屏幕自适应 |

属性检查器遵循「标签 → 值 → 单位」对齐；坐标和大小成组，不给每个数值单独做卡片。透明度采用标签、滑块、数值单行布局，颜色使用色块加色值。导出格式并排排列，主要格式使用品牌实色。

图标按钮必须有可访问名称与提示。工具栏支持方向键导航，属性通过 Tab 访问；焦点不能只靠颜色区分。原生文件输入可透明覆盖一个明确的导入控件，保留键盘焦点和文件选择行为。

折叠高级设置时保留参数。图层选择不修改作品；透明度滑动等连续操作在提交时形成一次撤销。关闭插件面板保留文档。触摸设备保持足够命中面积，不仅按窗口宽度压小按钮。

## 接入

Editor 样式独立选择加载，不修改消费端 `--ylf-c-*` 与 `--ylf-radius-*`：

```ts
import '@yunlefun/ui/css'
import '@yunlefun/ui/editor.css'
```

```html
<section data-ylf-editor-theme="dark" class="my-editor">
  <!-- 使用 --ylf-editor-* 的编辑器组件 -->
</section>
```

```css
.my-editor {
  background: var(--ylf-editor-panel);
  color: var(--ylf-editor-fg);
  font: var(--ylf-editor-text) / 1.45 var(--ylf-editor-font);
}
.my-editor input {
  min-height: var(--ylf-editor-control);
  border-radius: var(--ylf-editor-radius);
  background: var(--ylf-editor-field);
}
```

样式入口只提供 token，不给全局原生元素套样式，也不自动缩小 `YlfButton`。复杂行为继续使用 Reka UI，应用通过适配层接入已有编辑器控件。

本入口属于当前本地源码，发布前请通过工作区或本地打包试用。Saier 暂存同一份 `editor.css`，由 `--saier-*` 映射；发布后再替换为版本化依赖。复制版更新时必须同步原文件并校验一致，不能当作第二个设计源。

## 验收

浅色、深色、鼠标和触摸均可操作；长图层名截断但可查看全名；数值、色值和单位保持对齐；面板窄屏无横向溢出；导入、撤销、导出与画布结果保持正确。动效尊重 reduced motion，不给画布或颜色判断增加装饰性滤镜。
