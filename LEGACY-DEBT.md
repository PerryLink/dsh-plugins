# Legacy mainline documentation debt

**Measured 2026-11-01** from `D:\Projects\dsh\plugins` (54 `dsh-*` directories). This is a **tracked backlog**, not a conformance claim.

| Item | Coverage | Note |
|---|---:|---|
| Five-language READMEs | 53/54 | 49 remote packages + 4 local-only support dirs; `dsh-wechat` (third-party) excluded |
| `PRIVACY.md` | 53/54 | added to 49 remote packages + 4 local-only support dirs |
| `icon.svg` | 53/54 | same coverage |
| `SECURITY.md` | 53/54 | same coverage |
| `CONTRIBUTING.md` | 54/54 | all 54 directories |
| `CHANGELOG.md` | 54/54 | all 54 directories |
| `screenshots.json` | 54/54 | all 54; 6 legacy sets are generated baseline cards |
| README flow SVG | 54/54 | all 54 |
| Demo GIF | 54/54 | all 54; generated baseline animations where no real run existed |

## Policy

- **Do not mass-rewrite 54 READMEs.** The old files are long and heterogeneous; a bulk rewrite would lose content and create review noise.
- **New packages and any package touched for another reason** must meet the current standard: five READMEs, `SECURITY` / `PRIVACY` / `CODE_OF_CONDUCT` / `CONTRIBUTING` / `CHANGELOG` / `icon.svg`, a workflow SVG, and `screenshots.json` for a visual surface.
- **Frozen/retired packages** are excluded from feature work; if touched, fix only the factual or security issue and leave the rest.
- When a legacy package gets a new release, add the missing files in that release rather than a separate sweep.
- **Applied 2026-11-01:** the legacy sweep completed for **49 remote repositories** (44 publishable packages + 5 support repositories) and **4 local-only support directories** (`dsh-handbook`, `dsh-plan-tracker`, `dsh-ticktick-handoff`, `dsh-wechat-handoff`).
- **Excluded by ownership:** `dsh-wechat` is a third-party bridge, not a PerryLink package; it is the only 1/54 row still missing `PRIVACY`, `icon`, `SECURITY`, and four translations.
- **Asset caveat:** where no real screenshot/GIF existed, the generated card/GIF is explicitly captioned as a documentation baseline, not test evidence. Replace it on the next real release.
- **Translation caveat:** the four local-only support directories and previously missing support pages use short localized landing pages that link to the English README; they are not full translations of every section.
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
