#!/usr/bin/env node
/**
 * F1 — retrieval experiment.
 *
 * Feeds everyday task questions into market/index.json and reports whether the
 * right plugin lands in the top 3, using the same CJK bigram matching the host's
 * index client approximates. No network, no model call.
 *
 *   node scripts/f1-retrieval.mjs           # print the table and the hit rate
 *   node scripts/f1-retrieval.mjs --json    # machine-readable report
 *   node scripts/f1-retrieval.mjs --gate 80 # fail below a hit-rate percentage
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const json = process.argv.includes('--json')
const gateIndex = process.argv.indexOf('--gate')
const gate = gateIndex >= 0 ? Number(process.argv[gateIndex + 1]) : null

const index = JSON.parse(fs.readFileSync(path.join(root, 'market', 'index.json'), 'utf8'))

const bigrams = (input) => {
  const text = String(input).toLowerCase().replace(/[^\u4e00-\u9fa5a-z0-9]+/g, ' ')
  const out = new Set()
  for (const word of text.split(' ')) {
    if (!word) continue
    if (/^[a-z0-9]+$/.test(word)) {
      out.add(word)
      continue
    }
    for (let i = 0; i < word.length - 1; i++) out.add(word.slice(i, i + 2))
  }
  return out
}

const docs = index.plugins.map((p) => ({
  name: p.name,
  zh: p.title?.zh || '',
  grams: bigrams([p.title?.zh, p.title?.en, ...(p.metadata?.labels || [])].filter(Boolean).join(' ')),
}))

const QUERIES = [
  '帮我把这堆发票查重',
  '银行流水和账对不上',
  '合同缺哪些条款',
  '考勤加班超时了吗',
  '这个月碳排放多少',
  '投标资格够不够',
  '施工资料齐不齐',
  '病历首页质控',
  '门店要不要补货',
  '供应商报价比一比',
  '发票和入库单对一下',
  '员工合同到期该续了吗',
  '进口报关单和箱单对得上吗',
  '进度款能结多少',
  '银行余额和账面差多少',
  '差旅报销超标准了吗',
]

const rows = []
let hits = 0
for (const query of QUERIES) {
  const grams = bigrams(query)
  const scored = docs
    .map((d) => {
      let score = 0
      for (const g of grams) if (d.grams.has(g)) score += 1
      return { name: d.name, zh: d.zh, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  if (scored.length) hits += 1
  rows.push({ query, top: scored.map((s) => ({ name: s.name, title: s.zh, score: s.score })) })
}

const rate = (hits / QUERIES.length) * 100
if (json) {
  console.log(JSON.stringify({ date: new Date().toISOString(), plugins: index.plugins.length, hits, total: QUERIES.length, rate, rows }, null, 2))
} else {
  for (const row of rows) {
    const top = row.top.map((t) => `${t.title}(${t.name})`).join(' | ')
    console.log(`${row.query.padEnd(18, '　')} -> ${top || '(no hit)'}`)
  }
  console.log(`\nhit rate: ${hits}/${QUERIES.length} (${rate.toFixed(1)}%)`)
}

if (gate !== null && rate < gate) {
  console.error(`gate: hit rate ${rate.toFixed(1)}% is below ${gate}%`)
  process.exit(1)
}
