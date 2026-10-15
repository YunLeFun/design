# AI 机器人组件

机器人概览、连接状态和任务卡片来自 el-bot 本机控制台的实际需求，作为 design 库的可复用组件维护。现阶段源码与 Registry 为实验性扩展，尚未发布到 npm 或线上 Registry。

- [Agent Status](/vue/components/agent-status/)：连接状态与任务状态的语义展示。
- [Agent Card](/vue/components/agent-card/)：机器人身份、连接信息与操作插槽。
- [Agent Task](/vue/components/agent-task/)：任务状态、标识、等待原因与操作插槽。

## 接入与维护

组件与普通 `Ylf*` 控件使用相同 token。已发布的基础样式从 `@yunlefun/ui/css` 加载，系统深色模式由应用将根元素切换为 `ylf-theme-dark`。通用按钮、选择器与对话框从 npm 的 `@yunlefun/vue` 接入。

当前可以运行 `pnpm registry:build`，从生成的 `packages/public/r/ylf-agent.json` 安装源码到应用的 `src/components/ui/`；上线后才可使用对应 URL 安装。Registry 从本仓库同一份权威源码生成，复制后的代码不会自动更新。el-bot 提供本地同步命令与 `--check`，逐字节检查四个组件／类型文件是否一致，并保留 MIT 许可。

新组件随下次 Vue 包发布进入公开组件子路径。不要用绝对本机路径或未发布的 npm 版本作为业务依赖。

## 业务边界

组件只展示明确传入的状态与本地化文字，不连接 QQ、不调用模型、不保存凭据、不执行机器人启停或审批。应用负责状态映射、单任务准入、权限判断、中断确认与实际动作。

QQ、模型和任务分别展示，避免把进程正在运行误当成所有服务已就绪。回调监听不是 QQ 连接验证；未知状态必须明确展示为未验证。任务进度未知时不显示百分比。审批和中断按钮放在 `actions` 插槽中，由应用决定是否可用。

长任务标识、项目路径与中文说明允许换行；纯展示卡片无持续动效。只有需要辅助技术播报的单个状态摘要才启用 `live`。
