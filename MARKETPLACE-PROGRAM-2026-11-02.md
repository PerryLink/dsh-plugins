# DSH 插件市场：现状盘点与实施方案

> 版本：2026-11-02 · 状态：待执行 · 适用仓库：`PerryLink/dsh-plugins` 及其 17 个包仓、`PerryLink/dsh-catalog`、`PerryLink/dsh-kit`、62 个 checker 仓
> 本文只写"要做什么、怎么做、怎么验收"。所有数字均可在文末【附录 C】用命令复算。

---

## 0. 一页结论

1. **供给已经足够多，分发几乎为零。** 125 行家族里 114 个 active，17 个包已发版、307 个测试全绿、111 行验收证据、62 个 checker 有真实测试；但 15 个 domain 包的 npm 月下载量是 **0**，产品内**搜不到**任何一个包。
2. **原因不是"没人要"，是"入口不存在"。** DSH 默认不带任何插件索引源；Web GUI 的 Discover 要先开实验开关再手填 URL；而我们至今**没有产出产品能读的 format 1 `index.json`**（我们产的是 Desktop 的 catalog-provider 格式）。
3. **对非程序员，缺的不是模型，是包装。** 21 个 T1 工具（文件进→交付物出）**没有一个**在默认安装名单里；108/125 没有中文名；15 个包**没有任何随包样例**，README 的"示例"是 `pnpm test`。
4. **正确的打法不是"再写 20 个包"，而是"职能包 + 任务流 + 首跑三件套"，同时向宿主提 5 条硬需求。**
5. **本方案 8 周，5 个阶段**：P0 市场可见（1 周）→ P1 首跑三件套（2 周）→ P2 职能包（3 周）→ P3 断层补齐（2 周）→ P4 宿主需求（并行，需上游）。

---

## 1. 现状盘点

### 1.1 资产清单

| 资产 | 数量 | 说明 |
|---|---:|---|
| 家族条目（`family.json`） | **125** | active 114 / frozen 8 / retired 3 |
| 已发布 npm 包 | **15 + 2** | 15 个 domain 包 + 2 个 suite |
| 合规核查器（checker 仓） | **62** | 全部在 npm，128 个测试文件 |
| 市场记录（catalog） | **126** | 122 共享 + 4 catalog-only（部署产物 `deploy/artifacts/v1/plugins.json`） |
| 安装器名单 | **96 / 117** | `plugins.txt` 96 个 spec；`family.txt` 117 行 |
| 文档站页面 | **146** | `docs/` 下 HTML（含 125 个 family 页 + 17 个包页） |

按安装范围（`installScope`）：

| 范围 | 数量 | 含义 |
|---|---:|---|
| `mainline-opt-in` | 53 | 默认不装、需显式选择（全部是 checker） |
| `mainline-default` | 39 | 一键安装默认带 |
| `domain` | 17 | 15 个 domain 包 + 2 个 suite |
| `catalog-only` | 10 | 只在 catalog 收录 |
| `infrastructure` | 3 | dsh-kit / dsh-catalog / dsh-plugin-certification |
| `excluded-retired` | 3 | 已退役 |

按类别：compliance 59、business-ops 13、developer-tools 10、workflow 10、integrations 5、interface 5、其余 23。

### 1.2 质量水位（已达成）

| 指标 | 现状 |
|---|---|
| domain 包测试 | **307 个通过 / 0 失败**（15 包，含每个包的 `plugin-smoke.test.mjs`，合计注册 109 个工具） |
| domain 验收行 | **111 行**（9 列 CSV：req_id/metric/threshold/actual/script/evidence_sha256/pass/source/counted） |
| checker 测试 | 128 个测试文件；62 个包全部有 `tests/`，60 个包恰好 2 个文件 |
| checker 验收 | **62/62 已补 `ACCEPTANCE.csv`**（2026-11-02 由真实 `vitest run` 产出，2 行/包） |
| 发布完整性 | 17/17 有 npm provenance（SLSA v1）、GitHub pre-release 带 SHA256SUMS + SBOM |
| 镜像 | Gitee 5 旗舰 + 2 suite；GitCode 3 旗舰 + 2 suite（git/tag/release 记录） |
| 文档一致性 | `packages.json` 单源；docs CI 绿；站点与本地同步 |

