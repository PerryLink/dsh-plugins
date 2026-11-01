#!/usr/bin/env node
/**
 * Validate the four-axis taxonomy seed without external dependencies.
 *
 * Usage: node scripts/check-taxonomy.mjs [path]
 * Default path: ../taxonomy.v1.json relative to this script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || path.join(here, '..', 'taxonomy.v1.json');
const taxonomy = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];

const ids = new Set();
for (const item of taxonomy.items || []) {
  if (!item.id) errors.push('item without id');
  if (ids.has(item.id)) errors.push(`duplicate id: ${item.id}`);
  ids.add(item.id);

  const categories = new Set(taxonomy.categories.map((x) => x.id));
  const archetypes = new Set(taxonomy.archetypes.map((x) => x.id));
  const collections = new Set(taxonomy.collections.map((x) => x.id));
  const statuses = new Set(['active', 'frozen', 'retired']);

  if (!categories.has(item.category)) errors.push(`${item.id}: unknown category ${item.category}`);
  if (!archetypes.has(item.archetype)) errors.push(`${item.id}: unknown archetype ${item.archetype}`);
  if (!collections.has(item.collection)) errors.push(`${item.id}: unknown collection ${item.collection}`);
  if (!statuses.has(item.status)) errors.push(`${item.id}: unknown status ${item.status}`);
  if (item.kind === 'suite') {
    if (item.archetype !== 'suite') errors.push(`${item.id}: suite must use archetype=suite`);
    if (!Array.isArray(item.members) || item.members.length === 0) errors.push(`${item.id}: suite without members`);
  }
  if (item.archetype === 'checker' && item.checker !== true) errors.push(`${item.id}: checker archetype without checker=true`);
  if (item.category === 'compliance' && item.collection !== 'compliance') errors.push(`${item.id}: compliance category outside compliance collection`);
  if (item.checker === true && item.checkerRole === 'none') errors.push(`${item.id}: checker=true with checkerRole=none`);
}

if (!Array.isArray(taxonomy.items) || taxonomy.items.length === 0) errors.push('no items');

const counts = {};
for (const item of taxonomy.items || []) {
  const key = `${item.collection}/${item.category}/${item.archetype}/${item.status}`;
  counts[key] = (counts[key] || 0) + 1;
}

if (errors.length) {
  console.error(`FAIL ${file}: ${errors.length} error(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const byCollection = {};
const byStatus = {};
const byCategory = {};
for (const item of taxonomy.items) {
  byCollection[item.collection] = (byCollection[item.collection] || 0) + 1;
  byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  byCategory[item.category] = (byCategory[item.category] || 0) + 1;
}
console.log(`OK ${file}`);
console.log(`items=${taxonomy.items.length}`);
console.log(`collection=${JSON.stringify(byCollection)}`);
console.log(`status=${JSON.stringify(byStatus)}`);
console.log(`category=${JSON.stringify(byCategory)}`);
console.log(`checker-first=${taxonomy.items.filter((x) => x.checker).length}`);
