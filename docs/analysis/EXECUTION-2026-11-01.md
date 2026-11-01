# P0–P2 execution record — 2026-11-01

This is the completion record for the plan in [DSH-PLUGIN-PORTFOLIO-ANALYSIS-2026-11-01.md](DSH-PLUGIN-PORTFOLIO-ANALYSIS-2026-11-01.md). It records what shipped, not a new proposal.

## Published

**17/17 packages re-published** with npm provenance, GitHub pre-releases, and green CI/publish workflows:

| Family | Versions |
|---|---|
| Finance | `dsh-einvoice 0.2.0-alpha.7` · `dsh-bankrec 0.1.0-alpha.10` · `dsh-ap-three-way 0.1.0-alpha.7` · `dsh-travel-recon 0.1.0-alpha.9` · `dsh-finops-suite 0.1.0-alpha.6` |
| Legal | `dsh-legal-intake 0.1.0-alpha.6` · `dsh-legal-clause 0.1.0-alpha.8` · `dsh-contract-suite 0.1.0-alpha.5` |
| ESG / quality | `dsh-ghg 0.1.0-alpha.12` · `dsh-qms-capa 0.1.0-alpha.8` |
| Trade / logistics | `dsh-hs-candidate 0.1.0-alpha.8` · `dsh-freight-audit 0.1.0-alpha.9` |
| Documents / data | `dsh-docx-redline 0.1.0-alpha.9` · `dsh-ifc-qto 0.1.0-alpha.9` · `dsh-pim-lint 0.1.0-alpha.7` |
| Developer utilities | `dsh-policy-ledger 0.2.0-alpha.9` · `dsh-eval-pack 0.1.0-alpha.7` |

