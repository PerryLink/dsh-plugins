#!/usr/bin/env node
/**
 * F2 (rehearsal) — run the five task cards end to end without a human.
 *
 * Each card maps to a shipped scenario or quickstart. The script measures how
 * long the machine takes to produce a result and whether the result is non-empty,
 * which is the shortest path to catching a broken first run before real people
 * are asked to try it.
 *
 *   node scripts/f2-rehearsal.mjs
 *   node scripts/f2-rehearsal.mjs --json
 */
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const here = path.dirname(fileURLToPath(import.meta.url))
const buildRoot = path.resolve(here, '..', '..')
const json = process.argv.includes('--json')

const CARDS = [
  { role: '财务', task: '把这张发票和这份流水对一下，告诉我重复的是哪张、差多少钱。', cwd: 'dsh-finance-pack', script: 'scenario/run-scenario.mjs', args: ['--json'] },
  { role: '法务', task: '这份合同缺哪些条款？把缺失的列出来。', cwd: 'dsh-contract-pack', script: 'scenario/run-scenario.mjs', args: ['--json'] },
  { role: 'HR', task: '这 3 份合同里，哪份试用期有问题？', cwd: 'dsh-hr-pack', script: 'scenario/run-scenario.mjs', args: ['--json'] },
  { role: '采购', task: '这两家报价，哪个更便宜？差多少？', cwd: 'dsh-procurement-pack', script: 'scenario/run-scenario.mjs', args: ['--json'] },
  { role: '行政', task: '把这份 PDF 里的表格导成 CSV。', cwd: 'dsh-pdf-table', script: 'samples/quickstart/run.mjs', args: ['--json'] },
]

const rows = []
for (const card of CARDS) {
  const cwd = path.join(buildRoot, card.cwd)
  const started = Date.now()
  let ok = false, summary = '', detail = ''
  try {
    const out = execFileSync(process.execPath, [card.script, ...card.args], { cwd, encoding: 'utf8', timeout: 300000 })
    const ms = Date.now() - started
    let parsed = null
    try { parsed = JSON.parse(out) } catch { /* not json */ }
    if (parsed && typeof parsed === 'object') {
      const status = parsed.status || parsed.summary?.status
      const stepList = parsed.steps || []
      const stepOk = (st) => st.status ? st.status === 'ok' : st.ok !== false
      const steps = stepList.length ? `${stepList.filter(stepOk).length}/${stepList.length} steps` : ''
      summary = [status, steps].filter(Boolean).join(' · ') || 'json output'
      ok = (!status || status === 'ok') && (parsed.ok !== false) && stepList.every(stepOk)
    } else {
      summary = out.trim().split('\n').slice(-1)[0].slice(0, 80)
      ok = out.trim().length > 0
    }
    detail = `${ms} ms`
  } catch (error) {
    detail = `failed: ${String(error.message).split('\n')[0].slice(0, 80)}`
  }
  rows.push({ role: card.role, task: card.task, ok, summary, detail })
}

if (json) console.log(JSON.stringify({ date: new Date().toISOString(), rows }, null, 2))
else {
  for (const r of rows) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.role.padEnd(6, '　')} ${r.detail.padEnd(12)} ${r.summary}`)
  console.log(`\n${rows.filter((r) => r.ok).length}/${rows.length} task cards produced a result`)
}
process.exit(rows.every((r) => r.ok) ? 0 : 1)
