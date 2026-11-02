# GA 就绪清单（3 个旗舰）

> 2026-11-02：`dsh-einvoice 0.2.0`、`dsh-bankrec 0.1.0`、`dsh-docx-redline 0.1.0` 已发布为**非 alpha**，
> npm `latest` 指向它们，GitHub Release 标记为非 pre-release。

## 为什么是这三个

| 包 | 理由 | 依赖面 |
|---|---|---|
| `dsh-einvoice` | 品类最清晰（发票查重/归档），下载与咨询的第一入口 | 纯本地，fflate + fast-xml-parser |
| `dsh-bankrec` | 对账是财务最普遍的动作，格式支持最全（CSV/CAMT.053/054/056/MT940） | 纯本地 |
| `dsh-docx-redline` | 唯一处理 Office 正文的包，且已修过"字节级 roundtrip"的自证问题 | 纯本地 |

## 已满足的条件

| # | 条件 | 证据 |
|---|---|---|
| 1 | 首跑三件套 | 三包均 PS1 **10/10**：样例随包、一句话 prompt、权限四行、真实截图 |
| 2 | 真实运行可复现 | `scripts/first-run-smoke.mjs`：`npm pack` → 解包 → 跑包内 quickstart → 金标一致 |
| 3 | 测试 | einvoice 32 pass/6 skip（外部样本缺失时跳过）、bankrec 35、docx 28 |
| 4 | 验收证据 | ACCEPTANCE.csv 含 PS1-QS01 行与 SKU 行 |
| 5 | 发布完整性 | npm provenance、GitHub Release 带 SHA256SUMS + SBOM |
| 6 | 兼容性声明 | `engines.dsh` + peer 范围；README 写明"本地运行、不上传文件" |
| 7 | 稳定语义 | CHANGELOG 增加 `Stable` 段：**工具名与 CLI 表面受兼容承诺约束**，破坏性变更需 minor 版本 |

## 稳定承诺（写进 CHANGELOG，也是对外承诺）

1. **工具名不变**：`invoice.*`、`bankrec.*`、`doc.*` / `redline.*` 的工具名在 1.0 前不再重命名。
2. **参数只增不改**：新增可选参数可以，删除或改语义必须 minor。
3. **错误码稳定**：已有 `E_*` 码含义不变；新增错误码会写进 CHANGELOG。
4. **数据目录稳定**：`$DSH_HOME/storages/<pkg>` 路径不变；升级不迁移用户数据。
5. **不联网**：三包都声明 `network: false`，源码无网络调用（有测试守护）。

## 下一步（GA 之后）

| 动作 | 说明 |
|---|---|
| 观察 2 周 | 看 npm 下载、issue、安装失败率（install-smoke 已有） |
| 第二个 GA 批次 | 候选：`dsh-legal-clause`、`dsh-ap-three-way`、`dsh-qms-capa`（均 10/10） |
| dist-tag 策略 | 稳定版只打 `latest`；alpha 只打 `alpha`/`next`（workflow 已按版本号自动判断） |
| 兼容矩阵 | 宿主升到 0.3.x 时跑一遍 `first-run-smoke` + install-smoke |

## 怎么做下一批 GA

```bash
# 1. 确认包是 PS1 绿
node 04-build/dsh-plugins/scripts/score-packages.mjs --csv /tmp/ps1.csv
# 2. 确认首跑路径没断
node 04-build/dsh-plugins/scripts/first-run-smoke.mjs <package-dir>
# 3. 在 CHANGELOG 顶部加 Stable 段，写明稳定承诺
# 4. 用显式版本发布（不带 -alpha）
DSH_RELEASE_VERSION=0.1.0 node 04-build/dsh-plugins/scripts/release-package.mjs 04-build/<dir> <npm-name>
# 5. 验证
curl -s https://registry.npmjs.org/<npm-name>/latest | jq -r .version
```

> 注意：workflow 会按版本号自动决定 dist-tag 与 release 的 prerelease 标记——带 `-alpha` 的版本只进 `alpha`/`next`，不带则进 `latest` 且 release 不是 pre-release。