### 1.3 分发现状（问题所在）

| 指标 | 数字 | 判断 |
|---|---:|---|
| 15 个 domain 包 npm 月下载 | **0**（逐个查） | 无人使用 |
| 12 个 domain 仓 star/fork/watcher/issue | **0** | 无外部感知 |
| checker 月下载（抽样） | 1,571 / 1,789 / 1,666 | **真实需求在 checker 线** |
| `dsh-kit` 月下载 | 111 | 安装器被少量使用 |
| `dsh-catalog` 月下载 | 64 | 市场数据几乎无人消费 |
| 产品内可发现性 | **0** | 宿主无内置索引源；我们没有 format 1 index |

**结论：需求存在（checker 1,500+/月），但我们的"旗舰"和"市场"没有进入任何用户路径。**

### 1.4 非程序员可用性（按 Package Standard v1 估算）

| 层 | 判据 | 数量 | 代表 |
|---|---|---:|---|
| **T1** | 手上文件进 → 交付物出，零配置 | **21** | einvoice、bankrec、ap-three-way、travel-recon、legal-clause、qms-capa、freight-audit、hs-candidate + 9 个新工具 |
| **T2** | 需要规则库或专业解读 | 54 | 53 个核心 checker + legal-clause 的重度用法 |
| **T3** | 开发者/运行时/安装器 | 50 | 43 主线 + 3 基建 + 2 suite + 2 开发者包 |

按 PS1 打分（10 分制，见附录 B），**当前 15 个 domain 包与 62 个 checker 的首跑项全部为 0 分，理论上限 6 分**；主要失分点：
- 无随包样例（`files[]` 不含 fixtures；TROUBLESHOOTING 自述样本 "not shipped"）
- 无可复制的一句话话术（README 的 Examples 是 `pnpm test`）
- 权限写的是工程语言（`R0/R1`、`danger-full-access`），不是"会读取你的合同"
- 108/125 **没有中文名**

### 1.5 宿主能力边界（决定了哪些必须上游做）

| 能力 | 现状 | 影响 |
|---|---|---|
| 安装入口 | `npx @deepseek-ai/dsh web` + 选磁盘工作区 | 非程序员第 1 步就卡 |
| 插件市场 | 需开实验包「自定义插件索引」；**DSH 不内置索引源** | 默认界面看不到任何插件 |
| index 格式 | format 1 `index.json`（含 `versions[]`/npm/git/engines.dsh） | 我们**尚未产出** |
| 检索 | MiniSearch，支持 CJK 二元组；名称/标题 3 倍权重 | 中文名缺失会直接搜不到 |
| 插件 UI | 只能写 React（无声明式 schema） | 非技术插件做不了表单/向导 |
| 交付物 | 拖入文件 ✅；docx/pptx 只读转 PDF，**无 Office 写回** | 产出物拿不回去 |
| 权限话术 | 沙箱 / `danger-full-access` / 逐次批准 | 术语劝退 |
| 插件形态 | tools / prompts / skills / bundles（`dsh.bundle.patch`） | 我们已全部具备 |

---

## 2. 竞品对标

