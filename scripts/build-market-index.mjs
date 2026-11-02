#!/usr/bin/env node
/**
 * Build a format-1 plugin market index (index.json) for the PerryLink family.
 *
 * The format is the one DSH's Discover tab and the `plugin_market` tool read:
 * https://github.com/deepseek-ai/deepseek-harness/blob/main/docs/user/guide/plugin-market.md#index-format
 *
 * Sources of truth:
 *   - family.json        membership, display names, positioning, task family, tags
 *   - packages.json      the version that was actually published for the 17 released packages
 *   - npm registry       publish timestamps and, for packages not in packages.json, the latest version
 *
 * Usage:
 *   node scripts/build-market-index.mjs            # write market/index.json
 *   node scripts/build-market-index.mjs --check    # validate without writing
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const check = process.argv.includes('--check')

const family = JSON.parse(fs.readFileSync(path.join(root, 'family.json'), 'utf8'))
const packages = JSON.parse(fs.readFileSync(path.join(root, 'packages.json'), 'utf8'))

const TASK_FAMILIES = [
  ['finance', '财务报销', 'Finance & expense'],
  ['hr', '人力资源', 'People & HR'],
  ['procurement', '采购供应链', 'Procurement & supply chain'],
  ['legal', '法务合同', 'Legal & contracts'],
  ['quality', '质量生产', 'Quality & production'],
  ['trade', '关务物流', 'Customs & logistics'],
  ['office', '行政办公', 'Office & admin'],
  ['education', '教育培训', 'Education & training'],
  ['health', '医疗健康', 'Health'],
  ['retail', '零售电商', 'Retail & e-commerce'],
  ['developer', '开发者工具', 'Developer tools'],
]
const familyIdByZh = new Map(TASK_FAMILIES.map(([id, zh]) => [zh, id]))
const familyIdByEn = new Map(TASK_FAMILIES.map(([id, , en]) => [en, id]))

function localized(zh, en) {
  const out = {}
  if (en) out.en = en
  if (zh) out.zh = zh
  return Object.keys(out).length ? out : undefined
}

function taskFamilyId(item) {
  const raw = item.taskFamily || item.taskFamilyZh
  if (raw && familyIdByZh.has(raw)) return familyIdByZh.get(raw)
  if (raw && familyIdByEn.has(raw)) return familyIdByEn.get(raw)
  // deterministic fallback from the existing taxonomy
  const sub = (item.subcategory || '').toLowerCase()
  if (['finance', 'accounting', 'tax'].includes(sub)) return 'finance'
  if (['legal', 'contract'].includes(sub)) return 'legal'
  if (['procurement', 'tender', 'supply'].includes(sub)) return 'procurement'
  if (['quality', 'manufacturing', 'audit'].includes(sub)) return 'quality'
  if (['customs', 'trade', 'logistics', 'freight'].includes(sub)) return 'trade'
  if (['hr', 'people'].includes(sub)) return 'hr'
  if (['education'].includes(sub)) return 'education'
  if (['health', 'medical'].includes(sub)) return 'health'
  if (['retail', 'commerce'].includes(sub)) return 'retail'
  if (['office', 'document', 'productivity'].includes(sub)) return 'office'
  return 'developer'
}

const publishedVersions = new Map()
for (const p of [...(packages.packages || []), ...(packages.suites || [])]) publishedVersions.set(p.name, p.version)

async function npmMeta(name) {
  const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    headers: { Accept: 'application/vnd.npm.install-v1+json' },
  })
  if (!res.ok) return null
  const body = await res.json()
  const latest = body['dist-tags']?.latest
  if (!latest) return null
  const time = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)
  const published = time?.time?.[latest]
  return { version: latest, publishTimestamp: published ? Math.floor(new Date(published).getTime() / 1000) : Math.floor(Date.now() / 1000), time }
}

const plugins = []
const missing = []
for (const item of family.items) {
  if (item.kind === 'catalog' || (!item.npm && !item.repo)) continue
  const name = item.npm || item.id
  const pinned = publishedVersions.get(name)
  let meta = null
  try {
    meta = await npmMeta(name)
  } catch {
    meta = null
  }
  const version = pinned || meta?.version
  if (!version) {
    missing.push(name)
    continue
  }
  const familyId = taskFamilyId(item)
  const plugin = {
    name,
    title: localized(item.displayNameZh, item.displayName || item.id),
    description: item.positioning ? localized(item.descriptionZh, item.positioning) : undefined,
    author: 'PerryLink',
    homepage: item.repo ? `https://github.com/${item.repo}` : undefined,
    repository: item.repo ? { url: `https://github.com/${item.repo}` } : undefined,
    metadata: {
      category: familyId,
      labels: [
        item.installScope === 'domain' ? 'domain' : item.installScope === 'mainline-default' ? 'default' : 'opt-in',
        item.status,
      ].filter(Boolean),
    },
    versions: [
      {
        version,
        publishTimestamp: meta?.publishTimestamp ?? Math.floor(Date.parse('2026-11-01T00:00:00Z') / 1000),
        source: { type: 'npm', registry: 'https://registry.npmjs.org' },
        engines: item.engines?.dsh ? { dsh: item.engines.dsh } : undefined,
      },
    ],
  }
  if (!plugin.title) delete plugin.title
  if (!plugin.description) delete plugin.description
  plugins.push(plugin)
}

plugins.sort((a, b) => (a.metadata.category || '').localeCompare(b.metadata.category || '') || a.name.localeCompare(b.name))

const index = {
  format: 1,
  title: localized('PerryLink DSH 插件市场', 'PerryLink DSH plugins'),
  description: localized(
    '按任务浏览 126 个本地优先的 DSH 插件：财务、法务、采购、质量、关务、行政与开发者工具。',
    'Task-first index of 126 local-first DSH plugins for finance, legal, procurement, quality, customs and developer work.',
  ),
  metadata: {
    categories: Object.fromEntries(TASK_FAMILIES.map(([id, zh, en]) => [id, { title: localized(zh, en) }])),
    labels: {
      domain: { title: localized('领域包', 'Domain package') },
      default: { title: localized('默认安装', 'Installed by default') },
      'opt-in': { title: localized('按需安装', 'Opt-in') },
      active: { title: localized('维护中', 'Active') },
      frozen: { title: localized('已冻结', 'Frozen') },
      retired: { title: localized('已退役', 'Retired') },
    },
    sortKeys: {
      installScope: { title: localized('安装范围', 'Install scope') },
    },
  },
  plugins,
}

// --- validation -----------------------------------------------------------
const errors = []
if (index.format !== 1) errors.push('format must be 1')
if (!index.title?.en) errors.push('title.en is required')
const names = new Set()
for (const p of index.plugins) {
  if (!p.name) errors.push('plugin without name')
  if (names.has(p.name)) errors.push(`duplicate plugin ${p.name}`)
  names.add(p.name)
  if (p.title && !p.title.en) errors.push(`${p.name}: title without en`)
  if (p.description && !p.description.en) errors.push(`${p.name}: description without en`)
  if (!Array.isArray(p.versions) || p.versions.length === 0) errors.push(`${p.name}: no versions`)
  for (const v of p.versions || []) {
    if (!/^\d+\.\d+\.\d+/.test(v.version || '')) errors.push(`${p.name}: bad version ${v.version}`)
    if (!Number.isInteger(v.publishTimestamp) || v.publishTimestamp <= 0) errors.push(`${p.name}: bad publishTimestamp`)
    if (!v.source || !['npm', 'git'].includes(v.source.type)) errors.push(`${p.name}: bad source`)
    if (v.source?.type === 'npm' && v.source.registry && !/^https?:\/\/[^\s]+$/.test(v.source.registry)) errors.push(`${p.name}: bad registry`)
    if (p.metadata?.category && !index.metadata.categories[p.metadata.category]) errors.push(`${p.name}: undeclared category ${p.metadata.category}`)
    for (const l of p.metadata?.labels || []) if (!index.metadata.labels[l]) errors.push(`${p.name}: undeclared label ${l}`)
  }
}
if (index.plugins.length < 120) errors.push(`too few plugins: ${index.plugins.length}`)
const withZh = index.plugins.filter((p) => p.title?.zh).length
if (errors.length) {
  console.error(`market index: ${errors.length} problem(s)`)
  for (const e of errors.slice(0, 20)) console.error(' -', e)
  process.exit(1)
}

if (check) {
  const existing = path.join(root, 'market', 'index.json')
  if (!fs.existsSync(existing)) {
    console.error('market/index.json is missing; run without --check')
    process.exit(1)
  }
  const current = JSON.parse(fs.readFileSync(existing, 'utf8'))
  if (JSON.stringify(current) !== JSON.stringify(index)) {
    console.error('market/index.json is stale; run node scripts/build-market-index.mjs')
    process.exit(1)
  }
  console.log(`market index ok: ${index.plugins.length} plugins, ${withZh} with zh titles`)
  process.exit(0)
}

fs.mkdirSync(path.join(root, 'market'), { recursive: true })
fs.writeFileSync(path.join(root, 'market', 'index.json'), JSON.stringify(index, null, 2) + '\n')
console.log(`wrote market/index.json (${index.plugins.length} plugins, ${withZh} with zh titles)`)
if (missing.length) console.log(`skipped (no npm version): ${missing.join(', ')}`)
