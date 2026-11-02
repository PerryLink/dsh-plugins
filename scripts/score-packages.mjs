#!/usr/bin/env node
/**
 * Score every family entry against Package Standard v1 (docs/PACKAGE-STANDARD.md).
 *
 * Offline by design: reads family.json, each package.json, and — when a local
 * checkout exists under 04-build/ — the samples, screenshots, TROUBLESHOOTING and
 * README-zh files. No network calls, no installs.
 *
 *   node scripts/score-packages.mjs
 *   node scripts/score-packages.mjs --csv /tmp/ps1.csv
 *   node scripts/score-packages.mjs --gate 8
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const buildRoot = path.resolve(root, '..')
const args = process.argv.slice(2)
const csvPath = args.includes('--csv') ? args[args.indexOf('--csv') + 1] : null
const gate = args.includes('--gate') ? Number(args[args.indexOf('--gate') + 1]) : null

const family = JSON.parse(fs.readFileSync(path.join(root, 'family.json'), 'utf8'))
const dirByName = new Map()
for (const entry of fs.readdirSync(buildRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('dsh-')) continue
  const pkgPath = path.join(buildRoot, entry.name, 'package.json')
  if (!fs.existsSync(pkgPath)) continue
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    dirByName.set(pkg.name, path.join(buildRoot, entry.name))
  } catch {}
}

const NETWORK = /(^|[^\w.])(fetch\s*\(|axios|http\.request|https\.request|net\.connect|new WebSocket|undici)/
const ERROR_CODE = /\bE_[A-Z][A-Z0-9_]{3,}\b/

function readIf(p) {
  try {
    return fs.readFileSync(p, 'utf8')
  } catch {
    return null
  }
}

function walk(dir, out = []) {
  let entries = []
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (['node_modules', '.git', 'lib', 'dist', '.tmp', 'evidence'].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

const rows = []
for (const item of family.items) {
  const name = item.npm || item.id
  const dir = dirByName.get(name)
  const score = { page: 0, sample: 0, prompt: 0, expected: 0, permissions: 0, errors: 0, evidence: 0 }
  const missing = []

  if (!dir) {
    missing.push('no local checkout')
    rows.push({ name, status: item.status, scope: item.installScope, ...score, total: 0, grade: 'red', missing: missing.join('; ') })
    continue
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'))
  const demo = pkg.dsh?.demo
  const readmeZh = readIf(path.join(dir, 'README-zh.md')) || readIf(path.join(dir, 'README.md')) || ''
  const trouble = readIf(path.join(dir, 'TROUBLESHOOTING.md')) || ''
  const files = Array.isArray(pkg.files) ? pkg.files : null

  // 1 — detail page blocks
  const blocks = [
    /一句话|一句话说明|用途/.test(readmeZh),
    /适合/.test(readmeZh) && /不适合/.test(readmeZh),
    /输入/.test(readmeZh),
    /输出/.test(readmeZh),
    /示例|快速开始|快速上手/.test(readmeZh),
    /权限|读取|写入/.test(readmeZh),
    (readmeZh.match(/^#{2,3}\s*FAQ|常见问题/m) || []).length > 0,
    new RegExp(pkg.version.replace(/\./g, '\\.')).test(readmeZh),
  ]
  score.page = blocks.every(Boolean) ? 1 : 0
  if (!score.page) missing.push('detail page blocks ' + blocks.map((b, i) => (b ? '' : i + 1)).filter(Boolean).join(','))

  // 2 — sample shipped
  const sampleDir = path.join(dir, 'samples', 'quickstart', 'input')
  const hasSample = fs.existsSync(sampleDir) && fs.readdirSync(sampleDir).length > 0
  const filesShipsSamples = !files || files.some((f) => f === 'samples' || f === 'samples/' || String(f).startsWith('samples'))
  if (hasSample && filesShipsSamples) score.sample = 2
  else missing.push(hasSample ? 'files[] lacks samples' : 'no samples/quickstart/input')

  // 3 — one-line prompt
  const prompt = demo?.prompt || ''
  if (prompt && !/pnpm test|npm test/.test(prompt) && readmeZh.includes(prompt.slice(0, 12))) score.prompt = 1
  else missing.push(prompt ? 'prompt missing from README' : 'no dsh.demo.prompt')

  // 4 — expected output + screenshot
  const expectedDir = path.join(dir, 'samples', 'quickstart', 'expected')
  const hasExpected = fs.existsSync(expectedDir) && fs.readdirSync(expectedDir).length > 0
  const shot = demo?.screenshot ? path.join(dir, demo.screenshot) : null
  if (hasExpected && shot && fs.existsSync(shot)) score.expected = 1
  else missing.push(hasExpected ? 'demo screenshot missing' : 'no expected output')

  // 5 — permissions
  const permBlock = /读[:：]/.test(readmeZh) && /写[:：]/.test(readmeZh) && /联网[:：]/.test(readmeZh) && /外部系统[:：]/.test(readmeZh)
  const src = walk(path.join(dir, 'src')).map((f) => readIf(f) || '').join('\n')
  const networkFalse = demo?.network === false
  const declaresNetwork = typeof demo?.network === 'boolean'
  const noNetworkCalls = !NETWORK.test(src)
  const consistent = !networkFalse || noNetworkCalls
  if (permBlock && declaresNetwork && consistent) score.permissions = 2
  else missing.push(!permBlock ? 'permission block incomplete' : !declaresNetwork ? 'dsh.demo.network missing' : 'network:false but source has network calls')

  // 6 — error wording
  const hasCodes = ERROR_CODE.test(src)
  const troubleLines = (trouble.match(/E_[A-Z][A-Z0-9_]{3,}/g) || []).length
  if (hasCodes && troubleLines >= 3) score.errors = 1
  else missing.push(hasCodes ? `TROUBLESHOOTING lists ${troubleLines} codes` : 'no error codes in source')

  // 7 — evidence
  const shots = readIf(path.join(dir, 'screenshots.json'))
  let shotOk = false
  if (shots) {
    try {
      const entries = JSON.parse(shots)
      const list = Array.isArray(entries) ? entries : entries.screenshots || []
      shotOk = list.some((e) => e.command && (e.run_at || e.runAt) && (e.output_sha256 || e.sha256))
    } catch {}
  }
  const acceptance = readIf(path.join(dir, 'ACCEPTANCE.csv')) || ''
  const accRows = acceptance.split('\n').slice(1).filter((l) => l.trim() && !/^,|false$/i.test(l)).length
  const accOk = acceptance.split('\n')[0]?.includes('evidence_sha256') && accRows > 0
  if (shotOk) score.evidence += 1
  if (accOk) score.evidence += 1
  if (!shotOk) missing.push('screenshots.json lacks command/date/hash')
  if (!accOk) missing.push('ACCEPTANCE lacks evidence rows')

  const total = Object.values(score).reduce((a, b) => a + b, 0)
  const grade = total >= 8 && Object.values(score).every((v) => v > 0) ? 'green' : total >= 6 ? 'yellow' : 'red'
  rows.push({ name, status: item.status, scope: item.installScope, ...score, total, grade, missing: missing.join('; ') })
}

rows.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
const byGrade = rows.reduce((acc, r) => ((acc[r.grade] = (acc[r.grade] || 0) + 1), acc), {})
const t1 = rows.filter((r) => r.scope === 'domain')
console.log(`PS1 scores: ${rows.length} packages | green ${byGrade.green || 0} / yellow ${byGrade.yellow || 0} / red ${byGrade.red || 0}`)
console.log(`domain packages: ${t1.length}, avg ${(t1.reduce((a, r) => a + r.total, 0) / (t1.length || 1)).toFixed(1)}`)
for (const r of rows.slice(0, 8)) console.log(`  ${r.total.toString().padStart(2)} ${r.grade.padEnd(6)} ${r.name}${r.missing ? ' — ' + r.missing.slice(0, 80) : ''}`)

if (csvPath) {
  const header = 'name,status,scope,page,sample,prompt,expected,permissions,errors,evidence,total,grade,missing'
  const body = rows.map((r) => [r.name, r.status, r.scope, r.page, r.sample, r.prompt, r.expected, r.permissions, r.errors, r.evidence, r.total, r.grade, `"${(r.missing || '').replace(/"/g, "'")}"`].join(','))
  fs.writeFileSync(csvPath, [header, ...body].join('\n') + '\n')
  console.log(`wrote ${csvPath}`)
}

if (gate !== null) {
  const failing = rows.filter((r) => r.status !== 'retired' && r.scope !== 'infrastructure' && r.total < gate)
  if (failing.length) {
    console.error(`gate ${gate}: ${failing.length} package(s) below the bar`)
    process.exit(1)
  }
  console.log(`gate ${gate}: ok`)
}