| 产品 | 人群 | 扩展单元 | 发现 | 信任 | 首用 | 可借鉴 |
|---|---|---|---|---|---|---|
| **Claude Code / Cowork** | 程序员→企业职能 | plugin（技能+子代理+钩子+MCP） | Discover 按**职能**分市场 | 管理员黑白名单、按组可见 | `/plugin` 加市场→装 | 按职能分包；管理员预装 |
| **Codex** | 开发者→办公 | plugin（技能+MCP+浏览器） | `/plugins` 11 分类、**角色套餐** | 目录审核、逐次授权 | 点装→OAuth→新会话 | 角色套餐；"新会话生效"要明示 |
| **Hermes**（Nous 开源 Agent） | 极客自部署 | 技能（成功后沉淀） | 无市场，GitHub | MIT 可审计、无遥测 | 一条 curl | 成功会话一键存为技能 |
| **WorkBuddy**（腾讯 AI 工作台） | **全行业白领** | 工作台模板=界面+提示词+连接器 | 「灵感」12 类场景、评分/下载 | 评分、下载量、官方/伙伴标 | **「做同款」一键复制** | **最接近目标形态** |
| **Dify** | 半技术+企业 | 插件 + DSL 模板 | Marketplace 搜索/分类 | **S/A/B/C 安全分级**、逐版本重扫 | 一键装 | 安装前风险警示 |
| **Shopify App Store** | 商家 | App | 品类 + 评分 + 编辑推荐 | 强制审核 + BFS 徽章 | 一键装 + Setup guide | 评分门槛、相对排名 |
| **Obsidian** | 知识工作者 | 社区插件 | 内置浏览 + 下载量排序 | 人工审核 | 一键安装 | 默认受限模式 |
| **VS Code** | 程序员 | 扩展 | 搜索 + 安装量 | 发布者域名验证 | 一键安装 | 反例：只信安装量会翻车 |

**7 条硬结论**：职能包而非商店；首页任务流而非搜索框；信任三件套（分级+权限披露+版本重扫）；首跑零配置；让用户产出供给；权限用业务语言；分发借船。

---

## 3. 目标、原则与边界

### 3.1 目标（8 周）

| # | 目标 | 度量 |
|---|---|---|
| G1 | 产品内可发现 | 12 条大白话查询中 ≥8 条 top-3 命中 |
| G2 | 非程序员可首跑 | 5 人测试中 ≥3 人在 15 分钟内完成一次真实任务，且不开终端 |
| G3 | 职能包可交付 | 5 个职能包各自有一个端到端场景可跑通 |
| G4 | 扩品有标准 | 新包上线前 PS1 打分 ≥8/10 |

### 3.2 原则

1. **不砍包**：125 个全部保留，按任务族重新组织与命名。
2. **先包装后扩品**：新包必须达到 PS1 ≥8 才发布；现有包按 T1 优先补齐。
3. **双轨**：插件侧自治（index、标准、样例、职能包）+ 宿主侧需求（E1–E5）。
4. **真实证据**：所有截图/验收必须来自真实运行；禁止拼接或占位。
5. **中文优先**：面向非程序员的主界面、任务名、错误话术一律中文，英文作为次选。

### 3.3 边界

- 我们**不做推广**（用户定位是插件开发者）。市场动作限于：把包做好、把 index 做好、把文档做好，让产品与用户自己能发现。
- 我们**不能改宿主**：E1–E5 以"需求/上游 PR"形式推进，不阻塞 P0–P3。

---

## 4. 实施方案

### Phase 0（第 1 周）：让市场"存在"

#### A1 生成 format 1 `index.json`
- **做法**：写 `scripts/build-market-index.mjs`，从 `family.json` + `packages.json` + 各包 `package.json` 生成：
  ```json
  {"format":1,"plugins":[{"id":"dsh-einvoice","title":"发票查重","titleZh":"发票查重",
    "description":"…","category":"finance","tags":["发票","OFD","查重"],
    "versions":[{"version":"0.2.0-alpha.11","npm":"dsh-einvoice","engines":{"dsh":">=0.2.1-rc.3 <0.4.0"}}]}]}
  ```
- **产出**：`04-build/dsh-plugins/market/index.json` + 构建脚本 + schema 校验测试。
- **验收**：`node scripts/build-market-index.mjs --check` 通过；125 条齐全；字段齐全率 100%；能被宿主 `plugin-market` 的解析器加载（用宿主仓的 schema 做单测）。
- **工时**：2 人日。**依赖**：无。

#### A2 托管 index + "如何添加索引源"一页
- **做法**：把 `market/index.json` 发布到 `perrylink.github.io/dsh-plugins/market/index.json`（随站点部署）；写 `docs/market-setup.html`（3 步 + 截图）。
- **产出**：稳定 URL + 一页指引。
- **验收**：URL 可访问、Content-Type 正确、CORS 允许；页面步骤可在 2 分钟内完成。
- **工时**：0.5 人日。

