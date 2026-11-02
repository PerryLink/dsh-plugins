# Package Standard v1（PS1）

> 面向**非程序员**的插件交付标准。验收定义：一个不看源码的人，**3 分钟内**能完成「装上 → 跑样例 → 看懂结果」。
> 适用范围：`family.json` 中 status 为 active 的全部插件；`infrastructure` 与 `retired` 照打分但不设门槛。

---

## 1. 详情页八块（README-zh 首屏，顺序固定）

| # | 块 | 要求 |
|---|---|---|
| 1 | 一句话 | ≤60 字，写清"对什么文件做什么、产出什么"；不出现 Agent/插件/工作流 |
| 2 | 适合 / 不适合 | 各 ≥1 条，用业务语言（"适合：几十到几百张发票"） |
| 3 | 输入 | 文件格式、编码、大小上限、从哪来 |
| 4 | 输出 | 产出什么、落在哪里、是否改原文件 |
| 5 | 示例 | 一句可直接复制的话术 + 一张真实运行截图 |
| 6 | 权限 | 四行模板（见 §3） |
| 7 | FAQ | ≥3 条：装不上 / 结果不对 / 能处理我的文件吗 |
| 8 | 版本 | 与 `package.json` 一致，附测试通过数 |

缺任一块 → 该项 0 分。

## 2. 首跑三件套

1. **样例**：`samples/quickstart/input/`（合成或公开数据，≤500 KB）+ `samples/quickstart/expected/`（金标：JSON/文本，二进制给 SHA-256）。`package.json` 的 `files` 必须含 `samples`。
2. **一句话话术**：`package.json` 的 `dsh.demo.prompt`，第一人称 + 真实单据 + 期望产出；README 同步同一句。
3. **真实截图**：`docs/assets/quickstart.png`，由真实运行输出渲染，禁止拼接；`screenshots.json` 记 `command` / `run_at` / `output_sha256`。

```json
"dsh": {
  "demo": {
    "sample": "samples/quickstart/input/invoice.ofd",
    "prompt": "用自带样例跑一次查重，把重复的那张标出来",
    "expect": "samples/quickstart/expected/duplicates.json",
    "screenshot": "docs/assets/quickstart.png",
    "reads": ["用户指定的发票文件"],
    "writes": ["$DSH_HOME/dsh-einvoice"],
    "network": false,
    "external": []
  }
}
```

## 3. 权限四行（必须与源码一致）

```
读：<用户指定路径/格式>；不读其他目录
写：$DSH_HOME/<子目录>；不改原文件
联网：否（是则写域名/用途/能否关闭）
外部系统：无（有则写名称/写入内容/凭据）
```

- 声明 `network: false` 的包，源码中不得出现 `fetch(`、`http(s).request`、`net.connect`、`WebSocket`、`axios` 等。
- 写文件的工具必须在 README 标 R1（本地写），只读工具标 R0。

## 4. 错误规范

**格式**：`<一句人话>（E_<域>_<原因>）｜下一步：<一个动作>`

- 例：`这不是 OFD/XML 发票（E_INVOICE_UNSUPPORTED）｜下一步：改用自带样例里的 .ofd`
- 禁止把 stack、errno、内部绝对路径直接给用户；详情写日志。
- `TROUBLESHOOTING.md` 每条错误要有"症状 / 原因 / 动作"三行。

## 5. 证据

- `screenshots.json`：quickstart 条目含 `path` / `command` / `run_at` / `output_sha256` / `log_sha256`。
- `ACCEPTANCE.csv`：至少一行含 `req_id,metric,threshold,actual,script,evidence_sha256,pass,source,counted`。
- 测试：`pnpm test`（或 `node --test`）退出码 0，且通过数与 README 声明一致。
- alpha 与 `counted=false` 的标注必须保留。

---

## 6. 打分表（10 分）

| # | 检查项 | 分 | 自动判据 |
|---|---|---:|---|
| 1 | 详情页完整性 | 1 | 首屏含 8 块固定标签；一句话 ≤60 字；FAQ ≥3；版本号一致 |
| 2 | 样例入包 | 2 | `files` 含 `samples`；`npm pack --dry-run --json` 里含 `samples/quickstart/input/*` 且 ≤500 KB |
| 3 | 一键话术 | 1 | `dsh.demo.prompt` 非空、不含 `pnpm test`；README 同文 |
| 4 | 预期输出 | 1 | `samples/quickstart/expected/` 非空；`dsh.demo.screenshot` 在包内 |
| 5 | 权限 | 2 | 四个字段齐全（1）；`network:false` 时源码无网络调用、写工具标 R1（1） |
| 6 | 错误规范 | 1 | 源码有 `E_*`；TROUBLESHOOTING ≥3 行符合格式 |
| 7 | 证据 | 2 | 截图条目含 command/日期/哈希（1）；ACCEPTANCE 有 pass 行 + 测试退出 0（1） |

**等级**：绿 = ≥8 且每项 >0；黄 = 6–7；红 = ≤5。**上架线：≥8 且每项 >0。**

## 7. 自动检查

`scripts/score-packages.mjs` 对 125 条逐包打分并输出 CSV：

```bash
node scripts/score-packages.mjs              # 打印汇总
node scripts/score-packages.mjs --csv out.csv  # 明细
node scripts/score-packages.mjs --gate 8     # 低于 8 分退出 1（用于 CI）
```

实现要点：
- 元数据从 `family.json` + 各包 `package.json` 读取；
- 有本地 checkout 时读 `samples/`、`docs/assets/`、`TROUBLESHOOTING.md`、`README-zh.md`；
- `network:false` 用 grep 源码判定；
- 无 checkout 的包按"仅元数据"打分并在 `missing` 列标注；
- 不做网络请求，纯本地。

## 8. 现状（2026-11-02）

| 层 | 包数 | 当前典型分 | 主要失分 |
|---|---:|---|---|
| T1（文件进→交付物出） | 21 | 4–6 | 样例未入包、无话术、权限用工程语言 |
| T2（规则库/专业解读） | 54 | 3–5 | 无样例、无截图命令、无 ACCEPTANCE（checker 已补） |
| T3（开发者工具） | 50 | 2–4 | 不适用非程序员标准，仅保留元数据 |

目标：T1 全部 ≥8；T2 全部 ≥6；T3 不设门槛但需有中文名与权限说明。
