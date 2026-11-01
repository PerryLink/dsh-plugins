# Domain upgrade program — 2026-11-01

**Scope:** the 15 domain packages + 2 suites in [RELEASE-MANIFEST.md](../RELEASE-MANIFEST.md).
**Goal:** each package must carry at least the capability set its category expects, plus more depth and
better stability, without copying third-party code.

## 1. Intellectual-property rules (non-negotiable)

1. **Clean room.** Implement from public *specifications and standards*, not from another project's source.
   Do not read a competitor's implementation to transcribe it.
2. **No code, comments, identifiers, fixtures or test data lifted** from MIT/Apache/other projects.
3. **Spec-first provenance.** Every new capability records the standard and clause it implements in
   `CHANGELOG.md` (e.g. "EN 16931 §BG-25", "GHG Protocol Scope 2 ch. 6").
4. **Own fixtures only.** Tests use our own public/synthetic fixtures; no third-party sample files.
5. **No licence drift.** Our packages stay Apache-2.0 and contain no borrowed licence headers or NOTICE
   entries. If a third-party runtime dependency is unavoidable, pin it and record it in
   `THIRD-PARTY-NOTICES` — never vendor its source into our tree.
6. **No scraped competitor data** in fixtures, docs, screenshots or marketing copy.

## 2. Standard anchors per package

| Package | Public standard / spec to implement against |
|---|---|
| `dsh-einvoice` | EN 16931-1 (UBL/CII), PEPPOL BIS 3.0, XRechnung 3.x, Factur-X/ZUGFeRD |
| `dsh-bankrec` | ISO 20022 camt.053/054, MT940, IBAN ISO 13616 + mod-97, ISO 4217 |
| `dsh-ap-three-way` | PO–GR–invoice tolerance model, ISO 20022 pain.001 |
| `dsh-travel-recon` | Card/expense statement matching, ISO 4217, merchant normalisation |
| `dsh-legal-intake` | Matter intake fields, conflicts/duplicate-party checks |
| `dsh-legal-clause` | Clause taxonomy + playbook deviation rules |
| `dsh-ghg` | GHG Protocol Scope 2 guidance, ESRS E1, national grid factor tables |
| `dsh-qms-capa` | ISO 9001:2015 §8.5.6/§10.2, 8D / 5-Why structure |
| `dsh-hs-candidate` | HS 2022 nomenclature, RVC/regional-value rules |
| `dsh-freight-audit` | Rate-card versioning, accessorials, net/gross charge model |
| `dsh-docx-redline` | OOXML WML (ISO/IEC 29500), tracked-change semantics |
| `dsh-ifc-qto` | IFC 4.3 (ISO 16739-1), quantity-take-off model |
| `dsh-pim-lint` | GS1 GTIN rules, EAN-13/UPC check digit, attribute completeness |
| `dsh-policy-ledger` | Policy versioning, attestation and evidence chain |
| `dsh-eval-pack` | Deterministic eval harness, pass@k / rubric scoring |

## 3. Phases

- **P1 Capability parity** — close the functional gaps in §2; one tool or handler per gap, with tests.
- **P2 Stability** — explicit limits (row/size caps), deterministic ordering, stable error codes
  (`E_*`), no silent coercion, round-trip checks.
- **P3 Evidence** — one `ACCEPTANCE.csv` row per new capability, a real command capture (no generated
  cards) and a `screenshots.json` entry naming the command and pass count.
- **P4 Release** — version bump, npm publish with provenance, GitHub pre-release, mirror assets,
  docs + roster + manifest refresh.

## 4. Definition of done (per package)

```text
[ ] every P1 gap closed with a test that fails before and passes after
[ ] P2 limits/errors covered by tests
[ ] ACCEPTANCE.csv rows updated (public/synthetic, partial, not counted)
[ ] real terminal capture replaces any generated card
[ ] CHANGELOG names the standard + clause for each new capability
[ ] npm latest + GitHub pre-release + docs page agree on the version
```

## 5. Progress

P1 capability work is complete for all 15 packages.

**P3 progress (2026-11-01 late):** all 15 packages now regenerate `ACCEPTANCE.csv` from their own
`scripts/acceptance.mjs`, and every script carries at least one row for the new capability (95 rows in
total, all `public/synthetic` / `counted=false`).

**Captures (2026-11-01 late):** all 15 packages carry `docs/assets/<pkg>-capability.png`, rendered by
`scripts/render-capture.py` from the actual `node --test` transcript of the new capability test
(15 images, 465 KB). Each `screenshots.json` names the exact command, test count and caveat; the seven
packages that had no `screenshots.json` at all (the previously frozen set) now have one.

## 5b. Second capability wave (2026-11-01 late)

