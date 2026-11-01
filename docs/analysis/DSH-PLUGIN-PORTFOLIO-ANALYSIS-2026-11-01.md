# DSH 插件组合深度分析

**日期**：2026-11-01 · **范围**：PerryLink 名下 DSH 插件家族（profile 口径 125 个仓 / 107 active / 15 frozen / 3 retired）＋ 本地可核对的 62 个合规插件、17 个领域包/套件、54 个主线插件目录。  
**边界**：只使用公开仓库、npm 元数据、README、`packages.json`、`dsh-catalog` 与本地静态站点；不引用客户数据，不把 alpha 写成 GA。  
**配套分类文件**：[TAXONOMY.md](../../TAXONOMY.md) · [taxonomy.v1.json](../../taxonomy.v1.json) · [validator](../../scripts/check-taxonomy.mjs)  
**结论先行**：新一批领域项目**不应并入原来的 checker 分类**；它们应作为独立的 **Domain Operations** 产品线，用 `archetype=checker` 做交叉标签，而不是把“能核对”当成“属于 checker 家族”。

---

## 0. 六条结论

1. **新项目不是 checker，至少不全是。** 15 个领域包中，只有 `dsh-freight-audit`、`dsh-legal-clause`、`dsh-hs-candidate` 具备“规则包/版本化依据 + 逐条发现”的 checker 内核；`dsh-travel-recon` 只有 policy-check 子能力；其余 11 个是 ingest、reconciler、calculator、ledger、extractor、inspector、validator、doctor 或 evaluator。把它们塞进 62 个 checker 会同时稀释 checker 品牌和领域产品线。
2. **`The rest of the family` 的 11 类不是市场分类，是叙事索引。** 它混用了“能力（Security/Workflows）”“领域（Research/Finance）”“材料（Content）”“受众（Developer experience）”“产品形态（checkers & tools）”五种轴。作为主页故事可以保留，但不能拿去做市场筛选。
3. **`dsh-catalog` 的 18 个 group 也不一致。** 「质量」同时装 FMEA/PPAP/SPC 和 eval 工具；「安全」同时装 prompt 安全和危化品/电力安全；「集成」同时装 GitHub、翻译、自动分层；`categories` slug 里 `tools` / `dev` / `customs` / `safety` 混用。它适合作为“旧家族的域标签”，不适合作为面向第三方的稳定分类。
4. **风格不是“全部统一”，而是“三代并存”。** 62 个 checker 最统一（62/62 五语、标准文件、icon、screenshots）；17 个领域包紧随其后（17/17 五语、标准文件、icon，但 0 个 screenshots.json）；54 个主线目录最 heterogeneous（五语 45/54、PRIVACY 0/54、icon 2/54、README 5–26 节）。**新批次不是问题，旧主线才是风格债。**
5. **`62 checkers` 这个数字本身不准确。** 62 = 53 个 opt-in 核心核查器 + 9 个 2026-10 之后的新工具；后者里 6 个是 checker/audit，3 个是 workbench（`dsh-excel-reconcile`、`dsh-table-ingest`、`dsh-tender-requirements`）。更准确的说法是 **“59 个 checker-first + 3 个 compliance workbench”**，或 **“62 个 compliance tools”**。
6. **市场化的第一问题不是再写 README，而是“四个索引各说各话”。** profile 说 125、`dsh-catalog` 99、`dsh-kit/plugins.txt` 92、`dsh-plugins` 17；其中 `dsh-catalog` 缺 17 个领域包 + 9 个新合规工具，`plugins.txt` 缺这 26 个。没有单一 canonical catalog，任何分类都会继续漂移。

---

## 1. 证据与口径

### 1.1 本地可复现的集合

| 集合 | 数量 | 来源 | 说明 |
|---|---:|---|---|
| profile 口径 roster | 125 | `PerryLink/perrylink` README | 127 个声明 `dsh.bundle.patch`，减去 2 条退役走廊腿 |
| active / frozen / retired | 107 / 15 / 3 | 同上 | 对外主口径 |
| `dsh-kit/plugins.txt` install specs | 92 | `plugins/dsh-kit/plugins.txt` | 39 主线 + 53 核心 checker；不含 9 个新工具、17 个领域包 |
| 合规插件目录 | 62 | `plugins/checkers/*` | 53 个在 `plugins.txt`，9 个不在 |
| 领域包 + 套件 | 17 | `04-build/dsh-*` | 15 个包 + 2 个 suite |
| `dsh-catalog` 条目 | 99 | `plugins/dsh-catalog/data/packages.json` | 53 checker + 39 主线 + 7 个其他/退役/第三方；不含 9 + 17 |
| 主线本地目录 | 54 | `plugins/dsh-*` | 含 support、retired、frozen，不能直接当 active 数 |

**集合关系（仅用于覆盖分析，不等同于 profile 统计）**：

```text
99（catalog） + 9（新合规工具） + 17（领域包/套件） = 125
92（install specs） = 39（主线） + 53（核心 checker）
62（checkers 目录） = 53（核心） + 9（新工具）
```

### 1.2 这次实际核对了什么

- 17 个领域包的 `package.json`、五语 README、`docs/assets`、`ACCEPTANCE.csv`、`files[]`、`cordis.patch.yml`、suite 成员版本。
- 62 个 checker 的 README 标题、工具面、`README` 章节数、标准文件、`screenshots.json`、GIF。
- 54 个主线目录的五语 README、`PRIVACY`/`SECURITY`/`CONTRIBUTING`/`CHANGELOG`/`icon`/`screenshots`/GIF 覆盖率。
- `dsh-catalog` 的 group/category 分布，`dsh-plugins` 的 `packages.json`/docs，profile 的家族段落。
- Claude Code 官方 marketplace manifest（315 个插件，`category` 字段）与 2026-09 Codex 插件目录的 11 类观察（见 §2.4）。

**没有做**：没有重新发 npm、没有改任何已发布 README、没有调用客户环境、没有把 alpha 验证成 GA。

---

## 2. 现有分类为什么不够

### 2.1 主页 11 类：五种轴混在一起

