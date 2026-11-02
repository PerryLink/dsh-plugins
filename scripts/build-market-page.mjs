#!/usr/bin/env node
/**
 * Render docs/market.html — a task-first browser over the family.
 *
 * Grouping comes from family.json `taskFamilyZh` (falling back to the English
 * `taskFamily`), ordering from the family file, so the page never disagrees
 * with market/index.json about what exists.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const family = JSON.parse(fs.readFileSync(path.join(root, 'family.json'), 'utf8'))

const FAMILIES = ['财务报销', '人力资源', '采购供应链', '法务合同', '质量生产', '关务物流', '行政办公', '教育培训', '医疗健康', '零售电商', '开发者工具']
const FAMILY_SUB = {
  财务报销: '发票、对账、报销、成本',
  人力资源: '入离职、合同、考勤',
  采购供应链: '询价、比价、准入、履约',
  法务合同: '条款、风险、到期',
  质量生产: '不合格、8D、审核、检验',
  关务物流: '归类、单证、运费',
  行政办公: '文档、表格、档案、会议',
  教育培训: '教案、作业、学情',
  医疗健康: '病历、检验、随访',
  零售电商: '商品、补货、点评',
  开发者工具: '运行时、安装、诊断',
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const items = family.items.filter((i) => i.status !== 'retired')
const groups = new Map(FAMILIES.map((f) => [f, []]))
for (const item of items) {
  const fam = item.taskFamilyZh || '开发者工具'
  if (!groups.has(fam)) groups.set(fam, [])
  groups.get(fam).push(item)
}

const card = (item) => {
  const zh = item.displayNameZh || item.displayName || item.id
  const en = item.displayName || item.id
  const tags = (item.tagsZh || []).slice(0, 4)
  const roles = (item.rolesZh || []).slice(0, 2).join(' · ')
  const status = item.status === 'frozen' ? '<span class="pill frozen">冻结</span>' : ''
  const npm = item.version ? `<code>${esc(item.version)}</code>` : ''
  return `<a class="card" href="packages/${esc(item.id)}.html" data-search="${esc([zh, en, ...(item.tagsZh || []), ...(item.rolesZh || [])].join(' ').toLowerCase())}">
  <h3>${esc(zh)}${status}</h3>
  <p class="en">${esc(en)}</p>
  <p class="meta">${npm}${roles ? ` <span class="roles">${esc(roles)}</span>` : ''}</p>
  <p class="tags">${tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>
</a>`
}

// 场景包不是单个插件，但按任务族出现在同一张市场页；卡片置顶并标“场景包”。
const PACKS = {
  财务报销: [
    {
      href: 'packs/finance.html',
      zh: '财务包：发票到归档',
      en: 'Finance pack — invoice to archive',
      desc: '收票 → 查重 → 三单匹配 → 银行对账 → 归档',
      roles: '会计 · 应付 · 出纳',
      tags: ['端到端场景', '4 个插件', '合成样例可跑'],
    },
  ],
  采购供应链: [
    {
      href: 'packs/procurement.html',
      zh: '采购包：询价到三单匹配',
      en: 'Procurement pack — quote to three-way match',
      desc: '询价比价 → 物料主数据 → 三单匹配',
      roles: '采购 · 应付 · 物料管理',
      tags: ['端到端场景', '3 个插件', '合成样例可跑'],
    },
  ],
  质量生产: [
    {
      href: 'packs/construction.html',
      zh: '建筑包：模型工程量到进度款',
      en: 'Construction pack — model quantities to progress payment',
      desc: '模型工程量 → 进度款审核 → 付款单三单匹配',
      roles: '造价 · 监理 · 项目经理',
      tags: ['端到端场景', '3 个插件', '合成样例可跑'],
    },
  ],
  法务合同: [
    {
      href: 'packs/contract.html',
      zh: '合同包：收件到续签',
      en: 'Contract pack — intake to renewal',
      desc: '收件 → 条款覆盖 → 登记 → 到期',
      roles: '法务 · 合同管理 · 采购',
      tags: ['端到端场景', '3 个插件', '合成样例可跑'],
    },
  ],
  人力资源: [
    {
      href: 'packs/hr.html',
      zh: 'HR 包：简历/合同邮件到续签提醒',
      en: 'HR pack — hire to renewal',
      desc: '收简历/合同邮件 → 合同体检 → 续签/到期提醒',
      roles: 'HR · 法务 · 行政',
      tags: ['端到端场景', '3 个插件', '合成样例可跑'],
    },
  ],
}

const PACK_COUNT = Object.values(PACKS).reduce((total, packs) => total + packs.length, 0)

const packCard = (pack) => `<a class="card pack" href="${esc(pack.href)}" data-search="${esc([pack.zh, pack.en, pack.desc, ...(pack.tags || []), pack.roles || ''].join(' ').toLowerCase())}">
  <h3>${esc(pack.zh)}<span class="pill pack">场景包</span></h3>
  <p class="en">${esc(pack.en)}</p>
  <p class="meta">${esc(pack.desc)} <span class="roles">${esc(pack.roles)}</span></p>
  <p class="tags">${(pack.tags || []).map((tag) => `<span>${esc(tag)}</span>`).join('')}</p>
</a>`

const section = ([fam, list]) => {
  const packs = PACKS[fam] ?? []
  const packNote = packs.length ? ` + ${packs.length} 个场景包` : ''
  return `<section id="${esc(fam)}">
  <h2>${esc(fam)} <small>${esc(FAMILY_SUB[fam] || '')} · ${list.length}${packNote}</small></h2>
  <div class="grid">${packs.map(packCard).join('\n')}${packs.length ? '\n' : ''}${list.map(card).join('\n')}</div>
</section>`
}

const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DSH 插件市场 — 按任务浏览</title>
<style>
:root{--bg:#0d1117;--panel:#161b22;--line:#30363d;--text:#e6edf3;--muted:#8b949e;--accent:#58a6ff}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 -apple-system,"PingFang SC","Microsoft YaHei",sans-serif}
header{padding:40px 24px 16px;max-width:1120px;margin:0 auto}
h1{margin:0 0 8px;font-size:30px}
.sub{color:var(--muted);margin:0 0 20px}
#q{width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--text);font-size:16px}
nav{display:flex;flex-wrap:wrap;gap:8px;padding:16px 24px;max-width:1120px;margin:0 auto}
nav a{color:var(--accent);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:4px 12px;font-size:14px}
main{max-width:1120px;margin:0 auto;padding:0 24px 64px}
section{margin:28px 0}
h2{font-size:20px;border-bottom:1px solid var(--line);padding-bottom:8px}
h2 small{color:var(--muted);font-weight:400;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.card{display:block;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px;text-decoration:none;color:inherit}
.card:hover{border-color:var(--accent)}
.card h3{margin:0 0 4px;font-size:17px}
.card .en{margin:0;color:var(--muted);font-size:12px}
.card .meta{margin:6px 0;font-size:12px;color:var(--muted)}
.card .roles{color:var(--accent)}
.tags span{display:inline-block;background:#1f2937;color:#c9d1d9;border-radius:6px;padding:1px 8px;font-size:12px;margin:2px 4px 0 0}
.pill{font-size:11px;border-radius:999px;padding:1px 8px;margin-left:6px;vertical-align:middle}
.pill.frozen{background:#3d2b1f;color:#f0b72f}
.pill.pack{background:#1a7f37;color:#fff;margin-left:8px}
.card.pack{border-color:#2ea043;background:linear-gradient(135deg,#12261a,#161b22 60%)}
.card.pack:hover{border-color:#3fb950}
.card.pack .meta{color:#9fd6a8}
footer{max-width:1120px;margin:0 auto;padding:0 24px 48px;color:var(--muted);font-size:13px}
</style>
</head>
<body>
<header>
  <h1>DSH 插件市场</h1>
  <p class="sub">${items.length} 个插件${PACK_COUNT ? ` + ${PACK_COUNT} 个场景包` : ''}，按<strong>你要做的事</strong>分组。搜索支持中文、英文包名与同义词。</p>
  <input id="q" type="search" placeholder="试试：发票、对账、报关、合同、考勤…">
</header>
<nav>${FAMILIES.map((f) => `<a href="#${esc(f)}">${esc(f)} ${(groups.get(f) || []).length}</a>`).join('')}</nav>
<main>
${FAMILIES.map((f) => section([f, groups.get(f) || []])).join('\n')}
<p id="empty" hidden>没有匹配的插件。</p>
</main>
<footer>
  <p>所有插件在本地运行，不上传你的文件。版本与安装方式见各插件详情页；索引文件在 <a href="market/index.json">market/index.json</a>（format 1，可直接添加到 DSH 的插件索引源）。</p>
</footer>
<script>
const q = document.getElementById('q')
const cards = [...document.querySelectorAll('.card')]
const sections = [...document.querySelectorAll('section')]
q.addEventListener('input', () => {
  const term = q.value.trim().toLowerCase()
  let visible = 0
  for (const card of cards) {
    const hit = !term || card.dataset.search.includes(term)
    card.hidden = !hit
    if (hit) visible++
  }
  for (const s of sections) {
    s.hidden = ![...s.querySelectorAll('.card')].some((c) => !c.hidden)
  }
  document.getElementById('empty').hidden = visible > 0
})
</script>
</body>
</html>
`

fs.writeFileSync(path.join(root, 'docs', 'market.html'), html)
console.log(`wrote docs/market.html (${items.length} plugins, ${FAMILIES.length} families)`)
