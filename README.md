# PerryLink DSH 领域插件

> **Status: alpha / public-synthetic / partial / not counted / not GA.** 本索引只列公开合成演示；没有客户证据、客户数据或生产可用声明。SKU-11/14 永久 DROP。

15 个 DSH 插件，按 6 个业务族组织。每个包都是独立的 npm 包，用 `dsh plugin add` 安装。

## 安装

```sh
dsh plugin --profile <profile> add @perrylink/dsh-ghg
```

要求 DSH `>=0.2.1-rc.3 <0.3.0`、Node `>=24.9 <25`。

## 索引

### 财务运营 Finance Ops

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-einvoice`](https://github.com/PerryLink/dsh-einvoice) | 文件级中国电子发票（OFD/XML）入库、解析、去重与本地归档。 | `0.2.0-alpha.2` | `dsh plugin --profile <profile> add @perrylink/dsh-einvoice` |
| [`@perrylink/dsh-bankrec`](https://github.com/PerryLink/dsh-bankrec) | 银行流水/GL/CAMT.053/MT940 入库、对账与三表底稿。 | `0.1.0-alpha.5` | `dsh plugin --profile <profile> add @perrylink/dsh-bankrec` |
| [`@perrylink/dsh-ap-three-way`](https://github.com/PerryLink/dsh-ap-three-way) | 发票/PO/GRN 三单匹配、容差与例外底稿。 | `0.1.0-alpha.2` | `dsh plugin --profile <profile> add @perrylink/dsh-ap-three-way` |
| [`@perrylink/dsh-travel-recon`](https://github.com/PerryLink/dsh-travel-recon) | 差旅订单/发票/卡流水对账、去重与只读政策检查。 | `0.1.0-alpha.3` | `dsh plugin --profile <profile> add @perrylink/dsh-travel-recon` |

### 法务运营 Legal Ops

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-legal-intake`](https://github.com/PerryLink/dsh-legal-intake) | 法务需求 EML 收件、线程去重与台账导出。 | `0.1.0-alpha.1` | `dsh plugin --profile <profile> add @perrylink/dsh-legal-intake` |
| [`@perrylink/dsh-legal-clause`](https://github.com/PerryLink/dsh-legal-clause) | 合同条款树、playbook 映射与未解决报告。 | `0.1.0-alpha.3` | `dsh plugin --profile <profile> add @perrylink/dsh-legal-clause` |

### 可持续与质量 ESG & Quality

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-ghg`](https://github.com/PerryLink/dsh-ghg) | 用电活动入库、GHG 计算、逐行复算、底稿与部分 ESRS 包。 | `0.1.0-alpha.7` | `dsh plugin --profile <profile> add @perrylink/dsh-ghg` |
| [`@perrylink/dsh-qms-capa`](https://github.com/PerryLink/dsh-qms-capa) | QMS NCR 入库、批次别名、影响评估、CAPA 与 8D。 | `0.1.0-alpha.3` | `dsh plugin --profile <profile> add @perrylink/dsh-qms-capa` |

### 关务与物流 Trade & Logistics

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-hs-candidate`](https://github.com/PerryLink/dsh-hs-candidate) | HS Top3 候选、12 要素完整性、RVC 与税则版本门。 | `0.1.0-alpha.3` | `dsh plugin --profile <profile> add @perrylink/dsh-hs-candidate` |
| [`@perrylink/dsh-freight-audit`](https://github.com/PerryLink/dsh-freight-audit) | 运费 ratecard 版本、账单审计、recovery 汇总与差异导出。 | `0.1.0-alpha.4` | `dsh plugin --profile <profile> add @perrylink/dsh-freight-audit` |

### 文档与模型 Docs & Models

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-docx-redline`](https://github.com/PerryLink/dsh-docx-redline) | DOCX 结构检查、逐字节 roundtrip 与单 run 文本替换。 | `0.1.0-alpha.4` | `dsh plugin --profile <profile> add @perrylink/dsh-docx-redline` |
| [`@perrylink/dsh-ifc-qto`](https://github.com/PerryLink/dsh-ifc-qto) | IFC 构件/工程量清单与 CSV 导出。 | `0.1.0-alpha.4` | `dsh plugin --profile <profile> add @perrylink/dsh-ifc-qto` |

### 校验工具 Verify Utilities

| 包 | 用途 | 版本 | 安装 |
|---|---|---:|---|
| [`@perrylink/dsh-policy-ledger`](https://github.com/PerryLink/dsh-policy-ledger) | 只读安装诊断：能力快照、tarball 断言与安装日志分类。 | `0.2.0-alpha.2` | `dsh plugin --profile <profile> add @perrylink/dsh-policy-ledger` |
| [`@perrylink/dsh-pim-lint`](https://github.com/PerryLink/dsh-pim-lint) | PIM 目录 lint：必填、重复 SKU、GTIN 校验位与价格。 | `0.1.0-alpha.1` | `dsh plugin --profile <profile> add @perrylink/dsh-pim-lint` |
| [`@perrylink/dsh-eval-harness`](https://github.com/PerryLink/dsh-eval-harness) | 公开/合成 eval-pack lint 与确定性 JSON 评分。 | `0.1.0-alpha.1` | `dsh plugin --profile <profile> add @perrylink/dsh-eval-harness` |

## 平台

| 平台 | 地址 | 说明 |
|---|---|---|
| GitHub | https://github.com/PerryLink/dsh-plugins | 本索引 + 各包仓 |
| npm | https://www.npmjs.com/org/perrylink | 15 个 `@perrylink/dsh-*` 包 |
| Gitee | https://gitee.com/perrylink/dsh-plugins | 中文只读镜像（待建） |
| GitCode | https://gitcode.com/PerryLink/dsh-plugins | 中文聚合（待建） |
| 文档 | https://perrylink.github.io/ | 15 个包页（待建） |

## 边界

- 全部 public/synthetic、partial、`counted=false`、无 GA。
- 不接受客户数据进入仓库、测试或 fixtures；只接受 MIT/Apache 公开样例。
- 不把 alpha 描述为 production-ready、customer-validated 或准确率已证明。

Apache-2.0。详见 [PUBLIC-ONLY-BOUNDARY.md](PUBLIC-ONLY-BOUNDARY.md)。
