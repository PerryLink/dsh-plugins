# PUBLIC-ONLY BOUNDARY — 2026-10-31

## Decision

The user has directed that **customer-evidence work is not done**. This is a permanent scope boundary for this workspace, not a temporary PARK:

- No customer data collection, customer interviews, partner pilot sessions, NDAs/DPAs, or “real invoice/profile/seller” evidence gathering.
- No GA path and no claim that any package is GA or customer-validated.
- All packages remain **public/synthetic, partial, not counted**.
- Features that would require customer evidence are **out of scope**, not “deferred to later” and not “PARK until evidence arrives”.
- Existing EVIDENCE/PARK/BLOCKED/GA-CHECKLIST documents are historical records only; they no longer define an active roadmap.
- No customer data may be accepted into the repo, tests, or fixtures. Public MIT/Apache samples remain allowed.

## Consequences by SKU

| SKU | Boundary |
|---|---|
| SKU-04 `dsh-einvoice` | File-level public demo only. OCR/scan, tax-bureau verification/receipt/filing, real 100-invoice accuracy, real red/blue invoice pairs, 20 real restores, 30-year compliance: **not planned**. |
| SKU-03 `dsh-policy-ledger` | S1 read-only install doctor only. Gate/ledger/rollback/retry/profile five-state and 20 real profiles + 2 IT interviews: **not planned**. |
| SKU-11 commercial proofbench | **DROP permanently**; it required 3 named partners and partner failure sessions. `dsh-eval-harness` is a separate public utility, not SKU-11. |
| SKU-14 PIM listing | **DROP permanently**; it required real seller catalogs, 120 rejections, cost data and channel schemas. `dsh-pim-lint` is a separate public utility, not SKU-14. |
| All other SKUs | Their customer-evidence/GA gates are not pursued. Only public/synthetic slices remain. |

## What is still allowed

- MIT/Apache public samples with `LICENSE`/`SOURCE.md`.
- Synthetic fixtures, deterministic tests, CI, docs, alpha releases.
- Fixing correctness/security/CI issues in the public-only scope.

## What is not allowed

- Quietly reintroducing a customer gate as a future roadmap item.
- Describing an alpha/public demo as GA, validated, production-ready, or customer-proven.
- Using synthetic data to claim customer accuracy.

## Source-document sync (2026-10-31)

The original program documents under `01-research/dsh-plugin-gap-2026-10-29/program/` now carry the same boundary banner in ROADMAP, WBS, STATUS, RELEASE-GATE, GOVERNANCE, CHARTER, METRICS, UNIT-LIFECYCLE, RELEASE-READINESS, the SKU-11/14 designs, REQ-PROOFBENCH, REQ-PIM-LISTING, REQ-EINVOICE, REQ-TRUST-GATE and the orchestrator prompt. `program/PUBLIC-ONLY-BOUNDARY.md` is the source-document notice. `WBS.csv` remains a historical numeric table; `WBS.md` is the banner-bearing explanation.