| Package | New capability | Standard | Tests | Release |
|---|---|---|---|---|
| `dsh-bankrec` | `bankrec.ingest_camt054` — CAMT.054 notifications as bank rows | ISO 20022 camt.054 | 15/15 | `0.1.0-alpha.13` |
| `dsh-ghg` | `ghg.scope3_summary` — the 15 Scope 3 categories with diagnostics | GHG Protocol Corporate Value Chain Standard | 13/13 | `0.1.0-alpha.15` |

**Pipeline defect found:** on this 9p-mounted workspace git can treat a same-size, same-second rewrite as
unchanged (racy stat cache) — `package.json` and `scripts/lint.mjs` silently stayed at the old version in
two releases. `release-package.mjs` now bumps the mtime of every edited file before staging, and derives
the next version from `origin/main` rather than the stale local clone.

| `dsh-einvoice` | `invoice.code_check` — ISO 4217 currency, ISO 3166-1 country, EN 16931 BR-CL-17 VAT category | EN 16931 | 31/31 | `0.2.0-alpha.9` |

| `dsh-pim-lint` | `pim.sscc_check` — SSCC 18-digit GS1 mod-10 | GS1 General Specifications | 8/8 | `0.1.0-alpha.9` |
| `dsh-docx-redline` | `doc.relationship_check` — OOXML relationship integrity | ISO/IEC 29500 package model | 22/22 | `0.1.0-alpha.11` |

| `dsh-qms-capa` | `qms.capa_effectiveness` — close-readiness: state gate, overdue, recurrence | ISO 9001:2015 10.2 | 13/13 | `0.1.0-alpha.10` |
| `dsh-freight-audit` | `freight.accessorial_check` — charge types, duplicates, agreed list, cap | freight audit practice | 13/13 | `0.1.0-alpha.11` |

| `dsh-hs-candidate` | `hs.rvc_report` — simple ratio / build-down / build-up RVC | WTO/WCO rules of origin | 11/11 | `0.1.0-alpha.10` |
| `dsh-ifc-qto` | `ifc.unit_check` — unit assignment before trusting a take-off | IFC 4.3 IfcUnitAssignment | 12/12 | `0.1.0-alpha.11` |

## 6. Release recipe (verified on 2026-11-01)

Publishing locally would lose npm provenance, so releases go through each package's `publish.yml`
(tag `v*` → tests, `pnpm gate`, tag/ancestry checks → `npm publish --provenance` → GitHub pre-release
with tarball, SBOM, ACCEPTANCE and SHA256SUMS).

```text
1. git -C <pkg> fetch origin && git worktree add /tmp/<pkg>-rel origin/main -b release/alpha
2. copy the changed src/test/scripts/docs files into the worktree
3. bump package.json version AND the hardcoded version inside scripts/lint.mjs
4. retitle CHANGELOG "## [Unreleased]" to "## [x.y.z] — <date>"
5. build / typecheck / lint / test / gate / npm pack --dry-run (check files[])
6. commit, push HEAD:refs/heads/main, tag -a v<x.y.z>, push refs/tags/v<x.y.z>
7. watch the publish run; verify npm <pkg>@<version> attestations and the pre-release assets
8. update packages.json (version, release URL, frozen=false) and RELEASE-MANIFEST.md
```

Released this way: `dsh-pim-lint 0.1.0-alpha.8`, `dsh-eval-pack 0.1.0-alpha.8` (both with provenance).

**Released (2026-11-01 late):** all 15 packages are on npm with provenance and a GitHub pre-release
carrying the tarball, SBOM, ACCEPTANCE and SHA256SUMS:

```text
dsh-einvoice 0.2.0-alpha.8   dsh-bankrec 0.1.0-alpha.11   dsh-ghg 0.1.0-alpha.13
dsh-ap-three-way 0.1.0-alpha.8   dsh-travel-recon 0.1.0-alpha.10
dsh-legal-intake 0.1.0-alpha.7   dsh-legal-clause 0.1.0-alpha.9
dsh-qms-capa 0.1.0-alpha.9   dsh-hs-candidate 0.1.0-alpha.9
dsh-freight-audit 0.1.0-alpha.10   dsh-docx-redline 0.1.0-alpha.10
dsh-ifc-qto 0.1.0-alpha.10   dsh-pim-lint 0.1.0-alpha.8
dsh-policy-ledger 0.2.0-alpha.10   dsh-eval-pack 0.1.0-alpha.8
```

Two release-pipeline defects were found and fixed on the way: `git add -A` was committing the local
`node_modules` symlink (the `.gitignore` entry `node_modules/` only matches a directory), and the
einvoice release needed its version gate in `scripts/lint.mjs` aligned before the tag would publish.
`scripts/release-package.mjs` now does the whole flow and strips the symlink after staging.