#### A3 补 108 个中文名 + 关键词
- **做法**：为 125 条补 `displayNameZh`、`titleZh`、`tags`（每包 3–6 个中文同义词）；写 `scripts/check-zh-names.mjs` 门禁。
- **产出**：`family.json`/`market/index.json` 更新；门禁脚本。
- **验收**：125/125 有中文名；门禁在 CI 中拦住缺失。
- **工时**：1 人日（批量起草 + 人工复核）。

#### A4 任务族映射
- **做法**：定义 10 个任务族（财务报销、人力资源、采购供应链、法务合同、质量生产、关务物流、行政办公、教育培训、医疗健康、零售电商），给每包打 `taskFamily` + `roles[]` + `industries[]`。
- **产出**：数据字段 + 生成页面。
- **验收**：125 条全部落到某一族（允许"其他"≤5 条）。
- **工时**：1 人日。

#### A5 站点"按任务浏览"首页
- **做法**：新增 `docs/market.html`：10 个任务族卡片 → 族内任务列表 → 详情页；搜索框支持中文同义词。
- **产出**：页面 + 生成脚本。
- **验收**：从首页 3 次点击内到达任一包详情；搜索"对账/核账"都能命中 bankrec。
- **工时**：1 人日。

### Phase 1（第 2–3 周）：21 个 T1 包的"首跑三件套"

#### B1 Package Standard v1 落地
- **做法**：把附录 B 写成 `docs/PACKAGE-STANDARD.md`，含检查清单与示例。
- **验收**：文档合入；README 链接。
- **工时**：0.5 人日。

#### B2 自动打分脚本
- **做法**：`scripts/score-packages.mjs`：按 PS1 的 7 项对 125 包打分，输出 CSV（name/version/s1..s7/total/grade/missing）。
- **验收**：能跑全量；对 15 个 domain 包给出与本文一致的分数（当前 ≤6）。
- **工时**：1.5 人日。

#### B3 样例入包（T1 21 个）
- **做法**：每包新增 `samples/quickstart/input/`（合成、脱敏、≤500KB）与 `samples/quickstart/expected/`（金标 JSON/文本 + 二进制 SHA-256）；`package.json` 的 `files` 加 `samples`；新增 `dsh.demo` 字段：
  ```json
  "dsh":{"demo":{"sample":"samples/quickstart/input/invoice.ofd",
    "prompt":"用自带样例跑一次查重，把重复的那张标出来",
    "expect":"samples/quickstart/expected/duplicates.json",
    "screenshot":"docs/assets/quickstart.png",
    "reads":["用户指定文件"],"writes":["$DSH_HOME/dsh-einvoice"],"network":false,"external":[]}}
  ```
- **验收**：`npm pack --dry-run --json` 可见样例；跑样例产出与金标一致。
- **工时**：21 包 × 0.5 = 10.5 人日（可分批）。

#### B4 一句话话术
- **做法**：每包写 1 句可复制的中文提示词（第一人称 + 真实单据 + 期望产出），同步 README-zh 与详情页。
- **验收**：21/21 有 `dsh.demo.prompt` 且不含 `pnpm test`。
- **工时**：2 人日。

#### B5 权限四行 + 错误人话
- **做法**：按模板补 README 权限块；源码错误信息改 `<一句人话>（E_XXX）｜下一步：<动作>`；TROUBLESHOOTING ≥3 条。
- **验收**：PS1 权限项与错误项满分；随机抽 3 个错误码展示符合格式。
- **工时**：3 人日。

#### B6 quickstart 真实截图
- **做法**：用 `render-capture.py` 渲染真实运行输出；`screenshots.json` 记 `command`/`run_at`/`output_sha256`。
- **验收**：21 张截图，哈希两两不同，命令非 `pnpm test`。
- **工时**：2 人日。

### Phase 2（第 4–6 周）：职能包

每个职能包 = 3–5 个插件 + 一个"做同款"端到端场景 + 一套样例数据 + 一页引导。

