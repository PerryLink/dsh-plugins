#!/usr/bin/env node
/**
 * Generate docs/taxonomy.html and docs/family/*.html from family.json, and
 * refresh the two family blocks embedded in every docs/packages/*.html.
 *
 * Version numbers are not read from family.json: syncVersions() overwrites
 * them (and README.md / docs/index.html) from packages.json before rendering.
 * The "Mainline family" block is generated from data/kit-plugins.txt, the
 * vendored dsh-kit plugins.txt snapshot, so its count is never typed by hand.
 *
 * Usage: node scripts/build-docs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncVersions } from './sync-versions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
syncVersions({ root, quiet: true });
const packagesDoc = JSON.parse(fs.readFileSync(path.join(root, 'packages.json'), 'utf8'));
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
  return `<tr data-category="${esc(x.category)}" data-archetype="${esc(x.archetype)}" data-status="${esc(x.status)}" data-collection="${esc(x.collection)}" data-scope="${esc(x.installScope)}">
<td><a href="family/${esc(x.id)}.html">${esc(x.id)}</a><br><small>${esc(name)}</small></td>
<td>${esc(collections.get(x.collection)?.id ?? x.collection)}</td>
<td>${esc(catLabel(x.category))}</td>
<td><code>${esc(x.archetype)}</code></td>
<td><code>${esc(x.installScope)}</code></td>
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
<label>Install scope <select id="f-scope"><option value="">all</option>${option([...new Set(rows.map((x) => x.installScope))].sort(), (v) => v)}</select></label>
<span id="count" class="meta"></span>
</div>
<noscript><p class="note">JavaScript is off; the full table is shown.</p></noscript>
<table id="family"><thead><tr><th>Package</th><th>Collection</th><th>Category</th><th>Archetype</th><th>Install scope</th><th>Domains</th><th>Status</th></tr></thead>
<tbody>
${body}
</tbody></table>
<p class="meta">Generated from family.json; do not edit this page by hand. Run <code>node scripts/build-docs.mjs</code>.</p>
</main>
<footer class="foot"><p>Public/synthetic alpha family. No customer evidence, no GA claim. Apache-2.0.</p><p><a href="index.html">索引</a> · <a href="../TAXONOMY.md">TAXONOMY.md</a> · <a href="../family.json">family.json</a></p></footer>
<script>
const rows = [...document.querySelectorAll('#family tbody tr')];
const fields = ['collection','category','archetype','status','scope'];
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
// Full family pages. These are deliberately metadata pages, not copies of
// each README: the package README stays the source for tool-level detail.
const familyDir = path.join(root, 'docs', 'family');
fs.mkdirSync(familyDir, { recursive: true });
for (const x of rows) {
  const repo = x.repo?.startsWith('http') ? x.repo : `https://github.com/${x.repo}`;
  const npm = x.npm ? `https://www.npmjs.com/package/${x.npm}` : null;
  const members = Array.isArray(x.members) && x.members.length
    ? `<h2>Members</h2><table><thead><tr><th>Member</th><th>Pinned version</th></tr></thead><tbody>${x.members.map((m) => `<tr><td><code>${esc(m.id)}</code></td><td><code>${esc(m.version)}</code></td></tr>`).join('')}</tbody></table>`
    : '';
  const related = Array.isArray(x.relatedCheckers) && x.relatedCheckers.length
    ? `<h2>Related checkers</h2><ul>${x.relatedCheckers.map((id) => `<li><a href="${esc(id)}.html"><code>${esc(id)}</code></a></li>`).join('')}</ul>`
    : '';
  const relatedTools = Array.isArray(x.relatedTools) && x.relatedTools.length
    ? `<h2>Related tools</h2><ul>${x.relatedTools.map((id) => `<li><a href="${esc(id)}.html"><code>${esc(id)}</code></a></li>`).join('')}</ul>`
    : '';
  const positioning = x.positioning || (x.collection === 'mainline'
    ? 'A mainline PerryLink DSH package. See the repository README for its tool surface and boundary.'
    : x.collection === 'infrastructure'
      ? 'Family infrastructure; not a runtime plugin.'
      : 'A PerryLink DSH family package. See the repository README for its tool surface and boundary.');
  const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(x.id)} — DSH family</title><link rel="stylesheet" href="../assets/style.css"></head>
<body><header class="top"><a href="../taxonomy.html">DSH family taxonomy</a><span class="badge">${esc(x.status)}</span></header>
<main class="wrap">
<p class="meta"><a href="../index.html">index</a> / <a href="../taxonomy.html">taxonomy</a> / ${esc(x.collection)}</p>
<h1>${esc(x.id)}</h1>
<p class="lead">${esc(x.displayName || x.id)}</p>
<p>${esc(positioning)}</p>
<p class="meta">Category: <code>${esc(x.category)}</code> · Archetype: <code>${esc(x.archetype)}</code> · Domains: ${(x.domains || []).map((d) => `<code>${esc(d)}</code>`).join(', ') || '—'} · Collection: <code>${esc(x.collection)}</code> · Install scope: <code>${esc(x.installScope)}</code> · Status: <code>${esc(x.status)}</code></p>
<p><a href="${esc(repo)}">Repository</a>${npm ? ` · <a href="${esc(npm)}">npm</a>` : ''}${x.docs ? ` · <a href="${esc(x.docs)}">docs</a>` : ''}${x.suite ? ` · suite: <code>${esc(x.suite)}</code>` : ''}</p>
${members}
${related}
${relatedTools}
<p class="note">Public/synthetic alpha family metadata. No customer evidence, no GA claim. Apache-2.0.</p>
</main>
<footer class="foot"><p><a href="../taxonomy.html">taxonomy</a> · <a href="../index.html">index</a> · <a href="../../TAXONOMY.md">TAXONOMY.md</a></p></footer>
</body></html>
`;
  fs.writeFileSync(path.join(familyDir, `${x.id}.html`), html);
}
console.log(`wrote docs/family (${rows.length} pages)`);

// Refresh the "Mainline family" block embedded in every published package
// page. The rest of each page (including the domain-family block above it) is
// hand-curated; check-docs.mjs verifies that block's counts. This block is
// generated from the vendored dsh-kit plugins.txt roster, so its
// "N current install specs" number is the actual spec-line count.
const readSpecs = (file) => fs.readFileSync(path.join(root, file), 'utf8')
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, '').trim())
  .filter((line) => line && !line.startsWith('#'));
const kitSpecs = readSpecs('data/kit-plugins.txt');
if (!kitSpecs.length) throw new Error('data/kit-plugins.txt contains no install specs');

const rowHtml = (label, repo, npm) => `<tr>
<td><strong><a href="${esc(repo)}">${esc(label)}</a></strong></td>
<td><a href="${esc(npm)}">npm</a></td>
</tr>
`;
const blockHtml = (summary, entries) => `<details>
<summary>${summary}</summary><table>
<thead>
<tr>
<th>Package</th>
<th>npm</th>
</tr>
</thead>
<tbody>${entries.map((e) => rowHtml(e.label, e.repo, e.npm)).join('')}</tbody></table>
</details>`;

const pageNames = [...packagesDoc.packages, ...packagesDoc.suites].map((p) => p.name);
const mainlineEntries = kitSpecs.map((spec) => ({
  label: spec,
  repo: `https://github.com/PerryLink/${spec.replace(/^@perrylink\//, '')}`,
  npm: `https://www.npmjs.com/package/${spec}`,
}));
const mainlineBlock = blockHtml(`Mainline family — ${mainlineEntries.length} current install specs`, mainlineEntries);

const mainlineRe = /<details>\n<summary>Mainline family — \d+ current install specs<\/summary><table>[\s\S]*?<\/table>\n<\/details>/;
let refreshed = 0;
for (const name of pageNames) {
  const pagePath = path.join(root, 'docs', 'packages', `${name}.html`);
  if (!fs.existsSync(pagePath)) throw new Error(`docs/packages/${name}.html is missing`);
  const before = fs.readFileSync(pagePath, 'utf8');
  const mainlineMatches = before.match(new RegExp(mainlineRe.source, 'g')) || [];
  if (mainlineMatches.length !== 1) {
    throw new Error(`docs/packages/${name}.html: expected one mainline block, got ${mainlineMatches.length}`);
  }
  const after = before.replace(mainlineRe, () => mainlineBlock);
  if (after !== before) {
    fs.writeFileSync(pagePath, after);
    refreshed++;
  }
}
console.log(`wrote docs/packages (${pageNames.length} pages, ${mainlineEntries.length} mainline specs, ${refreshed} changed)`);