| 现有类 | 实际轴 | 例子 | 问题 |
|---|---|---|---|
| 🔒 Security | 能力 | `dsh-permission-rules`、`dsh-mask`、`dsh-defend` | `dsh-auto-review` 也可以算安全，但被放在 Evaluation |
| 🔁 Workflows | 能力/场景 | `dsh-checkpoint-rewind`、`dsh-github`、`dsh-test-drive` | 与 Developer experience、Evaluation 重叠 |
| ✨ Experience & UX | 产品层 | `dsh-memento`、`dsh-composer-history`、`dsh-output-styles` | `dsh-memento` 是 memory/runtime，不是 UX |
| 🧪 Evaluation | 能力 | `dsh-doublecheck`、`dsh-score`、`dsh-auto-review` | 与前两类重叠 |
| 📊 Observability & cost | 能力 | `dsh-observe`、`dsh-fast` | `dsh-autotier` 已 frozen |
| 🎨 Content & knowledge | 材料/领域 | `dsh-talk`、`dsh-translate`、`dsh-library` | `dsh-talk` 更像 interface，`dsh-library` 更像 knowledge |
| 🛠️ Developer experience | 受众 | `dsh-mcp-panel`、`dsh-plugin-guide`、`jevcore` | 与 Workflows、Integrations 重叠 |
| 📱 Messaging & bridges | 集成方式 | `dsh-phone-inbox`、`dsh-ticktick`、`dsh-reach` | `dsh-ticktick` 是外部服务集成，不只是 messaging |
| 🔬 Research | 领域 | `dsh-research-report`、`dsh-industry-research`、`dsh-fund-research` | 与 Content & knowledge 重叠 |
| ✅ Compliance checkers & tools | **产品集合 + 能力** | 62 个 | 把 53 个 checker、6 个 checker/audit、3 个 workbench 装进一个桶 |
| 🏢 Finance, legal & operations | 领域 + 产品形态 | 15 个 + 2 suite | 财务/法务/ESG/质量/贸易/物流/文档/BIM/安装诊断全塞在一起；suite 不是插件类型 |

**结论**：这 11 类适合主页叙事（“这个人在做什么”），不适合 marketplace filter（“我要解决什么问题”）。

### 2.2 `dsh-catalog` 的 18 个 group：更细，但不稳定

当前分布（99 条）：

| group | 数量 | 问题 |
|---|---:|---|
| 质量 | 12 | FMEA/PPAP/SPC + eval/score/data-quality 混装 |
| 安全 | 11 | prompt 安全 + 危化品/电力/应急/水产 混装 |
| 集成 | 10 | GitHub、翻译、自动分层、本地模型、LSP、MCP 混装 |
| 研究 | 9 | 研究写作 + 教育/基金/论文/政策简报混装 |
| 外贸 | 8 | 关务、信用证、原产地、滞箱、铁路窗口混装 |
| 会话 | 7 | 含 3 个 retired（background-agents/session-pin/team-rooms） |
| 招投标 | 7 | 资格预审、评分矩阵、规则库自检、投诉期限混装 |
| 工程建设 | 7 | 环评、HAZOP、监理日志、土壤地下水混装 |
| none | 5 | `dsh-phocinae`、`dsh-phone-inbox` 等无 group |
| 其他 9 组 | 23 | 生态 4、公文 3、观测 3、桌面 3、法律 3、医疗 3、治理 2、基建 1、UX 1 |

`categories` slug 更细，但同样混合：`tools` 10、`customs` 8、`quality` 8、`integration` 7、`safety` 7、`tender` 7、`construction` 7、`dev` 6、`research` 5、`knowledge` 5……还有 `model,agent`、`interface,workflow` 这种拼接。  
**这不是一个可扩展的 marketplace vocabulary**：第三方作者无法判断该填 `tools` 还是 `dev`，市场也无法用这些 slug 做稳定筛选。

### 2.3 “checker” 被当成分类，而不是能力

checker 家族的真正契约不是“输入一个文件、输出一堆提示”，而是：

- **C1 输入是登记表/记录集**（不是任意文档）；
- **C2 规则包有版本/来源**（规则、条款、阈值可追溯）；
- **C3 发现项有 locator / found / expected / fix / ruleId / severity**；
- **C4 只读核对，不替用户作法律、医疗、海关、税务定性**；
- **C5 输出是 findings + 证据**，不是把源文件改写成另一个业务产物。

用这五条测 15 个领域包，只有少数通过（见 §4.3）。把“能校验”当成“checker”，会让 53 个有引文闸门的中国合规核查器与 15 个领域 S1 demo 混在一起，用户无法判断哪个能引用法规、哪个只是业务工具。

### 2.4 市场对标：Claude Code 与 Codex 都没有“checker”这个类

**Claude Code 官方 marketplace**（2026-11-01 读取 `anthropics/claude-plugins-official` 的 `.claude-plugin/marketplace.json`）：

- 315 个插件；
- `category` 是自由字符串，但主流值是宽口径的“工作类型”：`development` 123、`productivity` 69、`database` 39、`monitoring` 22、`security` 18、`deployment` 9、`design` 8、`automation` 3、`learning` 3、`testing` 2、`math` 2、`migration` 1、`location` 2，另有 14 个未填；
- 没有 `checker`、`compliance` 这种“实现方式”类；合规/审查插件被放进 `security` 或 `productivity`。

参考：[Claude Code marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference)、[官方 manifest](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)。

**Codex 官方目录**（2026-09-11 的 75 个插件观察）：

- 11 类：Productivity、Creativity、Developer Tools、Communication、Data & Analytics、Education & Research、Scientific Research、Security、Finance、Business & Operations、Other；
- 也没有 `checker`；财务/法务/运营被放在 `Finance` 或 `Business & Operations`；
- 插件是“skills + MCP + connectors + hooks”的打包，**打包形态（bundle/suite）与分类是两件事**。

