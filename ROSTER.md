# Roster and install scopes

> **2026-11-04 update:** `family.json` is now 137 rows — 126 active / 8 frozen / 3 retired. The 125-row
> figures below are the 2026-11-02 snapshot; where they differ, `family.json` wins. The full family now
> also has a group index at [FAMILY.md](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md).

> **2026-11-08 rename:** the mainline `dsh-translate` row is now `dsh-param-repair` (vendor parameter
> mapping + deterministic JSON repair, 1.0.1). The new `dsh-translate` (0.3.2) is the full-page translator;
> like the 19-package research suite it is catalog-only, installable by name, and not counted below.

**Measured 2026-11-02** against `dsh-kit` origin/main `3c7bd13` (`plugins.txt`, `family.txt`) and `dsh-catalog` origin/main `61ddf3a` (`data/packages.json`). The family roster, the two `dsh-kit` installers and the npm catalog are different surfaces. This page is the closure: every number has one meaning and one source.

## 1. Family roster — 125 rows

`family.json` is the authoritative 125-row projection. Its `installScope` field says which installer surface sees a row: `plugins.txt` (mainline), `family.txt` (full family), both, or neither.

| installScope | Rows | Meaning |
|---|---:|---|
| `mainline-default` | 39 | All 39 are among the 43 defaults in `plugins.txt`, and all are in `family.txt` |
| `mainline-opt-in` | 53 | In `plugins.txt` behind `--include-checkers` / `-IncludeCheckers`; also in `family.txt` |
| `catalog-only` | 10 | The 9 newer compliance tools + `dsh-community-bench`; **all 10 are in `family.txt`**; only `dsh-community-bench` is also in `plugins.txt` (as a default) |
| `domain` | 17 | 15 domain packages + 2 domain suites; **the 15 packages are in `family.txt`**, the 2 suites are not (a suite installs its own members) |
| `excluded-retired` | 3 | `dsh-background-agents`, `dsh-session-pin`, `dsh-team-rooms`; never installed by a fresh setup |
| `infrastructure` | 3 | `dsh-kit`, `dsh-catalog`, `dsh-plugin-certification`; support surfaces, not runtime plugins, in neither installer |
| **Total** | **125** | **114 active / 8 frozen / 3 retired** |

**Research suite (catalog-only, 2026-11-08).** The 19 npm packages — 18 plugins + `@perrylink/dsh-research-core` (two scoped packages) — plus the `dsh-research-bench` data repository are **not** in `family.json`, `plugins.txt` or `family.txt`, so they are outside the 125/137-row roster. 588 tests across the 19 packages; seven benchmark suites / eight datasets; see [FAMILY §10](https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md#10-research-suite-catalog-only-19) and the [bench](https://github.com/PerryLink/dsh-research-bench).

## 2. `dsh-kit/plugins.txt` — 96 install specs

`plugins.txt` is deliberately the **mainline installer**, not the whole family:

```text
96 = 43 default + 53 opt-in
43 = 39 family mainline-default + 4 extra defaults
   (dsh-community-bench, @perrylink/dsh-checkers, dsh-phocinae, dsh-phone-inbox)
```

- `install-all.sh` / `install-all.ps1` install the 43 by default.
- `--include-checkers` / `-IncludeCheckers` adds the 53 core checkers.
- 93 of the 125 family rows are in `plugins.txt`: the 39 default + 53 opt-in + `dsh-community-bench`.
- It does **not** contain the other 9 catalog-only rows, the 15 domain packages, the 2 domain suites, the 3 retired rows or the 3 infrastructure rows. The 3 extra npm specs beyond the family are `@perrylink/dsh-checkers`, `dsh-phocinae` and `dsh-phone-inbox`.

## 3. npm catalog — 126 records

`dsh-catalog/data/packages.json` is a discoverability surface, not a 1:1 projection of the 125-row family:

```text
122 shared with family.json
   = 125 family rows − 3 family-only infrastructure rows
   = 39 mainline-default + 53 mainline-opt-in + 10 catalog-only + 17 domain + 3 retired
+ 4 catalog-only rows outside the family
   (dsh-checkers-suite, dsh-personal-directive, dsh-phocinae, dsh-phone-inbox)
= 126 npm records
```

The 4 catalog-only rows are intentionally visible because they are installable or useful discovery entries, but they are not counted in the 125-row family roster. Conversely, the 3 infrastructure rows are family-only: they are not npm catalog records. The 3 retired rows remain catalog records for history, but no installer includes them.

## 4. Install surfaces

| Surface | Count | Command |
|---|---:|---|
| Mainline default | 43 | `./install-all.sh <profile>` |
| Mainline + core checkers | 96 | `./install-all.sh <profile> --include-checkers` |
| Family install (no suites) | 117 | `./install-family.sh <profile>` |
| Finance suite | 4 members + suite | `dsh plugin --profile <profile> add dsh-finops-suite` |
| Contract suite | 2 members + suite | `dsh plugin --profile <profile> add dsh-contract-suite` |
| Domain packages without a suite | 9 | install individually from the [domain index](https://perrylink.github.io/dsh-plugins/) |
| Catalog-only rows not in `plugins.txt` | 9 | install the exact npm package; `dsh-community-bench` is the exception (also a `plugins.txt` default) |
| Retired | 0 | never installed by a fresh setup |

`family.txt` is the full-family installer, and its 117 specs are exactly the family rows minus the three exclusions:

```text
117 = 39 mainline-default + 53 mainline-opt-in + 10 catalog-only + 15 domain packages
excluded: 2 domain suites (their members are listed) + 3 retired + 3 infrastructure
```

So **catalog-only and domain rows are in the family installer** even though they are not in the mainline `plugins.txt`; the only domain rows missing from `family.txt` are the 2 suites, which install their members instead.

> **Status note (2026-11-01):** all 15 domain packages and both suites are `active`. The 8 remaining `frozen` rows are legacy mainline utilities (`dsh-autotier`, `dsh-budget`, `dsh-cert-mcp`, `dsh-claude-move`, `dsh-defend`, `dsh-draw`, `dsh-reach`) plus `dsh-community-bench`.

## 5. Rules

- Counts are generated from `family.json` / `packages.json`; do not hand-write a fourth number.
- `plugins.txt` and `family.txt` snapshots live in `data/kit-plugins.txt` (96) and `data/kit-family.txt` (117); refresh them from `dsh-kit` origin/main when that repo changes.
- A new package is added to `family.json` first; `installScope` decides whether it enters `plugins.txt` and/or `family.txt`.
- `dsh-kit` manifest changes require running `node scripts/check-parity.mjs` in `dsh-kit`.
- `dsh-catalog` changes require `check-data`, `check-counts`, `check-levels`, `check-taxonomy` and `validate`.
- The profile and docs read these numbers; they never introduce a new scope.
