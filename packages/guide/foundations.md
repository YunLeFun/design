---
outline: deep
---

# 视觉基础

默认方向是**晴空蓝为主、高饱和纯色点缀**。所有组件读取 `@yunlefun/ui` 的语义变量，主题数值在 `packages/ui/styles/css-vars.scss` 中维护。

## 颜色的角色

| 角色             | Token             | 浅色      | 深色      |
| ---------------- | ----------------- | --------- | --------- |
| 日常品牌与主操作 | `--ylf-c-brand`   | `#2563eb` | `#60a5fa` |
| 页面背景         | `--ylf-c-bg`      | `#f8fafc` | `#0b1022` |
| 内容表面         | `--ylf-c-surface` | `#ffffff` | `#121a30` |
| 主要文字         | `--ylf-c-text`    | `#0f172a` | `#e5e7eb` |
| 次要文字         | `--ylf-c-text-2`  | `#475569` | `#cbd5e1` |

主色的 hover、active 和 soft 状态也从 token 读取。成功、提醒、危险与信息分别映射到鲜绿、明黄、珊瑚橙和青色。实色背景使用 `--ylf-status-{状态}`，前景使用配套的 `-on`；浅底使用 `-soft` 与 `-text`。旧 `--ylf-c-success / warning / danger / info` 仅作为文字色别名，详见[色彩与组件](/guide/colors)。

主色操作上的文字用 `--ylf-c-text-on-accent`；多巴胺强调色使用独立的 `--ylf-accent-{tone}-on` 前景。亮色不直接承担小字号文字，搭配成组维护的浅底与文字 token。完整色板、共享上下文和组件用法见[色彩与组件](/guide/colors)。

玻璃表面和渐变的可读性取决于实际背景，需要在真实页面中验证。不能仅凭单个颜色值宣称整套组件已经通过无障碍验收。

## 字体与层级

展示、品牌字、产品标题和正文分别使用 `--ylf-font-display`、`--ylf-font-wordmark`、`--ylf-font-heading` 和 `--ylf-font-body`。

默认展示字体保留 Baloo 2 与站酷快乐体的现有实现；正文和产品标题使用系统字体。品牌字体按需加载，不因为安装基础样式自动下载。具体用法见[字体规范](/guide/typography)。

### 字号与行高 Token

以下变量已在样式包中导出。`rem` 随用户的根字号设置缩放；表中的像素值按根字号 16px 计算。

| Token                   | 默认值          | 用途               |
| ----------------------- | --------------- | ------------------ |
| `--ylf-text-xs`         | 12px            | 注释与非关键元信息 |
| `--ylf-text-sm`         | 14px            | 辅助信息、紧凑界面 |
| `--ylf-text-base`       | 16px            | 正文               |
| `--ylf-text-lg`         | 20px            | 卡片与小节标题     |
| `--ylf-text-xl`         | 24px            | 区块标题           |
| `--ylf-text-2xl`        | 32px            | 页面标题           |
| `--ylf-text-display`    | 36–64px，自适应 | 品牌展示           |
| `--ylf-leading-heading` | 1.25            | 短标题             |
| `--ylf-leading-body`    | 1.75            | 正文与说明         |
| `--ylf-font-mono`       | 系统等宽字体    | 代码与 token 名称  |

长中文标题可按场景放宽行高，窄屏允许自然换行；品牌展示字号不进入表单。文档中的说明文字不能仅靠变浅和缩小来降低层级。

## 间距与布局

以 4px 为基础步长。`--ylf-space-1 / 2 / 3 / 4 / 6 / 8 / 12 / 16` 分别为 4、8、12、16、24、32、48、64px；后缀表示步数。

控件内部优先 8–12px，同组字段 16–24px，区块之间 32–64px。内容容器使用 `--ylf-layout-page`（1200px），文档阅读列使用 `--ylf-layout-reading`（720px），同时配合 `width: 100%` 和侧边留白。两者都是宽度上限，不是固定宽度。

```css
.content {
  width: 100%;
  max-width: var(--ylf-layout-reading);
  margin-inline: auto;
  padding-inline: var(--ylf-space-6);
}
```

横向宽度在页面、导航、目录之间分配。390px 手机侧边留白建议 24px；多列布局在内容放不下时折叠，不缩小字号来勉强塞入。

- 首页先让访客理解可以体验哪些应用，品牌氛围围绕内容展开。
- 探索页保持搜索、筛选、结果和空状态的稳定位置。
- 设置页按任务分组，保存按钮与被修改的字段关系明确。
- 移动端优先保证内容顺序和触控操作，不把桌面多列简单压缩。

## 圆角、阴影与动效

现有圆角 token 为 10、14、20、28px 和 pill。小控件、标准控件、内容容器依层次选用，胶囊用于按钮和标签等合适的形态。

`--ylf-shadow-sm`、`--ylf-shadow`、`--ylf-shadow-lg` 表达表面层级；组件使用中性表面阴影，纯色强调不增加彩色发光。日常控件的反馈优先通过颜色、边框和状态完成，持续装饰动效应可关闭。

交互反馈使用 `--ylf-duration-fast`（160ms），布局或面板变化使用 `--ylf-duration-normal`（240ms），配合 `--ylf-ease-standard`。系统开启 `prefers-reduced-motion: reduce` 时，两种时长都变为 0ms。独立实现的弹簧、循环动画也需要单独处理这个媒体查询。

品牌展示可以更鲜明，正文、表单和长时间使用的工作区保持稳定。默认不播放循环背景动画；纯展示卡片显式使用 `<YlfCard :hoverable="false">`，避免悬停上浮被误认为可点击。

## 云景与网格

`--ylf-c-sky`、`--ylf-c-cloud` 和 `--ylf-c-grid` 分别表达天空、云形和细网格，随明暗主题成组变化。它们只用于装饰，不承载文字或交互状态。`--ylf-grid-size` 默认 32px。

可选背景通过单独入口加载，基础样式不会自动改变页面背景：

```scss
@use '@yunlefun/ui/styles';
@use '@yunlefun/ui/styles/patterns.scss';
```

`ylf-pattern-sky` 提供浅到深的天空表面，`ylf-pattern-grid` 提供细网格。两个类都定义背景图像；需要同时展示时使用嵌套容器，不叠在同一个元素上。文档首页提供了实际用例，更多场景见[品牌与界面](/guide/patterns)。

## 交互与文案

新增或调整控件时覆盖 default、hover、active、focus、disabled、loading；表单另行覆盖校验错误和帮助信息。可交互元素具有可访问名称，键盘焦点可见，弹窗关闭后能回到触发位置。

操作使用明确动词，例如“保存资料”“创建应用”。同一流程中的按钮、加载文案与完成提示使用相同的业务词汇。空状态说明下一步，错误状态说明可采取的恢复动作。

普通文字以至少 4.5:1 的对比度为验收目标；大字号文字适用 3:1 门槛，例外条件按 [WCAG 文字对比度说明](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)判断。移动端主要操作建议提供 44px 的触控区域；WCAG 2.2 AA 的最小目标尺寸为 24 CSS px，并包含间距等例外条件，详见[目标尺寸说明](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)。

## 明暗主题

`.dark` 切换应用主题；文档中的 `.ylf-theme-light` 与 `.ylf-theme-dark` 用于独立预览。颜色、前景和阴影成组切换，浮层必须继承所在主题。

验收覆盖浅色、深色、390px 手机、768px 平板和桌面，检查长中文文案、加载状态、空状态与键盘操作。局部样式应引用 token，避免在每个组件里再写一组深色覆盖。
