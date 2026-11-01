# Legacy mainline documentation debt

**Measured 2026-11-01** from `D:\Projects\dsh\plugins` (54 `dsh-*` directories). This is a **tracked backlog**, not a conformance claim.

| Item | Coverage | Note |
|---|---:|---|
| Five-language READMEs | 54/54 | 50 remote repositories + 4 local-only support dirs |
| `PRIVACY.md` | 54/54 | added to 50 remote repositories + 4 local-only support dirs |
| `icon.svg` | 54/54 | same coverage |
| `SECURITY.md` | 54/54 | same coverage |
| `CONTRIBUTING.md` | 54/54 | all 54 directories |
| `CHANGELOG.md` | 54/54 | all 54 directories |
| `screenshots.json` | 54/54 | all 54; the six legacy sets were replaced with real command output on 2026-11-01 |
| README flow SVG | 54/54 | all 54 |
| Demo GIF | 54/54 | all 54; generated baseline animations where no real run existed |

## Policy

- **Do not mass-rewrite 54 READMEs.** The old files are long and heterogeneous; a bulk rewrite would lose content and create review noise.
- **New packages and any package touched for another reason** must meet the current standard: five READMEs, `SECURITY` / `PRIVACY` / `CODE_OF_CONDUCT` / `CONTRIBUTING` / `CHANGELOG` / `icon.svg`, a workflow SVG, and `screenshots.json` for a visual surface.
- **Frozen/retired packages** are excluded from feature work; if touched, fix only the factual or security issue and leave the rest.
- When a legacy package gets a new release, add the missing files in that release rather than a separate sweep.
- **Applied 2026-11-01:** the legacy sweep completed for **50 remote repositories** (44 publishable packages + 5 support repositories + the third-party `dsh-wechat` fork) and **4 local-only support directories** (`dsh-handbook`, `dsh-plan-tracker`, `dsh-ticktick-handoff`, `dsh-wechat-handoff`).
- **Third-party disclosure:** `dsh-wechat` is a fork of pan17/dsh-wechat. It now has the same documentation baseline, with explicit fork/upstream disclosure in `PRIVACY.md` and `SECURITY.md`; it does not publish a separate npm package.
- **Asset update 2026-11-01:** the six legacy packages that had generated cards/GIFs (`dsh-background-agents`, `dsh-personal-directive`, `dsh-plugin-upgrade-015`, `dsh-plugin-upgrade-016`, `dsh-session-pin`, `dsh-team-rooms`) now carry real command output rendered into the images, with the exact command, pass count and "selected/full suite" caveat in `screenshots.json`. Generated baseline cards remain only in support/local-only directories.
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
