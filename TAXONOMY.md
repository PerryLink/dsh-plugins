# DSH Plugin Taxonomy v1 — draft

**Status:** proposal for review, 2026-11-01. Not yet wired into the published catalog.  
**Companion analysis:** [DSH-PLUGIN-PORTFOLIO-ANALYSIS-2026-11-01.md](docs/analysis/DSH-PLUGIN-PORTFOLIO-ANALYSIS-2026-11-01.md)  
**Machine-readable seed:** [taxonomy.v1.json](taxonomy.v1.json) · **Validator:** `node scripts/check-taxonomy.mjs`

## 1. Why four axes

A DSH plugin can be described along four independent axes. One flat list cannot hold all of them without collisions.

| Axis | Question | Used for |
|---|---|---|
| `collection` | Which product line is this? | Internal navigation, release notes, “which wave” |
| `category` | What job does the user hire it for? | Marketplace primary filter |
| `archetype` | How does it work? | Capability filter, “is this a checker?” |
| `domain` | Which business subject? | Secondary filter / tags |

Plus **`status`** (`active` / `frozen` / `retired`) and **`trust`** (provenance, CI, certification, alpha/GA), which are not categories.

## 2. Collections

| id | Meaning |
|---|---|
| `mainline` | Runtime, workflow, UX, research, integrations, developer experience (the 2026-09 family). |
| `compliance` | 53 core China compliance checkers plus 9 newer compliance tools. |
| `domain-ops` | 15 public/synthetic domain tools plus 2 one-command suites (2026-10-31). |
| `infrastructure` | `dsh-kit`, `dsh-catalog`, certification, portal, installers. |

**Rule:** a collection is not a marketplace category. Do not create a filter called “compliance checkers & tools”; use `category` + `archetype`.

## 3. Categories (12)

| id | English | 中文 | Examples |
|---|---|---|---|
| `security` | Security & privacy | 安全与隐私 | `dsh-permission-rules`, `dsh-mask`, `dsh-defend` |
| `workflow` | Workflow & automation | 工作流与自动化 | `dsh-checkpoint-rewind`, `dsh-github`, `dsh-test-drive` |
| `developer-tools` | Developer tools | 开发者工具 | `dsh-mcp-panel`, `dsh-plugin-guide`, `dsh-policy-ledger`, `dsh-eval-pack` |
| `integrations` | Integrations & messaging | 集成与消息 | `dsh-ticktick`, `dsh-phone-inbox`, `dsh-reach` |
| `research` | Research & knowledge | 研究与知识 | `dsh-research-report`, `dsh-industry-research`, `dsh-fund-research` |
| `content` | Content & documents | 内容与文档 | `dsh-docx-redline`, `dsh-library`, `dsh-translate` |
| `data` | Data & analytics | 数据与分析 | `dsh-ifc-qto`, `dsh-pim-lint`, `dsh-data-quality` |
| `observability` | Observability & cost | 可观测与成本 | `dsh-observe`, `dsh-fast`, `dsh-budget` |
| `interface` | Interface & experience | 界面与体验 | `dsh-composer-history`, `dsh-output-styles`, `dsh-click` |
| `business-ops` | Business operations | 业务运营 | 15 domain tools + 2 suites |
| `compliance` | Compliance & verification | 合规与核查 | 59 checker-first tools |
| `platform` | Platform & infrastructure | 平台与基础设施 | `dsh-kit`, `dsh-catalog`, certification, portal |

### 3.1 Why these names

- They match how Claude Code and Codex present plugins: broad **job** labels, not implementation labels.
- `compliance` is kept because there is real supply (59 checker-first tools) and users search for it. It is not a synonym for “any tool that validates something”.
- `business-ops` absorbs finance, legal, ESG, quality, trade, logistics and documents as **domain tags**, instead of creating 10 small categories.
- `platform` is for support infrastructure; it should not appear as a normal installable plugin card.

## 4. Archetypes

| id | Contract | Examples |
|---|---|---|
| `checker` | Versioned rule pack / record set → findings with locator and evidence; read-only; no adjudication. | 53 core checkers; `dsh-freight-audit` |
| `validator` | Schema/format/check-digit validation; no versioned regulatory pack. | `dsh-pim-lint`, `dsh-eval-pack` |
| `doctor` | Diagnose install/runtime/capability. | `dsh-policy-ledger`, `dsh-plugin-doctor` |
| `inspector` | Inspect structure, hashes or diffs; does not adjudicate compliance. | `dsh-docx-redline` |
| `ingest` | Import/parse/dedupe/archive. | `dsh-einvoice`, `dsh-legal-intake` |
| `extractor` | Pull structured fields from documents/models. | `dsh-ifc-qto`, `dsh-table-ingest` |
| `assistant` | Model-assisted candidates or advice; not a determination. | `dsh-hs-candidate` (secondary) |
| `reconciler` | Match two or more sources. | `dsh-bankrec`, `dsh-ap-three-way`, `dsh-travel-recon`, `dsh-excel-reconcile` |
| `calculator` | Compute derived values. | `dsh-ghg`, `dsh-warranty-calc` |
| `ledger` | Stateful register/workflow. | `dsh-qms-capa`, `dsh-invoice-ledger` |
| `drafter` | Generate/complete a document. | `dsh-pleading-draft`, `dsh-policy-brief-draft` |
| `integration` | External service bridge. | `dsh-github`, `dsh-ticktick`, `dsh-reach` |
| `ui` | UI/output/interaction. | `dsh-output-styles`, `dsh-click` |
| `runtime` | Permission/memory/routing/hook. | `dsh-permission-rules`, `dsh-memento` |
| `suite` | Installs members only; no tool surface. | `dsh-finops-suite`, `dsh-contract-suite` |
| `catalog` | Catalog/certification/install infrastructure. | `dsh-catalog`, `dsh-plugin-certification` |

