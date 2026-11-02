# PerryLink DSH 领域插件

> **Status: alpha / public-synthetic / partial / not counted / not GA.** 分类：四轴模型见 [TAXONOMY.md](TAXONOMY.md)；125 行可筛选视图见 [taxonomy.html](docs/taxonomy.html)。 本索引只列公开合成演示；没有客户证据、客户数据或生产可用声明。SKU-11/14 永久 DROP。

15 个 DSH 插件，全部使用**裸 npm 名**（`dsh-*`），按 6 个业务族组织。

## 安装

```sh
dsh plugin --profile <profile> add dsh-ghg
```

要求 DSH `>=0.2.1-rc.3 <0.3.0`、Node `>=24.9 <25`。

## 索引

### 财务运营 Finance Ops

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-einvoice`](https://github.com/PerryLink/dsh-einvoice) | 文件级中国电子发票（OFD/XML）入库、解析、去重与本地归档。 | `0.2.0-alpha.11` | `dsh plugin --profile <profile> add dsh-einvoice` |
| [`dsh-bankrec`](https://github.com/PerryLink/dsh-bankrec) | 银行流水/GL/CAMT.053/MT940 入库、对账与三表底稿。 | `0.1.0-alpha.16` | `dsh plugin --profile <profile> add dsh-bankrec` |
| [`dsh-ap-three-way`](https://github.com/PerryLink/dsh-ap-three-way) | 发票/PO/GRN 三单匹配、容差与例外底稿。 | `0.1.0-alpha.11` | `dsh plugin --profile <profile> add dsh-ap-three-way` |
| [`dsh-travel-recon`](https://github.com/PerryLink/dsh-travel-recon) | 差旅订单/发票/卡流水对账、去重与只读政策检查。 | `0.1.0-alpha.13` | `dsh plugin --profile <profile> add dsh-travel-recon` |

### 法务运营 Legal Ops

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-legal-intake`](https://github.com/PerryLink/dsh-legal-intake) | 法务需求 EML 收件、线程去重与台账导出。 | `0.1.0-alpha.10` | `dsh plugin --profile <profile> add dsh-legal-intake` |
| [`dsh-legal-clause`](https://github.com/PerryLink/dsh-legal-clause) | 合同条款树、playbook 映射与未解决报告。 | `0.1.0-alpha.12` | `dsh plugin --profile <profile> add dsh-legal-clause` |

### 可持续与质量 ESG & Quality

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-ghg`](https://github.com/PerryLink/dsh-ghg) | 用电活动入库、GHG 计算、逐行复算、底稿与部分 ESRS 包。 | `0.1.0-alpha.17` | `dsh plugin --profile <profile> add dsh-ghg` |
| [`dsh-qms-capa`](https://github.com/PerryLink/dsh-qms-capa) | QMS NCR 入库、批次别名、影响评估、CAPA 与 8D。 | `0.1.0-alpha.12` | `dsh plugin --profile <profile> add dsh-qms-capa` |

### 关务与物流 Trade & Logistics

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-hs-candidate`](https://github.com/PerryLink/dsh-hs-candidate) | HS Top3 候选、12 要素完整性、RVC 与税则版本门。 | `0.1.0-alpha.12` | `dsh plugin --profile <profile> add dsh-hs-candidate` |
| [`dsh-freight-audit`](https://github.com/PerryLink/dsh-freight-audit) | 运费 ratecard 版本、账单审计、recovery 汇总与差异导出。 | `0.1.0-alpha.13` | `dsh plugin --profile <profile> add dsh-freight-audit` |

### 文档与模型 Docs & Models

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-docx-redline`](https://github.com/PerryLink/dsh-docx-redline) | DOCX 结构检查、逐字节 roundtrip 与单 run 文本替换。 | `0.1.0-alpha.13` | `dsh plugin --profile <profile> add dsh-docx-redline` |
| [`dsh-ifc-qto`](https://github.com/PerryLink/dsh-ifc-qto) | IFC 构件/工程量清单与 CSV 导出。 | `0.1.0-alpha.13` | `dsh plugin --profile <profile> add dsh-ifc-qto` |

### 校验工具 Verify Utilities

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-policy-ledger`](https://github.com/PerryLink/dsh-policy-ledger) | 只读安装诊断：能力快照、tarball 断言与安装日志分类。 | `0.2.0-alpha.13` | `dsh plugin --profile <profile> add dsh-policy-ledger` |
| [`dsh-pim-lint`](https://github.com/PerryLink/dsh-pim-lint) | PIM 目录 lint：必填、重复 SKU、GTIN 校验位与价格。 | `0.1.0-alpha.11` | `dsh plugin --profile <profile> add dsh-pim-lint` |
| [`dsh-eval-pack`](https://github.com/PerryLink/dsh-eval-pack) | 公开/合成 eval-pack lint 与确定性 JSON 评分。 | `0.1.0-alpha.11` | `dsh plugin --profile <profile> add dsh-eval-pack` |

两个 suite 也有 Gitee / GitCode 镜像：[dsh-finops-suite](https://gitee.com/perrylink/dsh-finops-suite) / [dsh-contract-suite](https://gitee.com/perrylink/dsh-contract-suite)。

## 场景文章

- [从票据到差旅：一条可复核的财务运营链怎么跑](https://perrylink.github.io/dsh-plugins/articles/finops-suite.html)

## 一键安装 suite

| Suite | 包含 | 版本 | 安装 |
|---|---|---:|---|
| [`dsh-finops-suite`](https://github.com/PerryLink/dsh-finops-suite) | `dsh-einvoice` + `dsh-bankrec` + `dsh-ap-three-way` + `dsh-travel-recon` | `0.1.0-alpha.8` | `dsh plugin --profile <profile> add dsh-finops-suite` |
| [`dsh-contract-suite`](https://github.com/PerryLink/dsh-contract-suite) | `dsh-legal-intake` + `dsh-legal-clause` | `0.1.0-alpha.7` | `dsh plugin --profile <profile> add dsh-contract-suite` |

## 平台

| 平台 | 地址 | 说明 |
|---|---|---|
| GitHub | https://github.com/PerryLink/dsh-plugins | 本索引 + 各包仓 |
| npm | https://www.npmjs.com/~perrylink | 15 个裸名 `dsh-*` 包 |
| Gitee | https://gitee.com/perrylink/dsh-plugins | 中文索引 + 5 个旗舰镜像 |
| GitCode | https://gitcode.com/PerryLink/dsh-plugins | 中文索引 + 3 个旗舰镜像 |
| 文档 | https://perrylink.github.io/dsh-plugins/ | 15 个包页 + 索引 |

## 命名说明

- 所有包使用裸名，不再使用 `@perrylink/` scope。
- 原 `dsh-eval-harness` 裸名由其他发布者占用，项目已改名为 **`dsh-eval-pack`**；旧 scoped 包 `@perrylink/dsh-eval-harness` 已弃用并指向新包。
- 原 scoped 包已发布最终 redirect README 并 `npm deprecate`，指向对应裸名包。

## 边界

- 全部 public/synthetic、partial、`counted=false`、无 GA。
- 不接受客户数据进入仓库、测试或 fixtures；只接受 MIT/Apache 公开样例。
- 不把 alpha 描述为 production-ready、customer-validated 或准确率已证明。

Apache-2.0。详见 [PUBLIC-ONLY-BOUNDARY.md](PUBLIC-ONLY-BOUNDARY.md)。
