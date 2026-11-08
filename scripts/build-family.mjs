#!/usr/bin/env node
/**
 * Build family.json (roster view) and the taxonomy views from
 * taxonomy.v1.json + the mainline roster + the three support/retired rows.
 *
 * Usage: node scripts/build-family.mjs
 * Outputs: ../family.json, ../views/*.json
 *
 * This is deliberately a projection, not a second source of truth:
 *   - domain/compliance items come from taxonomy.v1.json;
 *   - the 39 mainline install specs come from dsh-kit/plugins.txt;
 *   - the frozen/retired/support rows are the documented edge set below.
 *   - versions are never authored here: syncVersions() overlays packages.json
 *     onto taxonomy.v1.json (and family.json) before the projection runs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncVersions } from './sync-versions.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
syncVersions({ root, quiet: true });
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

const scoped = new Map();

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
  'dsh-primer': ['developer-tools', 'assistant', ['plugin-dev']],
  'dsh-codemod': ['workflow', 'integration', ['upgrade']],
  'dsh-reach': ['integrations', 'integration', ['messaging']],
  'dsh-research-report': ['research', 'assistant', ['research']],
  'dsh-score': ['developer-tools', 'assistant', ['evaluation']],
  'dsh-session-sync': ['workflow', 'runtime', ['sessions']],
  'dsh-talk': ['content', 'ui', ['chat']],
  'dsh-test-drive': ['workflow', 'assistant', ['testing']],
  'dsh-param-repair': ['developer-tools', 'runtime', ['parameter-mapping', 'json-repair']],
  'dsh-github-bot': ['workflow', 'integration', ['github']],
  'dsh-clinic': ['developer-tools', 'doctor', ['plugin-install']],
  'dsh-scaffold': ['developer-tools', 'catalog', ['plugin-dev']],
  'dsh-security-pack': ['security', 'assistant', ['security-audit']],
  'dsh-dida': ['integrations', 'integration', ['tasks']],
};

const items = [];
for (const t of taxonomy.items) {
  const installScope = t.collection === 'domain-ops'
    ? 'domain'
    : t.collection === 'compliance'
      ? (t.roster === false ? 'catalog-only' : 'mainline-opt-in')
      : (t.collection === 'infrastructure' ? 'infrastructure' : 'catalog-only');
  items.push({
    ...t,
    repo: t.repo ?? `PerryLink/${t.id}`,
    npm: t.npm ?? t.id,
    source: 'taxonomy.v1.json',
    installScope,
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
    installScope: 'mainline-default',
    mappingConfidence: 'reviewed',
  });
}

const edge = [
  ['dsh-community-bench', 'mainline', 'developer-tools', 'validator', ['benchmark'], 'frozen', 'PerryLink/dsh-community-bench'],
  ['dsh-background-agents', 'mainline', 'workflow', 'runtime', ['agents'], 'retired', 'PerryLink/dsh-background-agents'],
  ['dsh-session-pin', 'mainline', 'interface', 'ui', ['sessions'], 'retired', 'PerryLink/dsh-session-pin'],
  ['dsh-team-rooms', 'mainline', 'workflow', 'runtime', ['agents'], 'retired', 'PerryLink/dsh-team-rooms'],
  ['dsh-kit', 'infrastructure', 'platform', 'catalog', ['install'], 'active', 'PerryLink/dsh-kit'],
  ['dsh-catalog', 'infrastructure', 'platform', 'catalog', ['market'], 'active', 'PerryLink/dsh-catalog'],
  ['dsh-certification', 'infrastructure', 'platform', 'catalog', ['certification'], 'active', 'PerryLink/dsh-certification'],
];
for (const [id, collection, category, archetype, domains, status, repo] of edge) {
  items.push({
    id, kind: id.startsWith('dsh-kit') || id === 'dsh-catalog' || id === 'dsh-certification' ? 'infrastructure' : 'plugin',
    collection, category, archetype, domains, status, release: status === 'retired' ? 'retired' : 'stable',
    npm: id === 'dsh-certification' ? null : id, repo, source: 'documented edge set',
    installScope: status === 'retired' ? 'excluded-retired' : (collection === 'infrastructure' ? 'infrastructure' : 'catalog-only'),
  });
}

// Chinese display metadata is authored once in data/zh-meta.json and merged here,
// so family.json stays a projection instead of a second source of truth.
const zhMetaPath = path.join(root, 'data', 'zh-meta.json');
if (fs.existsSync(zhMetaPath)) {
  const zhMeta = JSON.parse(fs.readFileSync(zhMetaPath, 'utf8'));
  for (const item of items) {
    const meta = zhMeta[item.id];
    if (!meta) continue;
    item.displayNameZh = meta.nameZh;
    item.tagsZh = meta.tags;
    item.taskFamilyZh = meta.taskFamily;
    item.rolesZh = meta.roles;
    item.industriesZh = meta.industries;
  }
}

const ids = new Set();
for (const item of items) {
  if (ids.has(item.id)) throw new Error(`duplicate family id ${item.id}`);
  ids.add(item.id);
}
const EXPECTED_ROWS = taxonomy.items.length + mainline.length + edge.length
if (items.length !== EXPECTED_ROWS) throw new Error(`expected ${EXPECTED_ROWS} family rows, got ${items.length}`);

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
  scope: '126-row working roster: 92 family mainline rows (39 default + 53 opt-in) + 9 newer compliance tools + 17 domain packages/suites + dsh-provider-params + dsh-community-bench + 3 retired + 3 infrastructure rows.',
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
