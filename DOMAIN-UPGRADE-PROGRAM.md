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
total, all `public/synthetic` / `counted=false`). Remaining P3 work: real terminal captures for the new
capabilities, version bumps, npm/GitHub pre-releases, mirror assets and the docs/manifest refresh. ACCEPTANCE rows and captures are produced at the release step (P3).

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
