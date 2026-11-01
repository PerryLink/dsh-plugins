# Legacy mainline documentation debt

**Measured 2026-11-01** from `D:\Projects\dsh\plugins` (54 `dsh-*` directories). This is a **tracked backlog**, not a conformance claim.

| Item | Coverage | Note |
|---|---:|---|
| Five-language READMEs | 45/54 | 9 directories missing at least one translation |
| `PRIVACY.md` | 1/54 | `dsh-lsp-actions` added 2026-11-01; the rest of the 2026-09 mainline still predates the standard |
| `icon.svg` | 3/54 | `dsh-lsp-actions` added 2026-11-01; most mainline packages predate the icon rule |
| `SECURITY.md` | 43/54 | 11 missing |
| `CONTRIBUTING.md` | 47/54 | 7 missing |
| `CHANGELOG.md` | 46/54 | 8 missing |
| `screenshots.json` | 42/54 | 12 missing |
| README flow SVG | 48/54 | 6 missing |
| Demo GIF | 43/54 | 11 missing |

## Policy

- **Do not mass-rewrite 54 READMEs.** The old files are long and heterogeneous; a bulk rewrite would lose content and create review noise.
- **New packages and any package touched for another reason** must meet the current standard: five READMEs, `SECURITY` / `PRIVACY` / `CODE_OF_CONDUCT` / `CONTRIBUTING` / `CHANGELOG` / `icon.svg`, a workflow SVG, and `screenshots.json` for a visual surface.
- **Frozen/retired packages** are excluded from feature work; if touched, fix only the factual or security issue and leave the rest.
- When a legacy package gets a new release, add the missing files in that release rather than a separate sweep.
- **Applied 2026-11-01:** `dsh-lsp-actions` was touched for Dependabot removal; its five READMEs, `PRIVACY.md`, `icon.svg`, `package.json files[]` and `npm pack --dry-run` were brought up to the checklist.
- The new domain batch already meets the standard except `screenshots.json`; the eight active domain packages now carry hero/GIF assets and `TROUBLESHOOTING.md`.

## Per-touched-package checklist

```text
[ ] README.md + README-zh/es/pt/hi.md
[ ] SECURITY.md / PRIVACY.md / CODE_OF_CONDUCT.md / CONTRIBUTING.md / CHANGELOG.md
[ ] icon.svg
[ ] docs/assets/<name>-flow.svg (and hero/GIF if visual)
[ ] screenshots.json
[ ] package.json files[] includes the new files
[ ] npm pack --dry-run shows them
```
