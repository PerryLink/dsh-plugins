#!/usr/bin/env node
/**
 * Generate docs/taxonomy.html from family.json.
 * Usage: node scripts/build-docs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const family = JSON.parse(fs.readFileSync(path.join(root, 'family.json'), 'utf8'));
const tax = JSON.parse(fs.readFileSync(path.join(root, 'taxonomy.v1.json'), 'utf8'));

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const categories = new Map(tax.categories.map((x) => [x.id, x]));
const archetypes = new Map(tax.archetypes.map((x) => [x.id, x]));
const collections = new Map(tax.collections.map((x) => [x.id, x]));
const order = ['mainline', 'compliance', 'domain-ops', 'infrastructure'];
const rows = [...family.items].sort((a, b) =>
  (order.indexOf(a.collection) - order.indexOf(b.collection)) ||
  String(a.category).localeCompare(String(b.category)) ||
  String(a.id).localeCompare(String(b.id)));

const option = (values, labels) => values.map((v) => `<option value="${esc(v)}">${esc(labels(v))}</option>`).join('');
const catLabel = (id) => categories.get(id)?.zh ? `${categories.get(id).zh} / ${id}` : id;
const archLabel = (id) => id;
const statusBadge = (s) => `<span class="status ${esc(s)}">${esc(s)}</span>`;

const body = rows.map((x) => {
  const name = x.displayName || x.id;
  const repo = x.repo?.startsWith('http') ? x.repo : `https://github.com/${x.repo}`;
  return `<tr data-category="${esc(x.category)}" data-archetype="${esc(x.archetype)}" data-status="${esc(x.status)}" data-collection="${esc(x.collection)}">
<td><a href="${esc(repo)}">${esc(x.id)}</a><br><small>${esc(name)}</small></td>
<td>${esc(collections.get(x.collection)?.id ?? x.collection)}</td>
<td>${esc(catLabel(x.category))}</td>
<td><code>${esc(x.archetype)}</code></td>
<td>${esc((x.domains || []).join(', '))}</td>
<td>${statusBadge(x.status)}</td></tr>`;
}).join('\n');

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>分类视图 — PerryLink DSH family</title><link rel="stylesheet" href="assets/style.css"></head>
<body><header class="top"><a href="index.html">PerryLink DSH 领域插件</a><span class="badge">taxonomy v1 · draft</span></header>
<main class="wrap">
<h1>DSH family taxonomy</h1>
<p class="lead">${family.counts.total} rows · ${family.counts.active} active · ${family.counts.frozen} frozen · ${family.counts.retired} retired. One primary category, one archetype, optional domain tags.</p>
<p class="note">This is a proposal view. It does not replace <a href="https://github.com/PerryLink/dsh-kit">dsh-kit</a> install semantics or any package's own README. Source: <a href="../family.json">family.json</a> · <a href="../TAXONOMY.md">TAXONOMY.md</a>.</p>
<div class="filters">
<label>Collection <select id="f-collection"><option value="">all</option>${option([...new Set(rows.map((x) => x.collection))], (v) => collections.get(v)?.id ?? v)}</select></label>
<label>Category <select id="f-category"><option value="">all</option>${option([...new Set(rows.map((x) => x.category))].sort(), catLabel)}</select></label>
<label>Archetype <select id="f-archetype"><option value="">all</option>${option([...new Set(rows.map((x) => x.archetype))].sort(), archLabel)}</select></label>
<label>Status <select id="f-status"><option value="">all</option>${option(['active', 'frozen', 'retired'], (v) => v)}</select></label>
<span id="count" class="meta"></span>
</div>
<noscript><p class="note">JavaScript is off; the full table is shown.</p></noscript>
<table id="family"><thead><tr><th>Package</th><th>Collection</th><th>Category</th><th>Archetype</th><th>Domains</th><th>Status</th></tr></thead>
<tbody>
${body}
</tbody></table>
<p class="meta">Generated from family.json; do not edit this page by hand. Run <code>node scripts/build-docs.mjs</code>.</p>
</main>
<footer class="foot"><p>Public/synthetic alpha family. No customer evidence, no GA claim. Apache-2.0.</p><p><a href="index.html">索引</a> · <a href="../TAXONOMY.md">TAXONOMY.md</a> · <a href="../family.json">family.json</a></p></footer>
<script>
const rows = [...document.querySelectorAll('#family tbody tr')];
const fields = ['collection','category','archetype','status'];
const selects = Object.fromEntries(fields.map(f => [f, document.getElementById('f-'+f)]));
function apply(){
  const active = Object.fromEntries(fields.map(f => [f, selects[f].value]));
  let n = 0;
  for (const row of rows) {
    const ok = fields.every(f => !active[f] || row.dataset[f] === active[f]);
    row.hidden = !ok;
    if (ok) n++;
  }
  document.getElementById('count').textContent = n + ' / ' + rows.length + ' shown';
}
for (const s of Object.values(selects)) s.addEventListener('change', apply);
apply();
</script>
</body></html>
`;
fs.writeFileSync(path.join(root, 'docs', 'taxonomy.html'), html);
console.log(`wrote docs/taxonomy.html (${rows.length} rows)`);
