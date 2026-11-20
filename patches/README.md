# 依赖安全补丁

以下依赖使用 pnpm 的精确版本补丁修复。已升级至 `node-forge@1.4.3`，其 ASN.1 回归测试继续验证上游修复。

| 包                 | 补丁                                                            | 上游跟踪                                                                                                                           |
| ------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `braces@3.0.3`     | 为解析、编译、展开和字符串化限制嵌套深度，并拒绝父链循环        | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)、[修复提案](https://github.com/micromatch/braces/pull/72) |
| `sprintf-js@1.0.3` | 将数字精度限制在 ECMAScript 支持的范围内，防止原生 `RangeError` | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)                                                           |

运行 `pnpm run audit` 会先通过真实间接依赖路径执行漏洞回归测试，再查询完整的 npm 审计报告。只有上表对应的精确版本、补丁 SHA-256 和所有锁定依赖路径均匹配时，才将该项报告标记为已本地修复；其他漏洞、补丁失效或审计服务异常仍使 CI 失败。

原始 `pnpm audit` 按已发布版本判断，可能报告上表中的漏洞。上游发布修复版后，应更新版本、移除对应补丁及 `scripts/audit-dependencies.mjs` 中的映射，并运行完整验收。

`shadcn-vue@2.8.2` 的兼容补丁让 Registry 工具使用修复后的 Zod 4。它保留配置覆盖的可选字段，并使用 Zod 4 的错误和 JSON Schema 接口。上游支持 Zod 4 后可移除补丁。

工具链使用 pnpm 12，CI 使用 Node 24 LTS 和 Corepack 0.36；TypeScript 升级到 6.0.3。TypeScript 7 尚无 Vue 类型检查和声明生成所需的兼容编译器 API，因此暂不采用。Nuxt 的 `cssnano` 暂定为仍具分阶段发布审批的 8.0.10，保持仓库的 `trustPolicy: no-downgrade`。