| # | 职能包 | 成员 | 端到端场景 | 工时 |
|---|---|---|---|---|
| C1 | 财务包 | einvoice、bankrec、ap-three-way、travel-recon | 发票 → 查重 → 三单匹配 → 银行对账 → 归档 | 3 人日 |
| C2 | 合同包 | legal-intake、legal-clause、新包「合同到期续签」 | 收合同 → 拆条款 → 查缺失 → 记到期 → 提醒 | 3 人日 |
| C3 | 采购包 | tender-requirements、bid-qual-check、新包「询价比价」「供应商准入」 | 需求 → 询价 → 比价 → 准入台账 | 4 人日 |
| C4 | HR 包 | 新包「劳动合同条款」「入离职清单」「考勤加班合规」 | 入职 → 合同审查 → 考勤核对 | 4 人日 |
| C5 | 建筑包 | ifc-qto、新包「进度款审核」「竣工结算资料」 | 模型 → 工程量 → 进度款 → 结算资料 | 4 人日 |

**验收（每个包）**：一条命令 / 一句话跑通场景；产出物可下载；样例数据可复现；详情页有"做同款"按钮（站点侧）。

### Phase 3（第 7–8 周）：断层补齐（先做 6 个）

| # | 新包 | 用途 | 复用 | 工时 |
|---|---|---|---|---|
| D1 | **PDF/扫描件表格入口** | PDF → 结构化表（所有 T1 的上游断点） | table-ingest + pdfjs | 4 人日 |
| D2 | 询价比价单 | 需求→询价单、报价归一 | tender-requirements + excel-reconcile | 3 人日 |
| D3 | 应收账龄 | 应收→账龄→催收清单 | bankrec + excel-reconcile | 3 人日 |
| D4 | 劳动合同条款 | 必备条款/试用期/期限 | legal-clause（换劳动 playbook） | 3 人日 |
| D5 | 进口单证核对 | 进口单证字段一致 | customs-doc-check + hs-candidate | 3 人日 |
| D6 | 进度款审核 | 已完工程量 vs 申报 | ifc-qto + ap-three-way | 3 人日 |

**验收**：全部达到 PS1 ≥8；每个包有 ACCEPTANCE ≥3 行与真实截图。

### Phase 4（并行）：宿主侧需求

| # | 需求 | 交付形式 | 优先级 |
|---|---|---|---|
| E1 | 市场默认可见 + 内置官方索引源 | 上游 issue/PR（指向 `official-bundles` 与 `plugin-market`） | 最高 |
| E2 | 取消"先选磁盘目录"或给默认沙盒 | 上游 issue | 高 |
| E3 | 声明式 UI schema（JSON 声明表单/按钮） | 上游 RFC（附我们的 3 个用例） | 高 |
| E4 | Office 写回（docx/xlsx 可下载） | 上游 issue | 高 |
| E5 | 人话权限档 | 上游 issue（附文案建议） | 中 |

> 策略：每个需求配一个最小可运行示例（我们插件侧的 demo），降低上游评估成本；先发 issue 汇总，再逐条 PR。

### Phase 5：度量与实验

| # | 实验 | 最小动作 | 判据 |
|---|---|---|---|
| F1 | 检索命中 | 12 条大白话查询跑 `plugin_market` | ≥8/12 top-3 命中 |
| F2 | 5 人首跑 | 预装环境 + einvoice + 2 张真票 | ≥3/5 完成且没开终端 |
| F3 | 落地页转化 | 一页"3 分钟发票查重" | 200 UV ≥10 次复制提示词 |

---

## 4bis. 执行进度（2026-11-02 晚）

| 任务 | 状态 | 证据 |
|---|---|---|
| A1 format 1 index | ✅ 完成 | `market/index.json`：124 个插件、124 个中文标题、npm source + engines；`scripts/build-market-index.mjs`（含 `--check`） |
| A2 托管 index | ✅ 完成 | 线上 `https://perrylink.github.io/dsh-plugins/market/index.json`（HTTP 200, format 1, 124 条） |
| A3 108 个中文名 | ✅ 完成 | `data/zh-meta.json` 125 条；`check-docs` 断言 125/125 有中文名 |
| A4 任务族映射 | ✅ 完成 | 11 个任务族；`docs/market.html` 按族分组（122 个非退役插件） |
| A5 按任务浏览页 | ✅ 完成 | `docs/market.html`（中文搜索、同义词、族内计数） |
| B1 Package Standard v1 | ✅ 完成 | `docs/PACKAGE-STANDARD.md`（8 块 + 首跑三件套 + 权限四行 + 打分表） |
| B2 打分脚本 | ✅ 完成 | `scripts/score-packages.mjs`（离线，125 条，输出 CSV / `--gate`） |
| B3–B6 T1 首跑三件套 | ⏳ 进行中 | 21 个 T1 包均 0 分起步（缺样例/话术/权限块） |
| C/D/E/F | ⏳ 未开始 | 依赖 B 阶段 |

