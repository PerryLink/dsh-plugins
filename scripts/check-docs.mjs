#!/usr/bin/env node
/**
 * Verify the published domain index and the family projection.
 * Read-only; suitable for CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncVersions } from './sync-versions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const projectRoot = path.resolve(root, '..');
const errors = [];
let skippedSiblings = 0;
const read = (p) => fs.readFileSync(p, 'utf8');
const readJson = (p) => JSON.parse(read(p));

const packages = readJson(path.join(root, 'packages.json'));
const family = readJson(path.join(root, 'family.json'));
const taxonomy = readJson(path.join(root, 'taxonomy.v1.json'));

// Version numbers have exactly one source (packages.json). Dry-run the sync
// and fail if family.json / taxonomy.v1.json / README.md / docs/index.html
// would change.
try {
  const sync = syncVersions({ root, write: false, quiet: true });
  if (sync.total > 0) {
    const stale = sync.results.filter((r) => r.changed).map((r) => `${r.file}:${r.changed}`).join(', ');
    errors.push(`version surfaces are stale (${stale}); run node scripts/sync-versions.mjs`);
  }
} catch (error) {
  errors.push(`sync-versions: ${error.message}`);
}

if (packages.packages.length < 15) errors.push(`packages.json: only ${packages.packages.length} packages`);
if (packages.suites.length !== 2) errors.push(`packages.json: expected 2 suites, got ${packages.suites.length}`);
const missingZh = (family.items || []).filter((i) => !i.displayNameZh)
if (missingZh.length) errors.push(`family.json: ${missingZh.length} item(s) without a Chinese name (${missingZh.slice(0, 3).map((i) => i.id).join(', ')})`);
if (!fs.existsSync('docs/market.html')) errors.push('docs/market.html is missing');
if (!fs.existsSync('docs/family.html')) errors.push('docs/family.html is missing');
if (!fs.existsSync('market/index.json')) errors.push('market/index.json is missing');
if (!/^\d{4}-\d{2}-\d{2}$/.test(packages.updated)) errors.push(`packages.json: updated is not an ISO date (${packages.updated})`);

for (const p of [...packages.packages, ...packages.suites]) {
  if (!p.release.endsWith(`/v${p.version}`)) errors.push(`${p.name}: release URL does not end in /v${p.version}`);
  const page = path.join(root, 'docs', 'packages', `${p.name}.html`);
  if (!fs.existsSync(page)) errors.push(`${p.name}: missing docs page`);
  const sibling = path.join(projectRoot, p.dir, 'package.json');
  if (!fs.existsSync(sibling)) { skippedSiblings++; continue; }
  const pj = readJson(sibling);
  if (pj.version !== p.version) errors.push(`${p.name}: packages.json ${p.version} != package.json ${pj.version}`);
  for (const f of ['README.md', 'README-zh.md', 'README-es.md', 'README-pt.md', 'README-hi.md']) {
    if (!fs.existsSync(path.join(projectRoot, p.dir, f))) errors.push(`${p.name}: missing ${f}`);
  }
  const readme = read(path.join(projectRoot, p.dir, 'README.md'));
  if (!readme.includes('dsh plugin --profile')) errors.push(`${p.name}: README has no install command`);
  if (/\]\((fixtures\/|ACCEPTANCE\.csv)/.test(readme)) errors.push(`${p.name}: README still has a relative fixture link`);
}

const index = read(path.join(root, 'docs', 'index.html'));
for (const p of [...packages.packages, ...packages.suites]) {
  if (!index.includes(`packages/${p.name}.html`)) errors.push(`docs/index.html: no card for ${p.name}`);
}
if (!fs.existsSync(path.join(root, 'docs', 'taxonomy.html'))) errors.push('docs/taxonomy.html missing');
for (const item of family.items) {
  if (!fs.existsSync(path.join(root, 'docs', 'family', `${item.id}.html`))) errors.push(`docs/family: missing ${item.id}.html`);
}

if (!read(path.join(root, 'docs', 'taxonomy.html')).includes(`${family.counts.total} rows`)) errors.push('taxonomy page count does not match family.json');
const activeMedia = ['dsh-einvoice','dsh-bankrec','dsh-ap-three-way','dsh-travel-recon','dsh-legal-intake','dsh-legal-clause','dsh-policy-ledger','dsh-eval-pack'];
for (const name of activeMedia) {
  const entry = packages.packages.find((x) => x.name === name);
  if (!entry) { errors.push(`active media package missing: ${name}`); continue; }
  if (!fs.existsSync(path.join(projectRoot, entry.dir, 'package.json'))) { skippedSiblings++; continue; }
  for (const f of ['screenshots.json', 'TROUBLESHOOTING.md', `docs/assets/${name}-hero.png`]) {
    if (!fs.existsSync(path.join(projectRoot, entry.dir, f))) errors.push(`${name}: missing ${f}`);
  }
  const pj = readJson(path.join(projectRoot, entry.dir, 'package.json'));
  for (const f of ['screenshots.json', 'TROUBLESHOOTING.md']) {
    if (!pj.files.includes(f)) errors.push(`${name}: package.json files[] missing ${f}`);
  }
}
for (const name of ['dsh-finops-suite', 'dsh-contract-suite']) {
  const entry = packages.suites.find((x) => x.name === name);
  if (!entry) continue;
  if (!fs.existsSync(path.join(projectRoot, entry.dir, 'package.json'))) continue;
  const pj = readJson(path.join(projectRoot, entry.dir, 'package.json'));
  if (!pj.files.includes('SUITE.md')) errors.push(`${name}: package.json files[] missing SUITE.md`);
  if (!fs.existsSync(path.join(projectRoot, entry.dir, 'SUITE.md'))) errors.push(`${name}: missing SUITE.md`);
}
for (const p of [...packages.packages, ...packages.suites]) {
  const page = path.join(root, 'docs', 'packages', `${p.name}.html`);
  if (!fs.existsSync(page)) continue;
  const html = read(page);
  if (/href="(fixtures\/|ACCEPTANCE\.csv|README\.md|README-zh\.md|LICENSE)"/.test(html)) errors.push(`${p.name}: docs page has a relative repo link`);
}

// The two family blocks on each package page are generated by build-docs.mjs.
// Their counts must be the actual manifest counts, not a hand-typed number.
const readSpecs = (file) => read(path.join(root, file))
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, '').trim())
  .filter((line) => line && !line.startsWith('#'));
const kitPlugins = readSpecs('data/kit-plugins.txt');
const kitFamily = readSpecs('data/kit-family.txt');
if (kitPlugins.length !== 96) errors.push(`data/kit-plugins.txt: expected 96 install specs, got ${kitPlugins.length}`);
if (kitFamily.length !== 117) errors.push(`data/kit-family.txt: expected 117 install specs, got ${kitFamily.length}`);

const mainlineBlockRe = /<summary>Mainline family — (\d+) current install specs<\/summary><table>[\s\S]*?<tbody>([\s\S]*?)<\/tbody><\/table>/;
const domainBlockRe = /<summary>DSH domain plugin family \((\d+) packages \+ (\d+) suites\)<\/summary><table>[\s\S]*?<tbody>([\s\S]*?)<\/tbody><\/table>/;
for (const p of [...packages.packages, ...packages.suites]) {
  const page = path.join(root, 'docs', 'packages', `${p.name}.html`);
  if (!fs.existsSync(page)) continue;
  const html = read(page);
  const mainline = html.match(mainlineBlockRe);
  if (!mainline) {
    errors.push(`${p.name}: missing generated mainline family block`);
  } else {
    const declared = Number(mainline[1]);
    const rows = (mainline[2].match(/<tr>/g) || []).length;
    if (declared !== kitPlugins.length) errors.push(`${p.name}: mainline block says ${declared}, kit-plugins.txt has ${kitPlugins.length}`);
    if (rows !== kitPlugins.length) errors.push(`${p.name}: mainline block has ${rows} rows, kit-plugins.txt has ${kitPlugins.length}`);
  }
  const domain = html.match(domainBlockRe);
  if (!domain) {
    errors.push(`${p.name}: missing generated domain family block`);
  } else {
    const declared = Number(domain[1]) + Number(domain[2]);
    const rows = (domain[3].match(/<tr>/g) || []).length;
    const expected = packages.packages.length + packages.suites.length;
    if (declared !== expected) errors.push(`${p.name}: domain block says ${declared}, packages.json has ${expected}`);
    if (rows !== expected) errors.push(`${p.name}: domain block has ${rows} rows, packages.json has ${expected}`);
  }
}

// The 7 demo packages were reactivated; a frozen emoji is a stale marker.
for (const file of ['README.md', 'docs/index.html']) {
  const n = (read(path.join(root, file)).match(/🧊/g) || []).length;
  if (n) errors.push(`${file}: ${n} frozen emoji marker(s) remain, but those packages are active`);
}


const expectedRows = taxonomy.items.length + 39 + 7
if (family.counts.total !== expectedRows) errors.push(`family.json: expected ${expectedRows} rows, got ${family.counts.total}`);
const expectedActive = family.items.filter((i) => i.status === 'active').length
if (family.counts.active !== expectedActive) errors.push(`family.json: active count ${family.counts.active} != computed ${expectedActive}`);
if (family.counts.frozen !== 8) errors.push(`family.json: expected 8 frozen, got ${family.counts.frozen}`);
if (family.counts.retired !== 3) errors.push(`family.json: expected 3 retired, got ${family.counts.retired}`);
const scopeCounts = {};
for (const item of family.items) scopeCounts[item.installScope] = (scopeCounts[item.installScope] || 0) + 1;
const domainExpected = taxonomy.items.filter((i) => i.collection === 'domain-ops').length
const expectedScopes = { 'mainline-default':39, 'mainline-opt-in':53, 'catalog-only':10, domain:domainExpected, 'excluded-retired':3, infrastructure:3 };
for (const [k, v] of Object.entries(expectedScopes)) if (scopeCounts[k] !== v) errors.push(`family.json: installScope ${k} ${scopeCounts[k]} != ${v}`);


const cats = new Set(taxonomy.categories.map((x) => x.id));
const arches = new Set(taxonomy.archetypes.map((x) => x.id));
const statuses = new Set(['active', 'frozen', 'retired']);
const ids = new Set();
for (const item of family.items) {
  if (ids.has(item.id)) errors.push(`family.json: duplicate ${item.id}`);
  ids.add(item.id);
  if (!cats.has(item.category)) errors.push(`${item.id}: unknown category ${item.category}`);
  if (!arches.has(item.archetype)) errors.push(`${item.id}: unknown archetype ${item.archetype}`);
  if (!statuses.has(item.status)) errors.push(`${item.id}: unknown status ${item.status}`);
  if (!item.npm && item.id !== 'dsh-certification') errors.push(`${item.id}: missing npm`);
  if (!item.repo) errors.push(`${item.id}: missing repo`);
}
if (!taxonomy.items.length) errors.push('taxonomy.v1.json: no items');

if (errors.length) {
  console.error(`check-docs: ${errors.length} problem(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`check-docs ok: ${packages.packages.length} packages + ${packages.suites.length} suites; family ${family.counts.total}/${family.counts.active}/${family.counts.frozen}/${family.counts.retired}; taxonomy ${taxonomy.items.length}; sibling checks skipped=${skippedSiblings}.`);
