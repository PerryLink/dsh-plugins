# 从票据到差旅：一条可复核的财务运营链怎么跑

> 这是一篇场景文，不是产品承诺。文中 4 个插件都是 **public/synthetic、alpha、not counted、not GA**；没有客户数据，也没有“生产可用”结论。

月末财务最耗时的，往往不是“算”，而是把四类材料对齐：

1. 收到的电子发票（OFD/XML）；
2. 银行流水（CAMT.053 / MT940 / CSV）；
3. 采购发票、PO、GRN 三单；
4. 差旅订单、发票、卡流水。

这四类材料格式不同、口径不同，最后却要落到同一套可复核的底稿里。下面这条链，目标不是“让 AI 直接给结论”，而是**让每一步都能复算、能指出差异、能留下文件**。

## 0. 先装一个 suite，或者按需拆开

一次装齐：

```sh
dsh plugin --profile <profile> add dsh-finops-suite
```

它只做一件事：把 4 个成员包按精确版本装好，并插入 4 行 Cordis 配置。suite 本身没有代码，也不复制成员的验收数据。

只想用其中一段，就单独装：

```sh
dsh plugin --profile <profile> add dsh-einvoice
dsh plugin --profile <profile> add dsh-bankrec
dsh plugin --profile <profile> add dsh-ap-three-way
dsh plugin --profile <profile> add dsh-travel-recon
```

## 1. 电子发票：先入库，再谈查询

`dsh-einvoice` 处理文件级发票：

- `invoice.ingest`：一个本地 OFD/XML，算 SHA-256，原样存本地，按字节幂等；
- `invoice.parse`：解析旧 OFD 或数电票 XML，返回八个字段、明细行、证据和未知字段；
- `invoice.dedup`：按发票号，或“销售方 + 日期 + 金额”归并重复；
- `invoice.query`：按主体、期间、生命周期或文本查本地票池；
- `invoice.archive` / `invoice.check` / `invoice.restore`：生成归档 ZIP，校验，恢复。

它**不做** OCR、税局查验、回执、申报，也不把本地回执说成“税局已验”。`invoice.record_receipt` 的 `verification_source=local_receipt`、`tax_verified=false` 是明确写死的。

一个最小动作：

```text
invoice.ingest  ->  invoice.parse  ->  invoice.query
```

先把票池建起来，再去对账；不要一上来就让模型“读发票图片”。

## 2. 银行流水：三表底稿，先对余额

`dsh-bankrec` 接收 CSV/GL、CAMT.053、MT940：

- `bankrec.ingest` / `ingest_camt` / `ingest_mt940`；
- `bankrec.reconcile_camt`：期初 + 明细 = 期末；多账户时必须给 `account_id`；
- `bankrec.match`：银行行与 GL 行 1:1 匹配；
- `bankrec.export`：银行 / GL / 匹配三张表。

先做余额恒等式，再做 1:1 匹配。余额不平，后面的匹配结果没有意义。它不连银行 API，也不做 PDF/OCR 流水。

## 3. 三单匹配：把“例外”单独拿出来

`dsh-ap-three-way` 做发票、PO、GRN 三单匹配：

- 价格容差默认 1%，数量单独校验；
- `ap.match` 输出匹配与例外；
- `ap.export` 输出 Matches / Exceptions 两张表。

这张例外表才是财务要看的：价格超容差、数量不一致、缺 PO、重复发票。它不替人做付款决定，也不写回 ERP。

## 4. 差旅：重复报销和只读政策

`dsh-travel-recon` 把订单、发票、卡流水放在一起：

- `travel.ingest` / `travel.match`：三路对账；
- `travel.duplicate_check`：同一行程的重复发票/卡流水；
- `travel.policy_check`：只读的金额上限、发票缺失检查；
- `travel.export`：台账 xlsx。

政策检查是只读的：只提示，不审批、不驳回、不记账。

## 5. 这条链的“可复核”在哪里

- 每个插件都输出**文件**（xlsx / JSON / CSV / ZIP），不是只回一段话；
- 每个计算都有输入、输出和错误路径；
- 每个包的 `ACCEPTANCE.csv` 都标了 `counted=false`，只代表公开合成样例通过，不代表客户准确率；
- 所有 fixture 都是 public/synthetic 或 MIT/Apache 公开样例；
- 不联网、不调用模型，规则算的就是规则算的。

## 6. 边界

这条链**不能**做：税局查验/申报、OCR 扫描件、银行直连、ERP 过账、真实客户准确率、GA/生产可用承诺。它适合的场景是：先把“票据→流水→三单→差旅”的本地底稿跑通，确认字段、口径、差异可解释，再决定哪一段值得接入真实系统。

安装入口：

- suite：`dsh plugin --profile <profile> add dsh-finops-suite`
- 索引与文档：<https://perrylink.github.io/dsh-plugins/>
- 源码：<https://github.com/PerryLink/dsh-finops-suite>

先跑通一条链，再按需拆开。
