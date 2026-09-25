# 贡献指南

欢迎改进设计 token、Vue 组件、文档和 Registry。小型修复可直接提交 Pull Request；涉及公开 API 或视觉方向的改动建议先开 Issue 讨论迁移影响。

## 开发

需要 Node.js 22.19 或更新版本和 pnpm 11。Fork 仓库后从 `main` 创建分支：

```bash
pnpm install --frozen-lockfile
pnpm docs:dev
```

提交前运行：

```bash
pnpm lint
pnpm typecheck
pnpm exec vitest run
pnpm docs:build
pnpm ui:verify
```

修改 Vue 组件或 Registry 时，另运行 `pnpm build:vue`、`pnpm nuxt:verify` 和 `pnpm registry:verify`。Registry 产物由 `pnpm registry:build` 生成，请勿只手工编辑生成文件。

## Pull Request

说明改动原因、公开接口或 token 的兼容性、验证结果。视觉改动请附明暗主题及窄屏截图；交互改动请覆盖键盘、焦点和禁用状态。提交信息使用 Conventional Commits，例如 `fix(button): keep focus visible in dark mode`。

不要提交真实密钥、令牌或用户数据。发现漏洞请按 [SECURITY.md](./SECURITY.md) 私下报告。npm 发布由维护者依照 [RELEASING.md](./RELEASING.md) 执行；合并 PR 不会自动发布。
