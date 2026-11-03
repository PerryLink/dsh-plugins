#!/usr/bin/env node
/**
 * Give a compliance checker a minimal first-run sample.
 *
 * For one checker package it writes:
 *   samples/quickstart/input/<fixture>   a copy of one of the package's own test
 *                                        fixtures (they are already synthetic)
 *   samples/quickstart/run.mjs           loads the built plugin, registers the tool
 *                                        against a minimal context and runs it
 *   samples/quickstart/expected/result.json  the real output of the run
 *   docs/assets/quickstart.png           rendered from the real terminal output
 * and then patches package.json (files + dsh.demo) and README-zh.
 *
 *   node scripts/checker-quickstart.mjs /mnt/d/Projects/dsh/checkers/dsh-customs-doc-check
 *   node scripts/checker-quickstart.mjs --all /mnt/d/Projects/dsh/checkers
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const here = path.dirname(new URL(import.meta.url).pathname)
const renderScript = path.join(here, 'render-capture.py')

const args = process.argv.slice(2)
const allMode = args.includes('--all')
const target = args.find((a) => !a.startsWith('--')) || (allMode ? '/mnt/d/Projects/dsh/checkers' : null)
if (!target) {
  console.error('usage: checker-quickstart.mjs <checker-dir> | --all <checkers-root>')
  process.exit(2)
}

const dirs = allMode
  ? fs.readdirSync(target).filter((d) => d.startsWith('dsh-') && fs.existsSync(path.join(target, d, 'package.json'))).map((d) => path.join(target, d))
  : [target]

const report = []
for (const dir of dirs) {
  const pkgPath = path.join(dir, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
  const samples = path.join(dir, 'samples', 'quickstart')
  if (fs.existsSync(path.join(samples, 'run.mjs'))) {
    report.push(`${pkg.name}: already has a quickstart`)
    continue
  }
  // 1. pick a fixture
  const fixturesDir = path.join(dir, 'tests', 'fixtures')
  let fixture = null
  if (fs.existsSync(fixturesDir)) {
    const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]))
    const files = walk(fixturesDir).filter((f) => /\.(json|ya?ml)$/i.test(f) && !/cases\.json$/i.test(f))
    fixture = files.find((f) => /unsafe|noncompliant|fail|bad/i.test(path.basename(f))) || files[0] || null
  }
  if (!fixture) {
    report.push(`${pkg.name}: no usable fixture`)
    continue
  }
  fs.mkdirSync(path.join(samples, 'input'), { recursive: true })
  fs.mkdirSync(path.join(samples, 'expected'), { recursive: true })
  const inputName = path.basename(fixture)
  fs.copyFileSync(fixture, path.join(samples, 'input', inputName))

  // 2. write the runner
  const runner = `import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as plugin from '../../lib/index.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const material = await readFile(join(here, 'input', ${JSON.stringify(inputName)}), 'utf8')

const registered = []
const ctx = { tools: { register: (tool) => { registered.push(tool); return () => {} } } }
plugin.apply(ctx, plugin.Config ? plugin.Config({}) : {})
const tool = registered.find((t) => t.name === plugin.TOOL_NAME)
if (!tool) throw new Error('tool not registered: ' + plugin.TOOL_NAME)

const result = await tool.execute({ material }, { signal: new AbortController().signal })
const summary = {
  tool: tool.name,
  issueCount: result.issueCount,
  summary: result.summary,
  skippedCount: result.skippedCount,
}
if (process.argv.includes('--json')) console.log(JSON.stringify(summary, null, 2))
else {
  console.log('$ node samples/quickstart/run.mjs')
  console.log(tool.name + ': ' + summary.issueCount + ' issue(s) — error ' + summary.summary.error + ', warn ' + summary.summary.warn + ', info ' + summary.summary.info)
  console.log('skipped: ' + summary.skippedCount)
}
`
  fs.writeFileSync(path.join(samples, 'run.mjs'), runner)

  // 3. produce the golden from a real run
  let output
  try {
    output = execFileSync(process.execPath, [path.join(samples, 'run.mjs'), '--json'], { cwd: dir, encoding: 'utf8', timeout: 120000 })
  } catch (error) {
    report.push(`${pkg.name}: runner failed — ${String(error.stderr || error.message).split('\n')[0]}`)
    fs.rmSync(samples, { recursive: true, force: true })
    continue
  }
  fs.writeFileSync(path.join(samples, 'expected', 'result.json'), output)

  // 4. capture a screenshot from the human-readable run
  try {
    const text = execFileSync(process.execPath, [path.join(samples, 'run.mjs')], { cwd: dir, encoding: 'utf8', timeout: 120000 })
    const logPath = path.join(dir, 'docs', 'assets', 'quickstart.log')
    fs.mkdirSync(path.dirname(logPath), { recursive: true })
    fs.writeFileSync(logPath, text)
    execFileSync('python3', [renderScript, logPath, path.join(dir, 'docs', 'assets', 'quickstart.png'), '--title', `${pkg.name} — first run`], { timeout: 120000, env: { ...process.env, RENDER_CAPTURE_FONT: process.env.RENDER_CAPTURE_FONT || '/mnt/c/Windows/Fonts/msyh.ttc' } })
  } catch (error) {
    report.push(`${pkg.name}: screenshot skipped — ${String(error.message).split('\n')[0]}`)
  }

  // 5. package.json: ship samples + declare the demo
  const files = new Set(pkg.files || [])
  files.add('samples')
  files.add('TROUBLESHOOTING.md')
  files.add('screenshots.json')
  pkg.files = [...files]
  pkg.dsh = pkg.dsh || {}
  pkg.dsh.demo = {
    sample: `samples/quickstart/input/${inputName}`,
    prompt: `用自带样例跑一次这项检查，告诉我发现了几条问题、分别是什么级别。`,
    expect: 'samples/quickstart/expected/result.json',
    screenshot: 'docs/assets/quickstart.png',
    reads: ['用户指定的材料文件'],
    writes: [],
    network: false,
    external: [],
  }
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // 6. README-zh: a short quickstart block
  const readmeZh = path.join(dir, 'README-zh.md')
  if (fs.existsSync(readmeZh)) {
    let text = fs.readFileSync(readmeZh, 'utf8')
    if (!text.includes('samples/quickstart')) {
      const block = `## 快速试跑（1 分钟）\n\n\`\`\`bash\nnode samples/quickstart/run.mjs --check\n\`\`\`\n\n样例在 \`samples/quickstart/input/\`，期望输出在 \`samples/quickstart/expected/result.json\`；截图见 \`docs/assets/quickstart.png\`。\n\n`
      text = text.replace(/^# .*\n/, (m) => m + '\n' + block)
      fs.writeFileSync(readmeZh, text)
    }
  }
  report.push(`${pkg.name}: sample ${inputName}, golden written`)
}

console.log(report.join('\n'))
console.log(`\n${report.filter((r) => r.includes('golden written')).length}/${dirs.length} checker(s) now have a quickstart`)
