#!/usr/bin/env node
/**
 * Build family.json (125-row roster view) and the taxonomy views from
 * taxonomy.v1.json + the mainline roster + the three support/retired rows.
 *
 * Usage: node scripts/build-family.mjs
 * Outputs: ../family.json, ../views/*.json
 *
 * This is deliberately a projection, not a second source of truth:
 *   - domain/compliance items come from taxonomy.v1.json;
 *   - the 39 mainline install specs come from dsh-kit/plugins.txt;
 *   - the frozen/retired/support rows are the documented edge set below.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const taxonomy = JSON.parse(fs.readFileSync(path.join(root, 'taxonomy.v1.json'), 'utf8'));
const kit = path.join(root, 'data', 'mainline-specs.txt');
const roster = fs.readFileSync(kit, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.replace(/\s+#.*$/, '').trim())
  .filter((line) => line && !line.startsWith('#'));

const checkerIds = new Set(taxonomy.items.filter((x) => x.collection === 'compliance').map((x) => x.id));
const mainline = roster
  .map((spec) => spec.replace(/^@perrylink\//, ''))
  .filter((id) => !checkerIds.has(id));

const scoped = new Map([
  ['dsh-github', '@perrylink/dsh-github'],
  ['dsh-plugin-doctor', '@perrylink/dsh-plugin-doctor'],
  ['dsh-plugin-kit', '@perrylink/dsh-plugin-kit'],
  ['dsh-skill-pack-security-provider', '@perrylink/dsh-skill-pack-security-provider'],
  ['dsh-ticktick', '@perrylink/dsh-ticktick'],
]);

const frozenMainline = new Set([
  'dsh-budget', 'dsh-draw', 'dsh-claude-move', 'dsh-reach', 'dsh-defend',
  'dsh-autotier', 'dsh-cert-mcp',
]);

const mainlineMeta = {
  'dsh-auto-review': ['workflow', 'assistant', ['approval', 'security']],
  'dsh-autotier': ['observability', 'runtime', ['model-routing', 'cost']],
  'dsh-budget': ['observability', 'calculator', ['cost']],
  'dsh-cert-mcp': ['platform', 'catalog', ['certification', 'mcp']],
  'dsh-checkpoint-rewind': ['workflow', 'runtime', ['sessions']],
  'dsh-claude-move': ['integrations', 'ingest', ['migration']],
  'dsh-click': ['interface', 'ui', ['desktop', 'ocr']],
  'dsh-composer-history': ['interface', 'ui', ['input']],
  'dsh-data-quality': ['developer-tools', 'validator', ['data']],
  'dsh-defend': ['security', 'runtime', ['prompt-injection']],
  'dsh-doublecheck': ['workflow', 'assistant', ['quality-gate']],
  'dsh-draw': ['interface', 'ui', ['visual']],
  'dsh-fast': ['observability', 'runtime', ['performance']],
  'dsh-fund-research': ['research', 'assistant', ['funds']],
  'dsh-industry-research': ['research', 'assistant', ['industry']],
  'dsh-laya': ['integrations', 'integration', ['automation']],
  'dsh-library': ['content', 'extractor', ['knowledge']],
  'dsh-local-ai': ['integrations', 'integration', ['local-model']],
  'dsh-lsp-actions': ['developer-tools', 'integration', ['lsp']],
  'dsh-mask': ['security', 'runtime', ['secrets']],
  'dsh-mcp-panel': ['developer-tools', 'integration', ['mcp']],
  'dsh-memento': ['workflow', 'runtime', ['memory']],
  'dsh-observe': ['observability', 'runtime', ['telemetry']],
  'dsh-output-styles': ['interface', 'ui', ['output']],
  'dsh-permission-rules': ['security', 'runtime', ['permissions']],
  'dsh-plugin-guide': ['developer-tools', 'assistant', ['plugin-dev']],
  'dsh-plugin-upgrade': ['workflow', 'integration', ['upgrade']],
  'dsh-reach': ['integrations', 'integration', ['messaging']],
  'dsh-research-report': ['research', 'assistant', ['research']],
  'dsh-score': ['developer-tools', 'assistant', ['evaluation']],
  'dsh-session-sync': ['workflow', 'runtime', ['sessions']],
  'dsh-talk': ['content', 'ui', ['chat']],
  'dsh-test-drive': ['workflow', 'assistant', ['testing']],
  'dsh-translate': ['content', 'assistant', ['translation']],
  'dsh-github': ['workflow', 'integration', ['github']],
  'dsh-plugin-doctor': ['developer-tools', 'doctor', ['plugin-install']],
  'dsh-plugin-kit': ['developer-tools', 'catalog', ['plugin-dev']],
  'dsh-skill-pack-security-provider': ['security', 'assistant', ['security-audit']],
  'dsh-ticktick': ['integrations', 'integration', ['tasks']],
};

const items = [];
for (const t of taxonomy.items) {
  items.push({
    ...t,
    repo: t.repo ?? `PerryLink/${t.id}`,
    npm: t.npm ?? t.id,
    source: 'taxonomy.v1.json',
  });
}

for (const id of mainline) {
  const meta = mainlineMeta[id];
  if (!meta) throw new Error(`mainline metadata missing for ${id}`);
  const [category, archetype, domains] = meta;
  items.push({
    id,
    kind: 'plugin',
    collection: 'mainline',
    category,
    archetype,
    domains,
    status: frozenMainline.has(id) ? 'frozen' : 'active',
    release: 'stable',
    npm: scoped.get(id) ?? id,
    repo: id === 'dsh-laya' ? 'laya-family/dsh-laya' : `PerryLink/${id}`,
    source: 'dsh-kit/plugins.txt',
    mappingConfidence: 'provisional',
  });
}

const edge = [
  ['dsh-community-bench', 'mainline', 'developer-tools', 'validator', ['benchmark'], 'frozen', 'PerryLink/dsh-community-bench'],
  ['dsh-background-agents', 'mainline', 'workflow', 'runtime', ['agents'], 'retired', 'PerryLink/dsh-background-agents'],
  ['dsh-session-pin', 'mainline', 'interface', 'ui', ['sessions'], 'retired', 'PerryLink/dsh-session-pin'],
  ['dsh-team-rooms', 'mainline', 'workflow', 'runtime', ['agents'], 'retired', 'PerryLink/dsh-team-rooms'],
  ['dsh-kit', 'infrastructure', 'platform', 'catalog', ['install'], 'active', 'PerryLink/dsh-kit'],
  ['dsh-catalog', 'infrastructure', 'platform', 'catalog', ['market'], 'active', 'PerryLink/dsh-catalog'],
  ['dsh-plugin-certification', 'infrastructure', 'platform', 'catalog', ['certification'], 'active', 'PerryLink/dsh-plugin-certification'],
];
for (const [id, collection, category, archetype, domains, status, repo] of edge) {
  items.push({
    id, kind: id.startsWith('dsh-kit') || id === 'dsh-catalog' || id === 'dsh-plugin-certification' ? 'infrastructure' : 'plugin',
    collection, category, archetype, domains, status, release: status === 'retired' ? 'retired' : 'stable',
    npm: id, repo, source: 'documented edge set',
  });
}

const ids = new Set();
for (const item of items) {
  if (ids.has(item.id)) throw new Error(`duplicate family id ${item.id}`);
  ids.add(item.id);
}
if (items.length !== 125) throw new Error(`expected 125 family rows, got ${items.length}`);

const counts = {};
for (const item of items) {
  const key = `${item.collection}/${item.category}/${item.archetype}/${item.status}`;
  counts[key] = (counts[key] || 0) + 1;
}
const byStatus = {};
const byCategory = {};
const byArchetype = {};
for (const item of items) {
  byStatus[item.status] ??= [];
  byCategory[item.category] ??= [];
  byArchetype[item.archetype] ??= [];
  byStatus[item.status].push(item.id);
  byCategory[item.category].push(item.id);
  byArchetype[item.archetype].push(item.id);
}
const family = {
  schemaVersion: '1.0.0-draft',
  updated: '2026-11-01',
  status: 'proposal',
  scope: '125-row working roster: 92 install specs + 9 newer compliance tools + 17 domain packages/suites + dsh-community-bench + 3 retired + 3 infrastructure rows.',
  counts: {
    total: items.length,
    active: items.filter((x) => x.status === 'active').length,
    frozen: items.filter((x) => x.status === 'frozen').length,
    retired: items.filter((x) => x.status === 'retired').length,
  },
  items,
};

fs.writeFileSync(path.join(root, 'family.json'), JSON.stringify(family, null, 2) + '\n');
fs.mkdirSync(path.join(root, 'views'), { recursive: true });
for (const [name, value] of [['by-category', byCategory], ['by-archetype', byArchetype], ['by-status', byStatus]]) {
  const sorted = Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v].sort()]));
  fs.writeFileSync(path.join(root, 'views', `${name}.json`), JSON.stringify(sorted, null, 2) + '\n');
}
console.log('family', family.counts, 'rows', items.length);
console.log('mainline', mainline.length, 'duplicates?', mainline.length !== new Set(mainline).size);