**Catalog (2026-11-01 late):** the `dsh-catalog` refresh workflow had a real defect — its
`add-paths` list omitted `deploy/artifacts/v1/taxonomy.json`, so the taxonomy sidecar kept an older
`generatedAt` and the `ci` gate failed with "taxonomy generatedAt must equal page generatedAt". The
workflow now commits the sidecar; a fresh refresh PR passed CI, merged (`61ddf3a`) and deployed, and the
live snapshot carries all 15 new versions.

**Mirrors (2026-11-01 late):** Gitee now carries the new release for all five flagships
(`dsh-einvoice v0.2.0-alpha.8`, `dsh-bankrec v0.1.0-alpha.11`, `dsh-ghg v0.1.0-alpha.13`,
`dsh-hs-candidate v0.1.0-alpha.9`, `dsh-ifc-qto v0.1.0-alpha.10`), each with the npm tarball, source
zip/tar.gz, `ACCEPTANCE.csv` and `SHA256SUMS`; both suites had their `main` synced. GitCode carries the
new tag and release record for `dsh-einvoice v0.2.0-alpha.8`, `dsh-bankrec v0.1.0-alpha.11` and
`dsh-docx-redline v0.1.0-alpha.10`; its public API exposes no route to attach custom binary assets
(`attach_files` returns 404 for every prefix), so the GitCode releases rely on the built-in source
archives. Gitee also auto-attaches its own source archives, so those releases show a duplicate zip/tar.gz
pair next to the uploaded files listed in `SHA256SUMS`. ACCEPTANCE rows and captures are produced at the release step (P3).

| Date | Package | Change | Evidence |
|---|---|---|---|
| 2026-11-01 | `dsh-ghg` | new `ghg.period_coverage`: covered/missing months, rows, kWh, tCO2e for a reporting year (completeness check) | `node --test test/ghg.test.mjs` → 9/9 pass |
| 2026-11-01 | `dsh-bankrec` | new `bankrec.iban_check`: ISO 13616 IBAN validation (charset, country BBAN length, ISO 7064 mod 97-10) | `node --test test/*.test.mjs` → 12/12 pass |
| 2026-11-01 | `dsh-pim-lint` | new `pim.gtin_structure` (GTIN-14 indicator / variable measure, GS1), duplicate-GTIN and price-precision rules | `node --test test/pim.test.mjs` → 5/5 pass |
| 2026-11-01 | `dsh-einvoice` | new `invoice.tax_id_check`: USCC mod-31 check character (GB 32100-2015) | `node --test test/*.test.mjs` → 27/27 pass |
| 2026-11-01 | `dsh-ap-three-way` | new `ap.tolerance_match`: price/quantity/amount tolerances in basis points, explicit exception reasons, header-only GRN handled | `node --test test/*.test.mjs` → 8/8 pass |
| 2026-11-01 | `dsh-travel-recon` | new `travel.reuse_check`: cross-trip invoice/card reuse (double claim) before ingest | `node --test test/*.test.mjs` → 7/7 pass |
| 2026-11-01 | `dsh-legal-clause` | new `legal.clause_integrity`: duplicate / missing / out-of-order clause numbers | `node --test test/*.test.mjs` → 8/8 pass |
| 2026-11-01 | `dsh-legal-intake` | new `legal.intake_doctor`: EML header/duplicate/thread/attachment QA before intake | `node --test test/*.test.mjs` → 7/7 pass |
| 2026-11-01 | `dsh-qms-capa` | new `qms.8d_check`: D1-D8 completeness, thin-content and ready-to-close verdict | `node --test test/*.test.mjs` → 9/9 pass |
| 2026-11-01 | `dsh-hs-candidate` | new `hs.code_check`: HS 2022 code structure, chapter range, reserved chapters | `node --test test/*.test.mjs` → 7/7 pass |
| 2026-11-01 | `dsh-ifc-qto` | new `ifc.qto_summary`: totals/count/min/max per measurement kind, type distribution, non-positive detection | `node --test test/*.test.mjs` → 9/9 pass |
| 2026-11-01 | `dsh-docx-redline` | new `doc.change_summary`: tracked insertions/deletions and per-author totals (OOXML WML) | `node --test test/*.test.mjs` → 18/18 pass |
| 2026-11-01 | `dsh-eval-pack` | new `eval.summary` + canonical-JSON grading (key order insensitive) | `node --test test/*.test.mjs` → 7/7 pass |
| 2026-11-01 | `dsh-freight-audit` | new `freight.ratecard_validate`: money/fuel/window checks plus per-carrier version overlap | `node --test test/*.test.mjs` → 9/9 pass |
| 2026-11-01 | `dsh-policy-ledger` | new `trust.risk_report`: per-factor risk breakdown behind the R0-R3 verdict | `node --test test/*.test.mjs` → 7/7 pass |
| 2026-11-01 | all 15 + 2 suites | frozen status removed; all active | `check-docs` / `check-taxonomy` green |
