---
outline: deep
---

# Registry 分发

YunLeFun Registry 使用 `shadcn-vue` 的 schema 与 CLI，把需要业务方取得源码并继续修改的组件分发到真实 Vue 项目。稳定基础组件仍优先通过 npm 包统一维护，Registry 不会替代 `@yunlefun/vue`。

当前基础链路已达到发布就绪状态：

| Item         | 内容                                  | 状态   |
| ------------ | ------------------------------------- | ------ |
| `ylf-tokens` | `--ylf-*` 明暗主题与品牌 token        | stable |
| `ylf-button` | `YlfButton.vue`，依赖共享 token       | stable |
| `ylf-dialog` | `YlfDialog.vue`、Reka UI 与共享 token | stable |

三项均为 universal item：不要求消费项目预装 Tailwind 或初始化 `components.json`，并通过明确 target 安装到采用 `src` 目录的 Vue + Vite 项目。

## 从线上 Registry 安装

安装 Button：

```bash
pnpm dlx shadcn-vue@2.8.2 add https://ui.yunle.fun/r/ylf-button.json
```

安装 Dialog：

```bash
pnpm dlx shadcn-vue@2.8.2 add https://ui.yunle.fun/r/ylf-dialog.json
```

两个组件都会通过 `registryDependencies` 自动安装 `ylf-tokens`。在应用入口加载一次：

```ts
import './styles/ylf-tokens.scss'
```

然后使用复制到项目中的组件：

```vue
<script setup lang="ts">
import YlfButton from './components/ui/YlfButton.vue'
import YlfDialog from './components/ui/YlfDialog.vue'
</script>

<template>
  <YlfButton variant="aurora">
    开始创作
  </YlfButton>

  <YlfDialog title="确认发布" description="发布后所有访客都能看到。">
    作品内容
  </YlfDialog>
</template>
```

没有可见标题的 Dialog 必须传入有意义的 `accessible-title`；组件会将它渲染为仅供辅助技术读取的标题。

> universal 表示安装不依赖 Tailwind 和 `components.json`，不表示能自动推断任意目录结构。Registry URL 模式当前约定消费项目使用 `src` 目录。

## 构建与验证

构建全部 Registry JSON：

```bash
pnpm registry:build
```

执行完整本地验收：

```bash
pnpm registry:verify
```

验证脚本会分别创建两个临时 Vue + Vite 项目，通过 URL 独立安装 Button 与 Dialog，递归安装共享 token，然后执行类型检查和生产构建。安装后的组件与 token 还会逐字节对比仓库中的权威源码。

部署后可对线上 Registry 重复同一套验收：

```bash
YLF_REGISTRY_BASE_URL=https://ui.yunle.fun/r pnpm registry:verify
```

## 源码与生成物

`registry.json` 只声明分发关系，所有生成物仍来自包内权威文件：

```text
packages/ui/styles/css-vars.scss ───────→ ylf-tokens.json
                                              ↑
packages/vue/components/YlfButton.vue ──→ ylf-button.json
packages/vue/components/YlfDialog.vue ──→ ylf-dialog.json
```

`ylf-button` 与 `ylf-dialog` 通过远程 `registryDependencies` 复用 `ylf-tokens`，不再分别携带一份 token 文件。修改组件或 token 后重新构建即可，不维护 Registry 专用副本。

## 发布门槛

1. `shadcn-vue 2.8.2` 能构建全部 item，并通过 schema 检查。
2. Button 与 Dialog 均可从 URL 独立安装到全新 Vue + Vite 项目。
3. npm 依赖、共享 token、Portal、类型检查和生产构建全部通过。
4. Dialog 始终具有可访问名称；缺少描述时不保留空的 `aria-describedby`。
5. Registry 生成物与包内权威源码保持一致。
6. 单元测试、文档构建和 Nuxt 4 集成构建通过。

下一阶段优先为真正需要复制并继续修改的 Data Table、登录页、设置页和 AI 对话等 Blocks 建立 Registry item；基础控件继续以 npm 包为首选。