**F1 实测（bigram 检索模拟，接近宿主 CJK 分词）**：10 条大白话查询 **命中 8/10**；未命中的「考勤加班」「补货」正是 P3 计划里的新包（HR 考勤、零售补货），说明索引本身可用，缺口在供给。

## 5. 排期

| 周 | 主线 | 交付 |
|---|---|---|
| W1 | P0 市场可见 | index.json、托管 URL、108 中文名、任务族、market.html |
| W2 | P1（上） | PS1 文档、打分脚本、T1 前 10 包样例 + 话术 |
| W3 | P1（下） | T1 后 11 包样例 + 权限/错误 + 21 张截图 |
| W4 | P2（上） | 财务包、合同包 |
| W5 | P2（中） | 采购包、HR 包 |
| W6 | P2（下） | 建筑包 + 5 个场景视频/截图 |
| W7 | P3（上） | PDF 表格入口、询价比价、应收账龄 |
| W8 | P3（下） | 劳动合同、进口单证、进度款 + F1/F2 实验报告 |

**里程碑**：M1（W1 末）产品内能搜到；M2（W3 末）21 个 T1 可 3 分钟首跑；M3（W6 末）5 个职能包可用；M4（W8 末）6 个新包上线 + 实验结论。

---

## 6. 分工

| 角色 | 负责 |
|---|---|
| 我（agent） | 代码、生成脚本、文档、发布、证据 |
| 子代理 | 批量包改造（按包分组）、竞品/用户研究 |
| 宿主团队（上游） | E1–E5 |
| 你（用户） | 决策项（§9）、行业优先级、是否投上游 PR |

---

## 7. 风险登记册

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| 宿主不采纳 E1（市场默认不可见） | 高 | 高 | 先做站点版市场 + 索引 URL 指引；同时把 index 做成任何客户端都能读 |
| 样例含真实数据 | 中 | 高 | 只用合成/公开样例；入库前跑 PII 扫描 |
| 21 包改造拖期 | 中 | 中 | 按 T1 价值排序，先做 8 个高频（发票/对账/合同/报关/质量） |
| PS1 过严导致新包发不出 | 中 | 中 | 设"黄灯"通道：≥6 可发 alpha，≥8 才进市场首页 |
| 中文名/话术质量参差 | 中 | 中 | 人工复核 + 术语表 |
| 职能包只是"打包"没有场景 | 中 | 高 | 每个包必须有可跑通的端到端样例，否则不算完成 |
| 62 个 checker 维护成本 | 高 | 中 | 暂不合并（已评估 No-go）；先统一文件与证据标准 |

---

## 8. 验收总表（Gate）

| Gate | 条件 |
|---|---|
| G-A | `market/index.json` 125 条、字段齐全、可被宿主 schema 解析 |
| G-B | 125/125 有中文名；`check-zh-names` 绿 |
| G-C | 21 个 T1 包 PS1 ≥8，且样例在 tarball 内可验证 |
| G-D | 5 个职能包各有一个端到端场景，一条命令跑通 |
| G-E | 6 个新包 PS1 ≥8，ACCEPTANCE ≥3 行，截图真实 |
| G-F | F1 ≥8/12；F2 ≥3/5；F3 ≥10 次复制 |
| G-G | docs CI 绿；catalog 版本与 npm 一致；站点同步 |

---

## 9. 需要你决策