### 4.1 Checker test (five questions)

A tool may carry `archetype=checker` only if all five are true:

1. Input is a register/record set, not an arbitrary document.
2. Rules are externalized/versioned and have a traceable source.
3. Findings include locator, found, expected, fix, rule id and severity.
4. The check is read-only and does not make a legal/medical/customs/tax determination.
5. The primary output is findings/evidence, not a transformed business artifact.

`dsh-pim-lint` fails 2; `dsh-eval-pack` fails 2; `dsh-docx-redline` fails 3/4/5; `dsh-policy-ledger` fails 2; `dsh-ghg` fails 4/5; `dsh-travel-recon` fails 5 (it is a reconciler with a policy-check facet).

## 5. Domain tags

`finance`, `legal`, `esg`, `quality`, `trade`, `logistics`, `construction`, `healthcare`, `government`, `manufacturing`, `education`, `hr`, `research`, `documents`, `bim`, `retail`, `china`, `local-first`.

A plugin can have multiple domains. Domain tags do not affect the primary category.

## 6. Placement of the 15 domain tools

| Plugin | category | archetype | checker? | Domain |
|---|---|---|---|---|
| `dsh-einvoice` | `business-ops` | `ingest` | no | finance, china-einvoice |
| `dsh-bankrec` | `business-ops` | `reconciler` | no | finance, banking |
| `dsh-ap-three-way` | `business-ops` | `reconciler` | no | finance, accounts-payable |
| `dsh-travel-recon` | `business-ops` | `reconciler` | facet | finance, travel-expense |
| `dsh-legal-intake` | `business-ops` | `ingest` | no | legal, intake |
| `dsh-legal-clause` | `business-ops` | `checker` | adjacent | legal, contracts |
| `dsh-ghg` | `business-ops` | `calculator` | no | esg, emissions |
| `dsh-qms-capa` | `business-ops` | `ledger` | no | quality, manufacturing |
| `dsh-hs-candidate` | `business-ops` | `checker` | adjacent | trade, customs |
| `dsh-freight-audit` | `business-ops` | `checker` | strong | logistics, freight |
| `dsh-docx-redline` | `content` | `inspector` | no | documents |
| `dsh-ifc-qto` | `data` | `extractor` | no | construction, bim |
| `dsh-policy-ledger` | `developer-tools` | `doctor` | no | plugin-install |
| `dsh-pim-lint` | `data` | `validator` | no | retail, pim |
| `dsh-eval-pack` | `developer-tools` | `validator` | no | evaluation |
| `dsh-finops-suite` | `business-ops` | `suite` | no | finance |
| `dsh-contract-suite` | `business-ops` | `suite` | no | legal |

**Do not** move these 15 into the 53-checker collection. `checker` is a cross-tag for three of them, not a home.

## 7. Compliance collection split

```text
62 compliance tools
= 53 core checkers (opt-in; citation gate)
+ 6 newer checker/audit tools
+ 3 workbench tools (reconcile / ingest / extract)
```

The 3 workbench tools still live in the compliance repository, but their market category should be `data` or `business-ops`, not `compliance`.

The 9 newer tools are **catalog-only**: they are not in `dsh-kit/plugins.txt` (the mainline opt-in roster). They are installed by exact npm name or through the compliance workflow; do not describe them as default/opt-in mainline installs.

## 8. Suites

- `kind = suite`; `archetype = suite`; `category` inherits the lead domain (`business-ops`).
- A suite card must show `members[]` and say “installer only; members keep their own tools and versions”.
- A suite must not claim a tool surface.
- Exact dependency pins are fine for alpha; every member bump requires a suite release. Add `SUITE.md` with install/uninstall/upgrade/conflict semantics.

## 9. Validation rules (for CI)

1. Every item has exactly one `category` and one `archetype`.
2. `category=compliance` only if `archetype=checker` or `collection=compliance`.
3. `archetype=checker` only if `checker=true`.
4. `kind=suite` only if `archetype=suite` and `members.length > 0`.
5. `status` is one of `active|frozen|retired`; retired items are never installable by default.
6. Every item has `license`, `repo`, `npm` (or `kind=infrastructure`), and a `docs` URL.
7. Counts in README/profile/docs are generated from this file, never hand-written.

## 10. Rollout

- **Phase 0:** fix suite member versions, `packages.json` release URLs, npm-relative fixture links, profile count sentence.
- **Phase 1:** publish this taxonomy and a `family.json` covering 62 + 17; generate views.
- **Phase 2:** add screenshots/GIF and troubleshooting for active domain packages; add related-checker links.
- **Phase 3:** backfill legacy mainline `PRIVACY`/icon/five-language debt only when touched. The measured backlog is in [LEGACY-DEBT.md](LEGACY-DEBT.md).
