# 依赖安全补丁

以下三个漏洞截至 2026-10-16 尚无 npm 修复版本，使用 pnpm 的精确版本补丁修复，不修改包名或伪造版本号。

| 包                 | 补丁                                                            | 上游跟踪                                                                                                                               |
| ------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `node-forge@1.4.0` | 校验嵌套 `DigestAlgorithm` 元素数量，拒绝额外 ASN.1 元素        | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv)、[修复提案](https://github.com/digitalbazaar/forge/pull/1152) |
| `braces@3.0.3`     | 为解析、编译、展开和字符串化限制嵌套深度，并拒绝父链循环        | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)、[修复提案](https://github.com/micromatch/braces/pull/72)     |
| `sprintf-js@1.0.3` | 将数字精度限制在 ECMAScript 支持的范围内，防止原生 `RangeError` | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c)                                                               |

运行 `pnpm run audit` 会先通过真实间接依赖路径执行漏洞回归测试，再查询完整的 npm 审计报告。只有上表对应的精确版本、补丁 SHA-256 和所有锁定依赖路径均匹配时，才将该项报告标记为已本地修复；其他漏洞、补丁失效或审计服务异常仍使 CI 失败。

原始 `pnpm audit` 只按已发布版本判断，因此仍会报告这三项。仓库没有配置全局 GHSA 忽略列表，也没有降低审计级别。上游发布修复版后，应更新版本、移除对应补丁及 `scripts/audit-dependencies.mjs` 中的映射，并运行完整验收。

工具链使用 pnpm 12；TypeScript 升级到 6.0.3。TypeScript 7 尚无 Vue 类型检查和声明生成所需的兼容编译器 API，因此暂不采用。Nuxt 的 `cssnano` 暂定为仍具分阶段发布审批的 8.0.10，保持仓库的 `trustPolicy: no-downgrade`。
