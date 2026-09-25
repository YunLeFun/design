# 发布指南

`@yunlefun/ui` 与 `@yunlefun/vue` 由同一仓库的 `.github/workflows/release.yml` 发布。工作流只在 `release-*` 标签推送后运行：先执行完整校验，再使用 GitHub Actions OIDC 向 npm 发布尚未存在的版本。已发布版本会跳过，重跑同一标签不会重复发包。GitHub 发布任务不读取 `NPM_TOKEN`。

## 一次性配置

两个 npm 包都要各自添加 Trusted Publisher。维护者登录 npm 后，可在包的 Settings → Trusted publishing 选择 GitHub Actions，并填写：

| 字段                 | 值                 |
| -------------------- | ------------------ |
| Organization or user | `YunLeFun`         |
| Repository           | `design`           |
| Workflow filename    | `release.yml`      |
| Environment name     | 留空               |
| Allowed actions      | 允许 `npm publish` |

也可使用 npm CLI：

```bash
npm trust github @yunlefun/ui --repo YunLeFun/design --file release.yml --allow-publish --yes
npm trust github @yunlefun/vue --repo YunLeFun/design --file release.yml --allow-publish --yes
npm trust list @yunlefun/ui
npm trust list @yunlefun/vue
```

信任关系绑定的是仓库和工作流文件名，大小写必须一致。GitHub 发布任务仅授予 `contents: read` 与 `id-token: write`，使用 GitHub 托管 runner、Node 24 和 npm 11.16.0。首次成功验证 OIDC 发布后，再从 GitHub 移除不再需要的 `NPM_TOKEN` secret；确认其他工作流无需它后，可在 npm 侧收紧传统令牌发布权限。

## 发布新版本

1. 根据公开 API 改动修改 `packages/ui/package.json` 或 `packages/vue/package.json` 的版本。若两个包都变更，同时修改两个版本。
2. 更新用户可见的迁移说明，运行 `pnpm install --frozen-lockfile` 和贡献指南中的校验命令，并提交到 `main`。
3. 为该提交创建唯一的 `release-` 标签，例如 `release-20260925-1`，推送标签。发布工作流将仅发布 registry 中尚不存在的版本。
4. 核对 GitHub Actions 结果、npm 上的确切版本与 provenance，并在真实消费项目升级验证。

不要把包版本号只改在本地后从旧标签发布；发布产物应与标签指向的源码一致。日常 PR 和 `main` 推送只运行 CI，不会触发 npm 发布。