1. **职能包顺序**：默认 财务 → 合同 → 采购 → HR → 建筑，是否调整？
2. **新包优先级**：D1（PDF 入口）是否同意排第一（它是所有 T1 的上游）？
3. **是否投上游 PR**：E1/E3/E4 需要写 issue/PR，是否授权？
4. **是否允许"黄灯"发布**：PS1 6–7 分的包可以发 alpha 但不进市场首页？

---

## 附录 A：10 个任务族与 30 个任务名

| 任务族 | 任务名示例 |
|---|---|
| 财务报销 | 发票三单匹配、银行流水对账、月结清单与分录草稿 |
| 人力资源 | 简历初筛与面试问题、入转调离清单核对、考勤异常核对 |
| 采购供应链 | 供应商报价比价、采购申请合规预检、到货差异与索赔 |
| 法务合同 | 合同条款偏离比对、续约到期提醒、保密协议快速审查 |
| 质量生产 | 8D 报告与证据索引、来料检验判定、客诉根因分析 |
| 关务物流 | HS 编码归类建议、原产地证与报关单核对、进出口单证齐套检查 |
| 行政办公 | 会议室冲突排期、差旅报销预审、固定资产盘点差异 |
| 教育培训 | 教案对齐课标、作业批改与反馈、学情分层与补差 |
| 医疗健康 | 门诊病历结构化、检验报告异常值提示、随访计划与提醒 |
| 零售电商 | 商品标题与卖点优化、补货建议与滞销清单、退货原因归类 |

## 附录 B：Package Standard v1（摘要）

**验收定义**：非程序员不看源码，3 分钟完成「装→跑样例→看懂结果」。

1. **详情页八块**：一句话（≤60 字）｜适合/不适合｜输入格式｜输出字段与落盘位置｜一句人话示例 + 截图｜权限四要素｜FAQ ≥3｜版本号。
2. **首跑三件套**：`samples/quickstart/{input,expected}` 随包发布（≤500KB）｜`dsh.demo.prompt` 一句话｜`docs/assets/quickstart.png` 真实运行截图（含 command/日期/output_sha256）。
3. **权限四行**：
   ```
   读：<用户指定路径/格式>；不读其他目录
   写：$DSH_HOME/<子目录>；不改原文件
   联网：否（是则写域名/用途/能否关闭）
   外部系统：无（有则写名称/写入内容/凭据）
   ```
4. **错误规范**：`<一句人话>（E_<域>_<原因>）｜下一步：<一个动作>`；不直出 stack/errno/绝对路径。
5. **证据**：`screenshots.json` 含 command/run_at/output_sha256/log_sha256；`ACCEPTANCE.csv` 至少一行含 evidence_sha256；测试退出 0 且数量与 README 一致。

**打分（10 分）**：详情页 1｜样例入包 2｜一键话术 1｜预期输出 1｜权限 2｜错误 1｜证据 2。绿 ≥8 且全项 >0；黄 6–7；红 ≤5。

## 附录 C：数据口径与复算命令

```bash
# 家族与分布
cd 04-build/dsh-plugins
jq '.counts' family.json
jq -r '.items|group_by(.installScope)[]|"\(.[0].installScope)\t\(length)"' family.json
jq '[.items[]|select(.displayNameZh==null)]|length' family.json   # 当前 108

# 已发布版本
jq -r '.packages[]|"\(.name)@\(.version)"' packages.json

# domain 测试与验收
for p in dsh-ghg dsh-bankrec dsh-pim-lint dsh-fin-invoice-core dsh-ap-three-way dsh-travel-recon dsh-legal-clause dsh-legal-intake dsh-qms-capa dsh-hs-candidate dsh-ifc-qto dsh-docx-redline dsh-eval-pack dsh-freight-audit dsh-policy-ledger; do
  ( cd "$p" && node --test test/*.test.mjs 2>&1 | grep -E '^ℹ (pass|fail)' )
done

# checker
ls /mnt/d/Projects/dsh/checkers/dsh-*/tests/*.test.ts | wc -l   # 128

# 下载量
curl -s https://api.npmjs.org/downloads/point/last-month/dsh-einvoice | jq .downloads
```

---

*本文档为活文档：每个 Phase 完成后更新"现状盘点"与 Gate 状态。*