参考：[Codex 插件目录观察（2026-09-11）](https://news.qiniu.com/archives/1789094413719)、[OpenAI Codex plugins 文档入口](https://developers.openai.com/codex/plugins)（入口在当前网络不可直连，分类数据取自上述 2026-09 目录观察）。

**对 PerryLink 的直接含义**：

1. 市场分类用 **job-to-be-done**，不用实现方式；`checker` 是 `archetype`，不是 `category`。
2. 宽类 + 标签优于 18 个细碎 group；Claude 315 个插件也只有 13 个有效类。
3. `Finance` 可以独立（Codex 就这么做），但前提是有足够供给；PerryLink 目前财务 4 个 + suite，独立 `finance` 类成立，法务 2 个暂放 `business-ops` 更稳。
4. suite/bundle 是 **packaging**，应在卡片上显示“包含 N 个成员”，不应占一个分类。

### 2.5 原来的 11 类怎么处理：保留叙事，换掉分类语义

**不要删掉 `The rest of the family`。** 它作为主页的“这个家族覆盖什么”很有效，问题只在于它被当成了市场分类。建议保留 11 个故事块，但按下面方式改名/换轴：

| 原类 | 处理 | 说明 |
|---|---|---|
| 🔒 Security | 保留为 `category=security` | 纯能力类，最稳定 |
| 🔁 Workflows | 保留为 `category=workflow` | 与 Developer tools 有重叠，条目可多标签 |
| ✨ Experience & UX | 拆成 `interface` + `runtime` | `dsh-memento` 是 memory/runtime，不是 UX |
| 🧪 Evaluation | 降为 `developer-tools` 的二级标签 | 不作为一级市场类 |
| 📊 Observability & cost | 保留为 `category=observability` | 清晰 |
| 🎨 Content & knowledge | 拆成 `content` + `research` | 文档/翻译 vs 研究/知识 |
| 🛠️ Developer experience | 保留并扩为 `category=developer-tools` | 容纳 plugin doctor/kit/guide |
| 📱 Messaging & bridges | 保留并扩为 `category=integrations` | 不只是消息，还包括外部服务 |
| 🔬 Research | 保留为 `category=research` | 与 content 分开 |
| ✅ Compliance checkers & tools | 降为 `collection=compliance` + `category=compliance`/`data` | 59 checker-first + 3 workbench；不要再把 62 当同一种东西 |
| 🏢 Finance, legal & operations | 改为 `category=business-ops` + domain 子标签；suite 单列 | 财务/法务/ESG/质量/贸易/物流/文档/BIM/安装诊断不再混在一个桶 |
| — | 新增 `category=platform` | `dsh-kit`/`dsh-catalog`/certification/portal 是基础设施，不是业务插件 |

**一句话**：11 类可以继续讲家族故事；市场筛选请用 12 个 category + archetype + domain。两者不是一套东西，不要互相翻译。


---

## 3. 建议的四轴模型

### 3.1 四个轴，各回答一个问题

```text
Collection   → 它属于哪条产品线？      （内部/叙事）
Category     → 用户拿它解决什么工作？  （市场主筛选）
Archetype    → 它到底怎么工作？        （能力/契约）
Domain       → 它服务哪个业务领域？    （标签/二级筛选）
```

再加两个独立 facet：

```text
Lifecycle    → active / frozen / retired
Trust        → provenance / CI / certification / alpha / GA
```

**关键规则**：一个条目只能有一个 primary category、一个 primary archetype；domain 可以有多个；collection 不参与市场排序，只用于“这是 PerryLink 的哪条线”。

### 3.2 建议的 12 个市场分类

| slug | 中文 | 用户问题 | 现有例子 |
|---|---|---|---|
| `security` | 安全与隐私 | 怎么防止泄露/越权/注入？ | `dsh-permission-rules`、`dsh-mask`、`dsh-defend` |
| `workflow` | 工作流与自动化 | 怎么把重复流程固化？ | `dsh-checkpoint-rewind`、`dsh-github`、`dsh-test-drive` |
| `developer-tools` | 开发者工具 | 怎么开发/诊断/评测插件？ | `dsh-mcp-panel`、`dsh-plugin-guide`、`dsh-policy-ledger`、`dsh-eval-pack` |
| `integrations` | 集成与消息 | 怎么连接外部系统/人？ | `dsh-ticktick`、`dsh-phone-inbox`、`dsh-reach`、`dsh-github` |
| `research` | 研究与知识 | 怎么查、读、写研究？ | `dsh-research-report`、`dsh-industry-research`、`dsh-fund-research` |
| `content` | 内容与文档 | 怎么处理文档/内容？ | `dsh-docx-redline`、`dsh-library`、`dsh-translate` |
| `data` | 数据与分析 | 怎么清洗/对齐/分析数据？ | `dsh-ifc-qto`、`dsh-pim-lint`、`dsh-data-quality` |
| `observability` | 可观测与成本 | 怎么知道花了多少/慢在哪？ | `dsh-observe`、`dsh-fast`、`dsh-budget` |
| `interface` | 界面与体验 | 怎么改变交互/输出？ | `dsh-composer-history`、`dsh-output-styles`、`dsh-click` |
| `business-ops` | 业务运营 | 怎么跑财务/法务/ESG/贸易流程？ | 15 个领域包 + 2 suite |
| `compliance` | 合规与核查 | 怎么按规则核对材料？ | 59 个 checker-first + 6 个 audit |
| `platform` | 平台与基础设施 | 怎么安装/发现/认证插件？ | `dsh-kit`、`dsh-catalog`、`dsh-plugin-certification`、`dsh-plugin-portal` |

**为什么不是 18 类**：18 类里「质量/安全/外贸/招投标/工程建设/公文/法律/医疗/治理」是 **domain**，不是 category；它们应作为 `business-ops` 或 `compliance` 下的 domain tag。这样市场只有 12 个一级入口，domain 仍可精确筛选。

**为什么保留 `compliance`**：59 个 checker-first 是真实供给，且用户会明确搜“合规/核查”；把它放进 `business-ops` 会淹没。但 `compliance` 只收“按规则出发现项”的工具；`invoice-ledger`、`payroll-audit` 这类可以留在 `compliance`，`excel-reconcile`、`table-ingest` 应去 `data`。

### 3.3 建议的 archetype（能力契约）

| slug | 含义 | 典型工具 |
|---|---|---|
| `checker` | 规则包/记录集 → 逐条 findings | 53 个核心 checker；`dsh-freight-audit` |
| `validator` | schema/格式/校验位，无版本化法规包 | `dsh-pim-lint`、`dsh-eval-pack`（evaluator） |
| `doctor` | 诊断安装/能力/日志 | `dsh-policy-ledger`、`dsh-plugin-doctor` |
| `inspector` | 结构/哈希/差异检查，不作合规定性 | `dsh-docx-redline` |
| `ingest` | 导入/解析/去重/归档 | `dsh-einvoice`、`dsh-legal-intake` |
| `extractor` | 从文档/模型抽结构化字段 | `dsh-ifc-qto`、`dsh-table-ingest`、`dsh-tender-requirements` |
| `assistant` | 模型辅助候选/建议，不作定性 | `dsh-hs-candidate`（次要） |
| `reconciler` | 两个以上来源对齐/匹配 | `dsh-bankrec`、`dsh-ap-three-way`、`dsh-travel-recon`、`dsh-excel-reconcile` |
| `calculator` | 计算派生值/换算 | `dsh-ghg`、`dsh-warranty-calc`、`dsh-power-loss-split` |
| `ledger` | 有状态台账/流程推进 | `dsh-qms-capa`、`dsh-invoice-ledger`、`dsh-demurrage-ledger` |
| `drafter` | 生成/补全文档草稿 | `dsh-pleading-draft`、`dsh-policy-brief-draft` |
| `integration` | 外部服务桥 | `dsh-github`、`dsh-ticktick`、`dsh-reach` |
| `ui` | 界面/输出/交互 | `dsh-output-styles`、`dsh-click`、`dsh-draw` |
| `runtime` | 权限/记忆/路由/hook | `dsh-permission-rules`、`dsh-memento`、`dsh-autotier` |
| `suite` | 只安装成员，不提供工具 | `dsh-finops-suite`、`dsh-contract-suite` |
| `catalog` | 目录/认证/安装基础设施 | `dsh-catalog`、`dsh-plugin-certification` |

### 3.4 判定树

```text
它只安装别人？                         → suite
它维护目录/认证/安装器？               → catalog / platform
它按版本化规则包逐条出 findings？      → checker + compliance
它只校验 schema/格式/校验位？          → validator + data/developer-tools
它诊断安装/运行？                      → doctor + developer-tools
它把文件/邮件/文档变成结构化记录？     → ingest/extractor
它把两个以上来源对齐？                 → reconciler
它计算数值/换算？                      → calculator
它推进有状态流程？                     → ledger
它生成文档草稿？                       → drafter
它连接外部服务？                       → integration
它改变界面/输出？                      → ui
它改运行时（权限/记忆/路由）？         → runtime
```

---

## 4. 15 个领域包逐项定位

### 4.1 总表

| 项目 | 实际核心工作 | archetype | category | domain tags | checker？ | 套件/状态 |
|---|---|---|---|---|---|---|
| `dsh-einvoice` | OFD/XML 发票入库、解析、去重、本地归档、回执/复核队列 | `ingest`（+ ledger） | `business-ops` | finance, china-einvoice | ❌ | finops / active |
| `dsh-bankrec` | 银行 CSV/GL/CAMT.053/MT940 入库、1:1 匹配、三表底稿 | `reconciler` | `business-ops` | finance, banking | ❌ | finops / active |
| `dsh-ap-three-way` | 发票/PO/GRN 三单匹配、1% 容差、例外底稿 | `reconciler` | `business-ops` | finance, accounts-payable | ❌ | finops / active |
| `dsh-travel-recon` | 差旅订单/发票/卡流水三单匹配、重复检查、只读政策检查 | `reconciler`（checker facet） | `business-ops` | finance, travel-expense | ⚠️ 部分 | finops / active |
| `dsh-legal-intake` | EML 法务请求解析、分类、线程去重、台账 | `ingest` | `business-ops` | legal, intake | ❌ | contract / active |
| `dsh-legal-clause` | 条款树、12 键 playbook 注册/比对、未解决报告 | `checker`（+ extractor） | `business-ops` | legal, contracts | ⚠️ 接近 | contract / active |
| `dsh-ghg` | 用电活动入库、排放因子计算、逐行复算、部分 ESRS E1 | `calculator` | `business-ops` | esg, energy, emissions | ❌ | — / frozen |
| `dsh-qms-capa` | NCR 入库/去重、批次别名、影响评估、CAPA/8D | `ledger` | `business-ops` | quality, manufacturing | ❌ | — / frozen |
| `dsh-hs-candidate` | HS Top-3、12 要素完整性、RVC、税则版本门 | `checker`（+ advisor） | `business-ops` | trade, customs | ⚠️ 接近 | — / frozen |
| `dsh-freight-audit` | ratecard 版本、承运商账单审计、recovery、差异导出 | `checker`（audit） | `business-ops` | logistics, freight | ✅ 强 | — / frozen |
| `dsh-docx-redline` | DOCX 结构检查、逐字节 roundtrip、单 run 替换、文本 diff | `inspector`（+ transformer） | `content` | documents | ❌ | — / frozen |
| `dsh-ifc-qto` | IFC 构件/工程量清点、CSV 导出 | `extractor` | `data` | construction, bim | ❌ | — / frozen |
| `dsh-policy-ledger` | 安装能力快照、tarball 断言、安装日志诊断 | `doctor` | `developer-tools` | plugin-install | ❌ | — / active |
| `dsh-pim-lint` | PIM CSV 必填/重复 SKU/GTIN/价格校验 | `validator` | `data` | retail, pim | ❌ | — / frozen |
| `dsh-eval-pack` | eval-pack 结构 lint、确定性 JSON 评分 | `validator`（evaluator） | `developer-tools` | evaluation | ❌ | — / active |
| `dsh-finops-suite` | 安装 4 个财务成员 | `suite` | `business-ops` | finance | ❌ | suite / active |
| `dsh-contract-suite` | 安装 2 个法务成员 | `suite` | `business-ops` | legal | ❌ | suite / active |

**准确性总评（17 个）**：13 个的定位与工具面一致；2 个的名称比能力宽（`dsh-einvoice`、`dsh-ghg`）；1 个的名称过度承诺（`dsh-docx-redline`）；1 个名实不符（`dsh-policy-ledger`）。前两类只需要在 display name / 首屏加限定词，后两类需要在市场文案里明确纠正，但不急着改 npm 名。

### 4.2 四个需要处理的定位问题

#### A. `dsh-policy-ledger`：名字不是它现在做的事

- 名字暗示“策略台账 / gate / ledger”；
- 实际 6 个工具全是 read-only install doctor：`trust.capability_snapshot`、`trust.diff`、`trust.assert_tarball`、`install.diagnose`、`install.probe`、`install.bundle`；
- README 自己写了“保留 — 仅安装诊断的伴生工具”，但 package name、catalog 分类、主页句子仍让它像“policy/ledger”；
- **建议**：不急着改 npm 名（已有用户），但在 marketplace `displayName` 用 **“Install Doctor”**，`category=developer-tools`，`archetype=doctor`；如果未来要改名，走 bare-name redirect 那一套，不要静默改。

#### B. `dsh-docx-redline`：`redline` 过度承诺

- 实际是 inspect + byte-exact roundtrip + 单个精确 `w:t` 替换 + 文本级 diff；
- **不是** Word tracked-changes / 修订模式写入；
- README 的边界写得清楚，但名字和 marketplace 首屏会让人以为是“redline writer”；
- **建议**：display name **“DOCX Inspect & Text Diff”**；首屏加一句“不写 OOXML 修订，不替代 Word 修订模式”；npm 名保留。

#### C. `dsh-ghg`：名字比能力宽

- 实际只做用电（electricity）活动、location-based 计算、部分 ESRS E1；不是完整 GHG inventory（Scope 1/3 只接受导入，不做完整盘查）；
- description 已经限定，但 name 太宽；
- **建议**：display name **“Electricity GHG (Scope 2)”**；`domain tags: esg, emissions`；不要在市场写“GHG accounting”。

#### D. `dsh-einvoice` / `dsh-bankrec`：描述准确，但需要限定词

- `dsh-einvoice` 是 file-level，不是税局查验/OCR/申报；display name 加 **“China e-invoice (file-level)”**；
- `dsh-bankrec` 是 statement ingest + 1:1 match + workpaper，不是全自动银行对账；display name 加 **“Bank statement reconciliation”**；
- 这两项不是错误，只是市场首屏需要把边界放进标题。

### 4.3 checker 契约测试：15 个里谁真的像 checker

| 项目 | C1 记录集 | C2 版本化规则包 | C3 findings/定位 | C4 只读 | C5 findings 为主 | 结论 |
|---|---|---|---|---|---|---|
| `freight-audit` | ✅ 账单 | ✅ ratecard 版本 | ✅ 差异/回收 | ✅ 审计只读（ratecard 注册除外） | ✅ | **强 checker/audit** |
| `legal-clause` | ✅ 条款树 | ✅ 12 键 playbook / 自定义版本 | ✅ 缺失/多余键 | ⚠️ 会写条款树 | ⚠️ 树+报告 | **checker-adjacent** |
| `hs-candidate` | ✅ 产品描述/12 要素 | ✅ HS 表 + 税则版本 | ✅ Top3/完整性/RVC | ✅ R0 | ⚠️ 候选+检查 | **checker-adjacent/advisor** |
| `travel-recon` | ✅ 订单/发票/卡 | ⚠️ 简单金额/发票规则 | ✅ 匹配/重复/政策 | ✅ policy check | ⚠️ 台账为主 | **reconciler + policy facet** |
| `pim-lint` | ✅ CSV | ❌ 固定字段规则，无版本/引文 | ✅ 问题列表 | ✅ | ✅ | **validator，不是合规 checker** |
| `eval-pack` | ✅ eval pack | ❌ schema 规则 | ✅ lint/score | ✅ | ⚠️ 评分 | **evaluator/validator** |
| `docx-redline` | ✅ DOCX | ❌ 无规则包 | ⚠️ 结构计数/文本差异 | ❌ 会替换 | ❌ diff 为主 | **inspector/transformer** |
| `ghg` | ✅ 用电行 | ⚠️ 排放因子版本 | ✅ 复算差异 | ❌ 会写 | ❌ 底稿为主 | **calculator** |
| `qms-capa` | ✅ NCR | ⚠️ 流程状态 | ⚠️ 影响/CAPA | ❌ 会写 | ❌ 台账为主 | **ledger** |
| `bankrec`/`ap` | ✅ 多源 | ❌ 容差规则 | ✅ 匹配/例外 | ❌ 会写 | ❌ 底稿为主 | **reconciler** |
| `einvoice`/`legal-intake` | ✅ 文件/邮件 | ❌ 解析规则 | ⚠️ 解析/去重 | ❌ 会写 | ❌ 归档/台账 | **ingest** |
| `ifc-qto` | ✅ IFC | ❌ 无规则 | ⚠️ 清点 | ❌ 会写 | ❌ CSV | **extractor** |
| `policy-ledger` | ✅ tarball/日志 | ❌ 能力快照，不是法规包 | ✅ 诊断 | ✅ | ✅ | **doctor** |

**结论**：

- **0 个**应该整体搬进 53 个核心 checker；
- **3 个**（`freight-audit`、`legal-clause`、`hs-candidate`）可以打 `archetype=checker` 的交叉标签；
- **1 个**（`travel-recon`）是 reconciler，但含 policy-check 子能力；
- 其余 **11 个**是 ingest / reconciler / calculator / ledger / extractor / inspector / validator / doctor / evaluator。  
  这就是“**不要按名字归类，按契约归类**”。

---

## 5. 62 个合规项目的再分层

### 5.1 53 个核心 checker 的域分布

| 域 | 数量 | 代表 |
|---|---:|---|
| 外贸 Trade | 8 | `customs-doc-check`、`hs-classify`、`origin-rvc-check`、`lc-doc-check` |
| 质量 Quality | 8 | `fmea-table-check`、`ppap-check`、`spc-gbt-adapter`、`sop-sync-check` |
| 安全 Safety | 7 | `hazchem-check`、`emergency-plan`、`power-ticket-check`、`aqua-input-check` |
| 招投标 Tender | 7 | `bid-ca-precheck`、`bid-qual-check`、`tender-matrix`、`protest-deadline` |
| 工程建设 Construction | 7 | `eia-guide-check`、`hazplan-check`、`site-log-check`、`soilwater-check` |
| 研究 Research | 5 | `essay-rubric-check`、`nsfc-form-check`、`paper-doc-adapter`、`policy-brief-draft` |
| 公文 Government | 3 | `archive-check`、`gongwen-flow-check`、`gongwen-word-check` |
| 法律 Legal | 3 | `evidence-check`、`lawcite-adapter`、`pleading-draft` |
| 医疗 Medical | 3 | `icd-rule-check`、`medrec-qc`、`nurse-record-check` |
| 治理 Governance | 2 | `soe-decision-check`、`sop-sync-check` |

这 53 个的共同点：**规则库 + 引文闸门 + 只提示差异、不作出定性结论**。这是真正的 checker 品牌资产，应该保持独立。

### 5.2 9 个新工具：6 个 checker-first + 3 个 workbench

| 工具 | 实际工作 | 建议 archetype | 建议 category | 是否 checker-first |
|---|---|---|---|---|
| `dsh-bid-health-check` | 投标要求覆盖/定位 | `checker` | `compliance` | ✅ |
| `dsh-canteen-retention-check` | 食堂留样台账 | `checker` | `compliance` | ✅ |
| `dsh-construction-doc-check` | 施工资料目录/版本/空文件 | `checker` | `compliance` | ✅ |
| `dsh-invoice-ledger` | 发票台账重复/价税/抬头/日期 | `checker` | `compliance` | ✅ |
| `dsh-payroll-audit` | 工资表参数核对 | `checker` | `compliance` | ✅ |
| `dsh-safety-ledger-check` | 施工安全资格台账 | `checker` | `compliance` | ✅ |
| `dsh-excel-reconcile` | 两表按主键/容差对齐 | `reconciler` | `data` | ❌ |
| `dsh-table-ingest` | docx/xlsx/csv → 表格 JSON | `extractor` | `data` | ❌ |
| `dsh-tender-requirements` | 招标文件关键信息抽取 | `extractor` | `business-ops` | ❌ |

**建议对外写法**：

```text
Compliance tools 62
= 53 个核心核查器（opt-in，带引文闸门）
+ 6 个 2026-10 后的 checker/audit
+ 3 个 workbench（reconcile / ingest / extract）
```

或者更短：**“59 个 checker-first + 3 个 workbench”**。  
不要继续用 `checkers-62` 这个 badge 让读者以为 62 个都是同一种东西。

### 5.3 9 个新工具的分发缺口

- 9 个都**不在** `dsh-kit/plugins.txt`（92 specs）；
- 9 个都**不在** `dsh-catalog`（99 条）；
- 53 个核心 checker 在两边都有；
- 这意味着：DSH Desktop Market 和 `install-all` 看不到这 9 个工具，尽管它们已经在 `checkers/` 目录里。

**这是 P0 分发问题**，不是分类问题。分类之前先把它们纳入 catalog/roster，否则“市场分类”只是纸面工作。

---

## 6. 关系图：同一运营链 ≠ 自动编排

### 6.1 财务链

```text
dsh-einvoice ──┐
dsh-bankrec ───┼──> dsh-finops-suite（只负责安装四个成员）
dsh-ap-three-way┘
dsh-travel-recon┘
```

**重要澄清**：这四个工具**没有共享数据库、没有自动传递单据、没有统一 run id**。它们各自有本地 store 和 xlsx 输出；“链”是**同一条运营流程里的四个独立工具 + 一个安装套件**，不是端到端 pipeline。  
当前 scenario article 把它写成“链”可以，但需要明确“手工把上一个工具的输出交给下一个工具”，否则用户会以为安装 suite 就自动串起来。

### 6.2 合同法务链

```text
dsh-legal-intake ──> dsh-contract-suite（安装）
dsh-legal-clause  ──┘
```

同样是 installer，不是 orchestrator。`legal-intake` 的 EML 台账不会自动进入 `legal-clause` 的条款树。

### 6.3 与 53 个 checker 的真实关系

| 领域包 | 最相关的 checker | 关系 |
|---|---|---|
| `dsh-hs-candidate` | `dsh-hs-classify`、`dsh-origin-rvc-check`、`dsh-customs-doc-check` | 前者做候选/完整性，后者做归类层级/原产地/单证核对 |
| `dsh-freight-audit` | `dsh-demurrage-ledger`、`dsh-lc-doc-check`、`dsh-customs-doc-check` | 运费账单 vs 滞箱费/信用证/报关单证 |
| `dsh-legal-clause` | `dsh-contract-stance`、`dsh-lawcite-adapter`、`dsh-evidence-check` | 条款树/playbook vs 立场台账/法条引用/证据清单 |
| `dsh-legal-intake` | `dsh-contract-stance`、`dsh-evidence-check` | 请求台账 vs 合同立场/证据 |
| `dsh-qms-capa` | `dsh-fmea-table-check`、`dsh-ppap-check`、`dsh-spc-gbt-adapter`、`dsh-sop-sync-check` | QMS 流程 vs FMEA/PPAP/SPC/作业规程 |
| `dsh-docx-redline` | `dsh-gongwen-word-check`、`dsh-archive-check`、`dsh-paper-doc-adapter` | 文档结构/归档/试卷结构 |
| `dsh-ifc-qto` | `dsh-construction-doc-check`、`dsh-pipeline-check`、`dsh-site-log-check` | BIM 工程量 vs 施工资料/项目链条/监理日志 |
| `dsh-ghg` | `dsh-eia-guide-check`、`dsh-soilwater-check` | 碳排放 vs 环评/土壤地下水（弱关系） |
| `dsh-bankrec`/`ap`/`travel` | `dsh-invoice-ledger`、`dsh-excel-reconcile` | 对账/匹配 vs 发票台账/两表对齐 |
| `dsh-pim-lint` | `dsh-excel-reconcile`、`dsh-data-quality` | PIM 字段校验 vs 两表对齐/数据质量 |
| `dsh-eval-pack` | `dsh-score`、`dsh-doublecheck`、`dsh-test-drive` | eval pack vs 评分/质量门/测试驱动 |
| `dsh-policy-ledger` | `dsh-plugin-doctor`、`dsh-plugin-kit` | 安装诊断 vs 插件结构/Cordis/sandbox 诊断 |

**建议**：17 个领域 README 的 `相关项目` 从“Checker 家族”这个总链接，改成 **“Related checkers” 小表**（2–4 个具体 checker + 一句关系）。这比再加一段泛泛的“家族”更有用。

---

## 7. 风格与材料审计

### 7.1 三代并存

| 代际 | 数量 | 五语 README | 标准文件 | icon | screenshots.json | GIF | README 结构 |
|---|---:|---:|---:|---:|---:|---:|---|
| 主线（2026-09 起） | 54 目录 | 45/54 | PRIVACY 0/54；SECURITY 43/54；CONTRIBUTING 47/54；CHANGELOG 46/54；LICENSE 50/54 | 2/54 | 42/54 | 43/54 | 5–26 节，异构 |
| Checker（2026-10-08 起） | 62 | 62/62 | 62/62 | 62/62 | 62/62 | 53/62 | 13 节，统一 |
| Domain（2026-10-31 起） | 17 | 17/17 | 17/17 | 17/17 | **0/17** | 2/17（仅 suite） | 13 节（frozen 14 节），统一 |

**读法**：

- 62 个 checker 是家族里最成熟的文档标准；17 个领域包基本复刻了它，说明**新批次不是“不统一”的来源**；
- 17 个领域包缺的是 **screenshots.json + 每个包的 hero/demo 资产**（不是五语/标准文件）；
- 54 个主线目录才是最大的风格债：`PRIVACY.md` 0/54、`icon.svg` 2/54、五语 45/54、README 5–26 节；
- 不要为了“统一”去重写 54 个主线 README；先定一个 **最小标准**，新包强制执行，旧包按 touched 逐步补。

### 7.2 17 个领域包的强项

- 17/17 五语 README，13/14 节结构一致；
- 17/17 `SECURITY` / `PRIVACY` / `CODE_OF_CONDUCT` / `CONTRIBUTING` / `CHANGELOG` / `icon.svg`；
- 17/17 本地 workflow SVG；
- 17/17 README 有安装命令、四条安装通道、边界、公开样例、兼容性、权限与数据、家族表；
- 17/17 Apache-2.0；
- 7 个 frozen 有独立维护状态节，状态清楚；
- 2 个 suite 有真实 install GIF。

### 7.3 17 个领域包的具体缺口

#### P0 — 事实错误，会直接误导用户

1. **suite 成员版本表全部过期**  
   `dsh-finops-suite` 五语 README 写 `einvoice 0.2.0-alpha.3 / bankrec 0.1.0-alpha.6 / ap 0.1.0-alpha.3 / travel 0.1.0-alpha.4`，实际依赖是 `.6 / .9 / .6 / .8`；  
   `dsh-contract-suite` 写 `legal-intake 0.1.0-alpha.2 / legal-clause 0.1.0-alpha.4`，实际 `.5 / .7`。  
   2 个 suite × 5 语言 = **10 个文件**。

2. **suite 的“成员”节复制了工具模板的句子**  
   “工具名是稳定 API；说明已本地化。”——suite 没有工具，只有成员；这句话在语义上是错的。应改成“成员版本由 `dependencies` 固定；suite 只负责安装，不提供工具面”。

3. **17 个 npm 包 README 的相对 fixture 链接在 npm 上会 404**  
   README 写相对链接 `fixtures/...`、`ACCEPTANCE.csv`，但 `files[]` 不含 `fixtures/` 和 `ACCEPTANCE.csv`。GitHub 上能点，npm 包页上不能。  
   修法二选一：① 改成绝对 GitHub URL；② 把 `fixtures/`/`ACCEPTANCE.csv` 加进 `files[]`（会增加包体，不推荐对冻结包做）。  
   推荐 ①，17 个包 × 5 语言，脚本化替换。

4. **`packages.json` 的 release URL 全部落后于当前版本**  
   例如 `dsh-einvoice` catalog 版本 `0.2.0-alpha.6`，`release` 还指 `v0.2.0-alpha.4`；`dsh-ghg` 版本 `.11`，release 指 `.9`；suite 版本 `.5/.4`，release 指 `.1`。  
   `updated` 仍是 `2026-10-31`。这是 market/catalog 的直接错误。

5. **`RELEASE-MANIFEST.md` 已过期**  
   仍写 `@perrylink/*` 和 13 个包的旧版本；虽然 `PACKAGE-AUDIT` 标了 superseded，但文件还在仓库里，读者会误读。应改为“历史归档”或重写为当前 17 个。

6. **profile 的 15 个 S1 句子少算一个 active**  
   现有句子：“six feed ... seven are frozen, one stays active as an install companion, and one is archived...” = 6+7+1+1，但 `dsh-eval-pack` 也是 active，且 archived 的是 `dsh-eval-harness`（不在 15 个里）。  
   应改为：**8 active（6 个 suite 成员 + 1 个 install companion + 1 个 eval utility）+ 7 frozen = 15**。

#### P1 — 分类/市场元数据

7. **17 个包没有 `screenshots.json`**  
   checker 62/62 有 hero + demo GIF；领域包只有 SVG flow。市场卡片会显得“没有真实运行证据”。  
   优先给 3 个 active 旗舰（`dsh-einvoice`、`dsh-bankrec`、`dsh-legal-clause`）做 hero PNG + terminal GIF；frozen 包可只补 hero。

8. **17 个包没有 `TROUBLESHOOTING.md`**  
   checker 62/62 有；领域包 0/17。至少给 8 个 active 包补一页“常见安装/输入/编码/路径错误”。

9. **17 个包没有具体 “Related checkers”**  
   现在只链接 `https://perrylink.github.io/zh/checkers/` 总索引；用户看不出 `hs-candidate` 与 `hs-classify`、`freight-audit` 与 `demurrage-ledger` 的关系。  
   建议加 2–4 行小表（见 §6.3）。

10. **suite 缺少 `SUITE.md` / 生命周期说明**  
    应写清：成员、精确版本、安装顺序（如有）、卸载 suite 不会卸载成员、升级 suite 会拉哪些版本、冲突/回滚。当前只有一行 `remove` 命令。

11. **`dsh-plugins` 聚合仓缺少标准文件**  
    只有 `README.md`、`packages.json`、`docs/`、`LICENSE`；没有 `SECURITY.md`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`、`CHANGELOG.md`、`icon.svg`。作为市场入口，应补齐。

12. **`dsh-plugins` 文档是手写静态 HTML，没有生成器**  
    `packages.json` 与 `docs/index.html`、17 个 package 页、版本号全靠手同步；已经出现 release URL 漂移。应加 `scripts/build-docs.mjs` + CI 检查“catalog 版本 = package 版本 = docs 版本”。

#### P2 — 长期质量

13. **9 个新合规工具不在 catalog/roster**（见 §5.3）。
14. **`dsh-catalog` 99 条不含 17 领域包 + 9 新工具**；DSH Desktop Market 看不到 26 个当前家族成员。
15. **主线 54 目录的 PRIVACY/icon/五语债**：不要阻塞新包；按 touched 补。
16. **`dsh-docx-redline` / `dsh-policy-ledger` / `dsh-ghg` 的 display name**：先改市场展示名，不改 npm 名。
17. **docs 的 `dsh-eval-harness.html` 是 redirect**，不是坏页；保留即可，但 sitemap/计数要说明“17 个包页 + 1 个 redirect”。

---

## 8. 市场化落地建议

### 8.1 一个 canonical catalog，四个视图

不要继续维护四个“家族名单”。建议在 `04-build/dsh-plugins/` 增加：

```text
catalog/
  family.json          # 125 条，唯一事实源
  taxonomy.json        # 本文的四轴定义
  schema.json          # JSON Schema
  views/
    by-category.json
    by-archetype.json
    by-domain.json
    by-status.json
```

每条记录至少：

```json
{
  "id": "dsh-einvoice",
  "kind": "plugin",
  "collection": "domain-ops",
  "category": "business-ops",
  "subcategory": "finance",
  "archetype": "ingest",
  "domains": ["finance", "china-einvoice"],
  "status": "active",
  "release": "alpha",
  "evidence": "public-synthetic",
  "install": { "npm": "dsh-einvoice", "bundle": true },
  "suite": "dsh-finops-suite",
  "relatedCheckers": ["dsh-invoice-ledger", "dsh-excel-reconcile"],
  "trust": { "license": "Apache-2.0", "provenance": true, "ci": "green" }
}
```

**派生**：profile 计数、`dsh-catalog` 99→125、`dsh-plugins` 站点、README 家族表、市场筛选器全部从 `family.json` 生成。  
**禁止**：再手写“15 个/62 个/125 个”到多个文件；用 `check-counts.mjs` 那种单一来源纪律。

### 8.2 对外分类的推荐映射

| 外部市场 | 建议 |
|---|---|
| DSH Desktop Market | 用 `category` + `domains` + `status`；先补 26 个缺失条目 |
| dshfind / dsh.market | 保留 `dsh-plugin` topic；package `keywords` 增加 `category:<slug>` 或统一 `dsh-category` 字段（若市场支持） |
| awesome-dsh-plugin | 每个条目给 `category` + 一句话；不要用 18 个中文 group |
| Claude Code / Codex 未来互通 | 用 `category` 映射：`business-ops`→Business & Operations/Finance；`compliance`→Security 或 Productivity；`developer-tools`→Developer Tools；`content`→Productivity |
| 自有站点 | 先做“按工作选”而不是“按家族选”：Finance、Legal、Compliance、Documents、Data、Developer Tools、Security、Research |

### 8.3 分阶段执行

**Phase 0（本周，P0 正确性）**

1. 修 2 个 suite × 5 语言的成员版本 + 成员说明（10 文件）。
2. 修 `packages.json` 17 个 release URL + `updated`；把 `RELEASE-MANIFEST.md` 标为历史或重写。
3. 17 个包 × 5 语言：fixture/ACCEPTANCE 相对链接改绝对 GitHub URL。
4. 修 profile 的 15 个 S1 句子。
5. 把 9 个新合规工具加入 `dsh-catalog` 和 `plugins.txt`（opt-in），或明确标注“not in mainline roster”。

**Phase 1（1–2 周，分类落地）**

6. 发布 `TAXONOMY.md` + `taxonomy.json`（本报告附带的 draft）。
7. `family.json` 先覆盖 62 + 17；主线 39 用本文 §3 的分类补。
8. 生成 `by-category` / `by-archetype` / `by-status` 视图；站点加筛选。
9. 17 个领域 README 加 “Related checkers” 小表。
10. suite 加 `SUITE.md`（成员/安装/卸载/升级/冲突）。

**Phase 2（2–4 周，市场质量）**

11. 8 个 active 领域包补 `screenshots.json` + hero；3 个旗舰补 GIF。
12. 8 个 active 领域包补 `TROUBLESHOOTING.md`。
13. `dsh-plugins` 补标准文件 + docs 生成器 + CI 版本/链接检查。
14. 提交 dshfind/dsh.market/awesome 时使用新分类，不再用“62 checkers”笼统描述。

**Phase 3（按需，旧债）**

15. 主线 54 目录按 touched 补 `PRIVACY.md`、`icon.svg`、五语；不强行重写 24 节 README。
16. 评估 `dsh-policy-ledger` / `dsh-docx-redline` 是否未来改名；当前先用 display name + alias，不破坏 npm 名。

### 8.4 成功指标

- **一个数字**：家族条目数只从 `family.json` 派生；profile/catalog/docs/README 不再各写一个。
- **一个分类**：每个条目恰好 1 个 category、1 个 archetype、≥0 个 domain；CI 校验。
- **零 404**：17 个 npm README 的相对链接全部可解析。
- **市场可见**：125 条全部出现在 `dsh-catalog`（或明确 deferred）；9 个新工具不再“只在 GitHub 目录里”。
- **关系可见**：17 个领域包每个至少 2 个具体 related checker/tool 链接。
- **风格门槛**：新包必须 5 README + 标准文件 + icon + screenshots.json；旧包不强制，但 touched 时补。

---

## 附录 A：53 个核心 checker 的域清单

| 域 | 成员 |
|---|---|
| 外贸（8） | `dsh-customs-doc-check`、`dsh-demurrage-ledger`、`dsh-export-ctl-check`、`dsh-forecast-penalty`、`dsh-hs-classify`、`dsh-lc-doc-check`、`dsh-origin-rvc-check`、`dsh-railway-window` |
| 质量（8） | `dsh-fmea-table-check`、`dsh-ota-review-check`、`dsh-pipeline-check`、`dsh-ppap-check`、`dsh-repair-order-qc`、`dsh-review-reply-check`、`dsh-spc-gbt-adapter`、`dsh-warranty-calc` |
| 安全（7） | `dsh-aqua-input-check`、`dsh-drill-script-check`、`dsh-emergency-plan`、`dsh-hazchem-check`、`dsh-hidden-risk-map`、`dsh-power-loss-split`、`dsh-power-ticket-check` |
| 招投标（7） | `dsh-bid-ca-precheck`、`dsh-bid-qual-check`、`dsh-contract-stance`、`dsh-protest-deadline`、`dsh-rulefile-check`、`dsh-tender-extract`、`dsh-tender-matrix` |
| 工程建设（7） | `dsh-eia-guide-check`、`dsh-guard-plan-qc`、`dsh-hazplan-check`、`dsh-permit-report-check`、`dsh-safety-brief-check`、`dsh-site-log-check`、`dsh-soilwater-check` |
| 研究（5） | `dsh-essay-rubric-check`、`dsh-learning-gap-check`、`dsh-nsfc-form-check`、`dsh-paper-doc-adapter`、`dsh-policy-brief-draft` |
| 公文（3） | `dsh-archive-check`、`dsh-gongwen-flow-check`、`dsh-gongwen-word-check` |
| 法律（3） | `dsh-evidence-check`、`dsh-lawcite-adapter`、`dsh-pleading-draft` |
| 医疗（3） | `dsh-icd-rule-check`、`dsh-medrec-qc`、`dsh-nurse-record-check` |
| 治理（2） | `dsh-soe-decision-check`、`dsh-sop-sync-check` |

## 附录 B：9 个新合规工具

| 工具 | 版本 | 类型 | 建议 |
|---|---:|---|---|
| `dsh-bid-health-check` | 0.1.0 | checker | 入 catalog，compliance |
| `dsh-canteen-retention-check` | 0.2.0 | checker | 入 catalog，compliance |
| `dsh-construction-doc-check` | 0.1.1 | checker | 入 catalog，compliance |
| `dsh-invoice-ledger` | 0.1.0 | checker | 入 catalog，compliance |
| `dsh-payroll-audit` | 0.1.0 | checker | 入 catalog，compliance |
| `dsh-safety-ledger-check` | 0.1.0 | checker | 入 catalog，compliance |
| `dsh-excel-reconcile` | 0.1.1 | reconciler | 入 catalog，data |
| `dsh-table-ingest` | 0.2.0 | extractor | 入 catalog，data |
| `dsh-tender-requirements` | 0.2.0 | extractor | 入 catalog，business-ops |

## 附录 C：核对命令

```sh
# 17 个领域包的元数据、README 章节、工具面
node - <<'NODE'
const fs=require('fs'),path=require('path');
const root='04-build';
for (const d of fs.readdirSync(root)) {
  const p=path.join(root,d,'package.json');
  if (!fs.existsSync(p)) continue;
  const j=JSON.parse(fs.readFileSync(p));
  if (!j.name?.startsWith('dsh-')) continue;
  const s=fs.readFileSync(path.join(root,d,'README-zh.md'),'utf8');
  console.log(j.name, j.version, (s.match(/^\| `[^`]+` \|/gm)||[]).length);
}
NODE

# 五语/标准文件/screenshots 覆盖
node - <<'NODE'
const fs=require('fs'),path=require('path');
for (const [label,root] of [['mainline','plugins'],['checkers','checkers'],['domain','04-build']]) {
  const dirs=fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name.startsWith('dsh-')).map(e=>e.name);
  const count=f=>dirs.filter(d=>fs.existsSync(path.join(root,d,f))).length;
  console.log(label, 'five=', count('README-zh.md'), 'privacy=', count('PRIVACY.md'), 'icon=', count('icon.svg'), 'shots=', count('screenshots.json'));
}
NODE

# npm tarball 是否包含 README 引用的 fixtures/ACCEPTANCE
node -e "const j=require('./04-build/dsh-fin-invoice-core/package.json'); console.log(j.files)"
```

---

## 附录 D：外部参考

- [Claude Code marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference)
- [Anthropic 官方 marketplace manifest](https://github.com/anthropics/claude-plugins-official/blob/main/.claude-plugin/marketplace.json)
- [Claude Code 插件市场说明](https://code.claude.com/docs/zh-CN/plugins/anthropic-marketplaces)
- [Codex 插件目录 11 类观察（2026-09-11）](https://news.qiniu.com/archives/1789094413719)
- [OpenAI Codex plugins 文档入口](https://developers.openai.com/codex/plugins)
- [DSH 插件市场调查（本工作区）](../../../../../DSH-MARKETPLACES-2026-10-19.md)
- [dsh-catalog 数据](../../../../../plugins/dsh-catalog/data/packages.json)
- [dsh-kit 安装清单](../../../../../plugins/dsh-kit/plugins.txt)
