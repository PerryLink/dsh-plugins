# 上游需求：让 DSH 的插件市场对非程序员可用

> 提交状态：**未提交**。`deepseek-ai/deepseek-harness` 当前 `has_issues = false`（2026-11-02 核实），无法开 issue；本文件是可直接粘贴的请求稿，待上游开放 issue 或讨论渠道后提交。
> 背景：PerryLink 的 126 行插件家族、125 条 format 1 索引已就绪（`https://perrylink.github.io/dsh-plugins/market/index.json`）。以下 5 条是"非程序员能不能用起来"的硬门槛。

---

## E1 · 插件市场默认可见，并内置一个官方索引源

**现状**：Web GUI 的 Discover 需要先启用实验 bundle「Custom plugin indexes」，再手动添加索引 URL；`docs/user/guide/plugin-market.md` 明写 *"DSH ships no index source"*。结果是：默认界面上**没有任何插件可被发现**。

**证据**：
- `packages/util/official-bundles/src/bundles.ts` —— 市场相关 bundle 默认关闭
- `docs/user/guide/plugin-market.md` —— 添加索引源为手动步骤
- 我们的对照实验：125 条 format 1 索引已上线，但产品内无入口，只能靠用户手动粘贴 URL

**请求**：
1. 把「Discover / 插件市场」从实验 bundle 提升为默认可见（可保留开关关闭网络）。
2. 内置一个官方索引源（可为空列表 + 提示"添加你自己的索引"），或至少提供一个"官方推荐索引"占位 URL。
3. 在市场空态时给出"如何添加索引源"的 3 步指引。

**收益**：非程序员第一次打开就能看到"能装什么"，而不是一个空标签页。

---

## E2 · 首次使用不要强制"先选磁盘工作区"

**现状**：新建会话前必须选择一个磁盘目录作为工作区，否则输入框禁用（`docs/user/guide/index.zh.md`）。对非程序员，"选一个目录"是不可解释的概念，也是首次使用的第一个卡点。

**证据**：`docs/user/guide/index.zh.md` —— 工作区选择先于输入；我们的 5 人首跑实验设计里，这一步是主要劝退点。

**请求**：
1. 提供默认沙盒工作区（例如 `$DSH_HOME/workspaces/default`），首次进入直接可用。
2. 保留"高级：选择我的目录"，但不作为前置条件。
3. 在拖入文件时自动把文件所在目录或一个会话级临时目录设为工作区。

**收益**：把"打开就能用"从 3 步降到 0 步。

---

## E3 · 插件声明式 UI：用 JSON 声明表单/按钮/向导，而不是只能写 React

**现状**：插件要在界面上给用户提供表单、按钮、向导，只能自己写 React 客户端（`packages/client/ui-plugin-manager`、`docs/subsystems/tools.zh.md`）。结果是：面向会计/法务/HR 的插件几乎都无法提供"填个表、点一下"的体验，只能让用户对着聊天框说话。

**证据**：
- `docs/subsystems/tools.zh.md` —— 工具只有 schema，没有 UI 描述
- 工作区里 21 个插件带客户端半侧（React），全部是开发者工具；面向业务的插件没有一个有 UI
- 我们的 21 个 T1 工具全部只能靠"一句话话术"驱动

**请求**：提供一个声明式 UI 约定（例如 `dsh.ui` 字段），支持：
- `form`（字段 → 工具参数，含文件选择器）
- `action`（按钮 → 工具调用）
- `wizard`（多步，含"上一步/下一步/运行"）
- `result`（结果卡片：表格/文件下载/摘要）
渲染器由宿主提供，插件只给 JSON。

**收益**：业务插件不必写前端，就能给非程序员一个可点击的界面。

---

## E4 · Office 写回：让用户拿回改好的 .docx / .xlsx

**现状**：拖入的 docx/pptx 只做**只读**转 PDF 预览（`docs/subsystems/office-to-pdf.zh.md`）；没有"把修改后的文件还给用户"的路径。而我们的 `dsh-docx-redline` 正是产出修订版 docx 的包，用户拿不到文件。

**证据**：`docs/subsystems/office-to-pdf.zh.md`；`packages/client/ui-sidebar-documentpreview` 只读渲染；我们的 `doc.replace_text` / `redline.diff` 输出只能落在 `$DSH_HOME`。

**请求**：
1. 附件/交付物支持"下载/另存为"，把插件写出的 docx/xlsx 交给用户。
2. 或在会话里渲染一个"文件卡片"，点击可保存到用户选择的位置。

**收益**：非程序员的产出物就是 Office 文件；没有写回，链路就断在最后一步。

---

## E5 · 人话权限档

**现状**：权限话术是 `sandbox` / `danger-full-access` / "逐次批准"（`docs/subsystems/permission-presets.zh.md`）。非程序员无法据此判断"这个插件会不会把我的合同传出去"。

**证据**：`docs/subsystems/permission-presets.zh.md`；我们的 PS1（`docs/PACKAGE-STANDARD.md`）已经要求插件用"读/写/联网/外部系统"四行披露，但产品界面不展示这四行。

**请求**：
1. 在插件详情页和安装确认框里，展示插件声明的四行权限（读什么、写哪里、是否联网、连哪些外部系统）。
2. 用业务语言替代 `sandbox`/`danger-full-access`（例如"只能读写你选的文件"/"可以执行命令，谨慎使用"）。
3. 对声明 `network: true` 的插件，在安装时单独提示域名与用途。

**收益**：信任是非程序员使用插件的前提；现在的术语体系只对开发者可读。

---

## 附：我们这边已经就绪的部分

| 能力 | 状态 |
|---|---|
| format 1 索引 | 125 个插件、125 个中文标题，`market/index.json`，JSON 200 可访问 |
| 中文名 + 任务族 | 126/126 有中文名；11 个任务族 |
| 首跑三件套 | 10 个包已达 PS1 10/10（样例 + 一句话 + 权限四行 + 真实截图） |
| 权限披露 | 每包 README 四行 + `dsh.demo` 元数据 |
| 证据 | 每包 ACCEPTANCE + 真实运行截图 |

上游只要给出 E1/E3/E4 三个入口，插件侧即可在 1–2 周内把财务、合同、采购、HR、建筑五个职能包做成"点开就能用"的形态。
