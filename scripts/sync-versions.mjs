#!/usr/bin/env node
/**
 * Single-source the version numbers: `packages.json` is the only copy.
 *
 * Everything that repeats a package/suite version is a *projection* of
 * packages.json and is overwritten from it here:
 *
 *   - family.json            items[].version and suite members[].version
 *   - taxonomy.v1.json       items[].version and suite members[].version
 *   - README.md              the version cell of every package/suite row
 *   - docs/index.html        the <code>version</code> in every package card
 *
 * Suite member ids and order also come from packages.json suites[].members.
 *
 * Usage:
 *   node scripts/sync-versions.mjs            # write (idempotent)
 *   node scripts/sync-versions.mjs --check    # exit 1 if anything is stale
 *
 * build-family.mjs and build-docs.mjs call syncVersions() before rendering,
 * so a rebuild can never resurrect a stale number from the taxonomy seed.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, '..');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function loadPackages(root = defaultRoot) {
  const doc = readJson(path.join(root, 'packages.json'));
  if (!Array.isArray(doc.packages) || !Array.isArray(doc.suites)) {
    throw new Error('packages.json: expected packages[] and suites[]');
  }
  const entries = [...doc.packages, ...doc.suites];
  const versions = new Map(entries.map((x) => [x.name, x.version]));
  const suites = new Map(doc.suites.map((x) => [x.name, x.members]));
  for (const [name, version] of versions) {
    if (!version) throw new Error(`packages.json: ${name} has no version`);
  }
  return { doc, entries, versions, suites };
}

function syncItems(doc, versions, suiteMembers, label) {
  let changed = 0;
  const seen = new Set();
  for (const item of doc.items || []) {
    if (versions.has(item.id)) {
      seen.add(item.id);
      if (item.version !== versions.get(item.id)) {
        item.version = versions.get(item.id);
        changed++;
      }
    }
    if (suiteMembers.has(item.id)) {
      const want = suiteMembers.get(item.id).map((id) => {
        const version = versions.get(id);
        if (!version) throw new Error(`${label}: suite member ${id} is not in packages.json`);
        return { id, version };
      });
      if (JSON.stringify(item.members) !== JSON.stringify(want)) {
        item.members = want;
        changed++;
      }
    }
  }
  const missing = [...versions.keys()].filter((id) => !seen.has(id));
  if (missing.length) throw new Error(`${label}: missing version rows for ${missing.join(', ')}`);
  return changed;
}

function syncReadme(text, entries) {
  let changed = 0;
  for (const x of entries) {
    const re = new RegExp(
      '^(\\| \\[`' + escapeRe(x.name) + '`\\]\\([^)]*\\)[^|]*\\|[^|]*\\| )`([^`]*)`( \\|)',
      'm',
    );
    if (!re.test(text)) throw new Error(`README.md: no table row for ${x.name}`);
    const next = text.replace(re, (_, pre, _old, post) => `${pre}\`${x.version}\`${post}`);
    if (next !== text) {
      text = next;
      changed++;
    }
  }
  return { text, changed };
}

function syncIndex(text, entries) {
  let changed = 0;
  for (const x of entries) {
    const anchor = `packages/${x.name}.html`;
    const i = text.indexOf(anchor);
    if (i < 0) throw new Error(`docs/index.html: no card for ${x.name}`);
    const start = text.lastIndexOf('<article', i);
    const close = text.indexOf('</article>', i);
    if (start < 0 || close < 0) throw new Error(`docs/index.html: malformed card for ${x.name}`);
    const end = close + '</article>'.length;
    const card = text.slice(start, end);
    const re = /(<p class="meta"><code>)([^<]+)(<\/code>)/;
    if (!re.test(card)) throw new Error(`docs/index.html: no version <code> for ${x.name}`);
    const nextCard = card.replace(re, (_, pre, _old, post) => `${pre}${x.version}${post}`);
    if (nextCard !== card) {
      text = text.slice(0, start) + nextCard + text.slice(end);
      changed++;
    }
  }
  return { text, changed };
}

/**
 * Sync every derived version surface from packages.json.
 * @param {{root?: string, write?: boolean, quiet?: boolean}} options
 */
export function syncVersions({ root = defaultRoot, write = true, quiet = false } = {}) {
  const { entries, versions, suites } = loadPackages(root);
  const results = [];

  for (const file of ['family.json', 'taxonomy.v1.json']) {
    const p = path.join(root, file);
    const doc = readJson(p);
    const changed = syncItems(doc, versions, suites, file);
    if (changed && write) fs.writeFileSync(p, JSON.stringify(doc, null, 2) + '\n');
    results.push({ file, changed });
  }

  const readmePath = path.join(root, 'README.md');
  const readme = syncReadme(fs.readFileSync(readmePath, 'utf8'), entries);
  if (readme.changed && write) fs.writeFileSync(readmePath, readme.text);
  results.push({ file: 'README.md', changed: readme.changed });

  const indexPath = path.join(root, 'docs', 'index.html');
  const index = syncIndex(fs.readFileSync(indexPath, 'utf8'), entries);
  if (index.changed && write) fs.writeFileSync(indexPath, index.text);
  results.push({ file: 'docs/index.html', changed: index.changed });

  const total = results.reduce((n, r) => n + r.changed, 0);
  if (!quiet) {
    const detail = results.map((r) => `${r.file}:${r.changed}`).join(' ');
    console.log(`sync-versions ${write ? 'wrote' : 'checked'} ${versions.size} versions (${total} stale cell(s)/row(s); ${detail})`);
  }
  return { results, total, versions };
}

const invokedDirectly = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invokedDirectly) {
  const check = process.argv.includes('--check');
  const { total } = syncVersions({ write: !check });
  if (check && total > 0) {
    console.error(`sync-versions: ${total} stale version surface(s); run node scripts/sync-versions.mjs`);
    process.exit(1);
  }
}
