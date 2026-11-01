# Roster and install scopes

**Measured 2026-11-01.** The family roster, the `dsh-kit` installer and the npm catalog are three different surfaces. This page is the closure: every number has one meaning and one source.

## 1. Family roster — 125 rows

`family.json` is the authoritative 125-row projection. Its `installScope` field explains why a row is or is not in `dsh-kit/plugins.txt`.

| installScope | Rows | Meaning |
|---|---:|---|
| `mainline-default` | 39 | Mainline packages installed by `dsh-kit/install-all.*` without a flag |
| `mainline-opt-in` | 53 | Core compliance checkers; installed only with `--include-checkers` / `-IncludeCheckers` |
| `catalog-only` | 10 | 9 newer compliance tools + `dsh-community-bench`; visible in the catalog, not in the mainline installer |
| `domain` | 17 | 15 domain packages + 2 domain suites; installed from the domain index or a suite |
| `excluded-retired` | 3 | `dsh-background-agents`, `dsh-session-pin`, `dsh-team-rooms`; never installed by a fresh setup |
| `infrastructure` | 3 | `dsh-kit`, `dsh-catalog`, `dsh-plugin-certification`; support surfaces, not runtime plugins |
| **Total** | **125** | **107 active / 15 frozen / 3 retired** |

## 2. `dsh-kit` — 92 install specs

`dsh-kit/plugins.txt` is deliberately the **mainline installer**, not the whole family:

```text
92 = 39 mainline-default + 53 mainline-opt-in
```

- `install-all.sh` / `install-all.ps1` install the 39 by default.
- `--include-checkers` / `-IncludeCheckers` adds the 53 core checkers.
- It does **not** include the 10 catalog-only rows or the 17 domain rows. That is a scope decision, not a missing count.

## 3. npm catalog — 126 records

`dsh-catalog/data/packages.json` is a discoverability surface, not a 1:1 projection of the 125-row family:

```text
122 shared with family.json
+ 3 family-only infrastructure rows (dsh-kit, dsh-catalog, dsh-plugin-certification)
+ 4 catalog-only rows (dsh-checkers-suite, dsh-personal-directive, dsh-phocinae, dsh-phone-inbox)
= 126 npm records
```

The 4 catalog-only rows are intentionally visible because they are installable or useful discovery entries, but they are not counted in the 125-row family roster.

## 4. Install surfaces

| Surface | Count | Command |
|---|---:|---|
| Mainline default | 39 | `./install-all.sh <profile>` |
| Mainline + core checkers | 92 | `./install-all.sh <profile> --include-checkers` |
| Finance suite | 4 members + suite | `dsh plugin --profile <profile> add dsh-finops-suite` |
| Contract suite | 2 members + suite | `dsh plugin --profile <profile> add dsh-contract-suite` |
| Domain packages without a suite | 9 | install individually from the [domain index](https://perrylink.github.io/dsh-plugins/) |
| Catalog-only compliance tools | 10 | install the exact npm package; they are not in `plugins.txt` |
| Retired | 0 | never installed by a fresh setup |

## 5. Rules

- Counts are generated from `family.json` / `data/packages.json`; do not hand-write a fourth number.
- A new package is added to `family.json` first; `installScope` decides whether it enters `plugins.txt`.
- `dsh-kit/plugins.txt` changes require running `node scripts/check-parity.mjs` in `dsh-kit`.
- `dsh-catalog` changes require `check-data`, `check-counts`, `check-levels`, `check-taxonomy` and `validate`.
- The profile and docs read these numbers; they never introduce a new scope.
