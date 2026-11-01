#!/usr/bin/env node
/**
 * Verify the published domain index and the 125-row family projection.
 * Read-only; suitable for CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

if (packages.packages.length !== 15) errors.push(`packages.json: expected 15 packages, got ${packages.packages.length}`);
if (packages.suites.length !== 2) errors.push(`packages.json: expected 2 suites, got ${packages.suites.length}`);
if (packages.updated !== '2026-11-01') errors.push(`packages.json: updated is ${packages.updated}`);

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


if (family.counts.total !== 125) errors.push(`family.json: expected 125 rows, got ${family.counts.total}`);
if (family.counts.active !== 107) errors.push(`family.json: expected 107 active, got ${family.counts.active}`);
if (family.counts.frozen !== 15) errors.push(`family.json: expected 15 frozen, got ${family.counts.frozen}`);
if (family.counts.retired !== 3) errors.push(`family.json: expected 3 retired, got ${family.counts.retired}`);
const scopeCounts = {};
for (const item of family.items) scopeCounts[item.installScope] = (scopeCounts[item.installScope] || 0) + 1;
const expectedScopes = { 'mainline-default':39, 'mainline-opt-in':53, 'catalog-only':10, domain:17, 'excluded-retired':3, infrastructure:3 };
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
  if (!item.npm) errors.push(`${item.id}: missing npm`);
  if (!item.repo) errors.push(`${item.id}: missing repo`);
}
if (taxonomy.items.length !== 79) errors.push(`taxonomy.v1.json: expected 79 items, got ${taxonomy.items.length}`);

if (errors.length) {
  console.error(`check-docs: ${errors.length} problem(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`check-docs ok: ${packages.packages.length} packages + ${packages.suites.length} suites; family ${family.counts.total}/${family.counts.active}/${family.counts.frozen}/${family.counts.retired}; taxonomy ${taxonomy.items.length}; sibling checks skipped=${skippedSiblings}.`);