- 17/17 npm `latest` versions carry provenance.
- 17/17 `publish` and `ci` workflows are green.
- Install smoke **17/17** passed: run [41282448151](https://github.com/PerryLink/dsh-plugins/actions/runs/41282448151).
- 17/17 GitHub pre-releases exist at the current tag.
- All 17 npm root READMEs now have **no relative `fixtures/`/`ACCEPTANCE.csv` links**; they resolve to the GitHub repository.

## P0

- [x] Suite member tables and “members are not tools” wording fixed in all five languages (2 suites).
- [x] `packages.json` release URLs and `updated` synced to current versions.
- [x] `RELEASE-MANIFEST.md` rewritten to the 15 + 2 current release instead of old scoped versions.
- [x] Fixture/acceptance links in 17 packages × 5 READMEs changed to absolute GitHub URLs.
- [x] Profile 15-package sentence corrected to 8 active + 7 frozen; catalog count 126; compliance badge.
- [x] Nine newer compliance tools added to the catalog; marked `roster:false` (not in `dsh-kit/plugins.txt`).

## P1

- [x] `TAXONOMY.md` + `taxonomy.v1.json` (79 curated items: 62 compliance + 15 domain + 2 suites).
- [x] `family.json` 125 rows: 107 active / 15 frozen / 3 retired; views by category/archetype/status.
- [x] Generated `docs/taxonomy.html` with collection/category/archetype/status filters.
- [x] 15 domain package READMEs carry specific `Related checkers`/`Related tools` tables; four translated pointers.
- [x] `SUITE.md` for both suites, with member pins, install/uninstall/upgrade and no-tool semantics.
- [x] Catalog metadata: category, archetype, domains, status on all 17 `packages.json` rows; docs pages show the same.
- [x] Aggregate standard files (`SECURITY`, `PRIVACY`, `CODE_OF_CONDUCT`, `CONTRIBUTING`, `CHANGELOG`, `icon.svg`) and a docs CI workflow.

## P2

- [x] Eight active domain packages: real terminal hero PNG + demo GIF, `screenshots.json`, `TROUBLESHOOTING.md`, tarball `files[]`, README image and English troubleshooting link.
- [x] `dsh-catalog` grew from 109 to **126** live records (17 domain + existing 109; includes the checker suite). Rebuilt icons and level sidecar; CI and deploy green.
- [x] Profile links the taxonomy and the 126-package catalog.
- [x] Legacy mainline debt measured and tracked in `LEGACY-DEBT.md`; no mass rewrite of 54 old READMEs (conditional P2 policy).

## Verification

- `node scripts/check-taxonomy.mjs` — 79 items, 59 checker-first + 3 workbench in compliance.
- `node scripts/build-family.mjs` — deterministic 125 rows.
- `node scripts/build-docs.mjs` — deterministic 125-row page.
- `node scripts/check-docs.mjs` — 15 packages + 2 suites; all docs pages and media checks pass locally.
- `dsh-plugins` docs CI: green.
- `dsh-catalog` CI + deploy: green on `b02b722`; live payload 126 items.
- Live taxonomy page: <https://perrylink.github.io/dsh-plugins/taxonomy.html> 200.

## Remaining / external

- External directories (dshfind, dsh.market, awesome-*) will pick up the new versions/categories on their own crawl or on the next submission; no new third-party PR was opened in this pass.
- Legacy mainline PRIVACY/icon/five-language debt is tracked; it is deliberately not bulk-rewritten.
- `dsh-policy-ledger` / `dsh-docx-redline` / `dsh-ghg` keep their npm names; the marketplace display names now qualify them (Install Doctor, DOCX Inspect & Text Diff, Electricity GHG Scope 2).

## Follow-up — taxonomy, roster, mirrors and Dependabot

### Live catalog

- All 126 catalog items now use the **12-category** vocabulary in `categories` (business-ops, compliance, content, data, developer-tools, integrations, interface, observability, platform, research, security, workflow).
- The archetype/domain projection is the **`/v1/taxonomy` sidecar** (`dsh-taxonomy-sidecar/1`, 126 packages, 12 categories, 16 archetypes), generated beside the v1 page so the provider schema stays valid.
- `dsh-catalog` CI, deploy and the `/v1/taxonomy` live-smoke pass; the deployed payload was verified through a commit-pinned jsDelivr read as 126 items / 12 categories.

### Roster closure

- [ROSTER.md](../../ROSTER.md) defines the exact three surfaces: 125 family rows (107/15/3), 96 `dsh-kit` install specs (43 default + 53 opt-in), and 126 catalog records (122 shared + 3 family-only infrastructure + 4 catalog-only).
- `dsh-kit/family.txt` adds a separate 117-package family installer (39 + 53 + 10 + 15); it excludes the two domain suites, 3 retired packages and 3 support repositories.
- `family.json` now carries `installScope`; the generated taxonomy page has an install-scope filter and 125 per-package pages.

### Mirrors

- Gitee: new releases and assets for 5 flagships (einvoice, bankrec, ghg, hs-candidate, ifc-qto) plus both suites.
- GitCode: new releases and assets for 3 flagships (einvoice, bankrec, docx-redline) plus both suites.
- Both aggregates were updated to the latest docs/roster commit.

### Dependabot

- Audited 432 repos / 191 configs; all configs removed on the branch refs.
- Open Dependabot PRs: 0; 373 `dependabot/*` branches deleted; historical closed PR records remain because GitHub does not expose PR deletion.
- Vulnerability alerts were left intact; automated security updates were not enabled where queried.

- Audited 432 PerryLink repos; **191** had `.github/dependabot.yml`; all 191 are now absent on the branch ref.
- Open Dependabot PRs: **0**; all remaining Dependabot PR records are closed history (GitHub does not expose PR deletion).
- **356+** `dependabot/*` branches deleted.
- Automated security updates were not enabled on the repos where the API was queried; vulnerability alerts were left intact.

### Public docs hosting

- The project Pages site hit a stale `b412d6b` deployment lock and was removed. The same URL is now served from the user Pages repository (`PerryLink/perrylink.github.io/dsh-plugins/`), so no URL change is needed.
- `https://perrylink.github.io/dsh-plugins/`, `taxonomy.html`, `packages/dsh-bankrec.html` and `family/dsh-einvoice.html` all return 200.
- The 125 family pages, 17 domain package pages and the taxonomy filter are live.

### Touched legacy package

- `dsh-lsp-actions` was touched for the Dependabot cleanup; it now also has `PRIVACY.md`, `icon.svg`, five README links and `package.json files[]`, verified with `npm pack --dry-run` and `readme-sync`. The other 53 legacy directories remain tracked in `LEGACY-DEBT.md`, not bulk-rewritten.

### External directory (1024Store)

- Submitted `dsh-ghg` as one catalog entry to `imsai-sh/awesome-deepseek-harness-plugins`; static review passed and PR #781 merged. This is an additional domain entry beyond the earlier checker submissions.
