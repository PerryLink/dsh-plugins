#!/usr/bin/env node
/**
 * Render docs/family.md into docs/family.html using the site chrome.
 * Zero dependencies: headings, blockquotes, tables, lists, fenced code,
 * bold, inline code and links only.
 *
 * Usage: node scripts/build-family-page.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const source = path.join(root, 'docs', 'family.md');
const target = path.join(root, 'docs', 'family.html');

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const inline = (raw) => {
  const codes = [];
  let s = esc(raw).replace(/`([^`]+)`/g, (_, code) => {
    codes.push(`<code>${code}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
};

const lines = fs.readFileSync(source, 'utf8').replace(/\r\n/g, '\n').split('\n');
const out = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (!line.trim()) { i++; continue; }
  if (line.startsWith('```')) {
    const buf = [];
    i++;
    while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++]);
    i++;
    out.push(`<pre><code>${esc(buf.join('\n'))}</code></pre>`);
    continue;
  }
  const heading = /^(#{1,4})\s+(.*)$/.exec(line);
  if (heading) {
    const level = heading[1].length;
    out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
    i++;
    continue;
  }
  if (line.startsWith('>')) {
    const buf = [];
    while (i < lines.length && lines[i].startsWith('>')) buf.push(lines[i++].replace(/^>\s?/, ''));
    out.push(`<blockquote><p>${inline(buf.join(' '))}</p></blockquote>`);
    continue;
  }
  if (line.startsWith('|') && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
    const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const head = cells(line);
    i += 2;
    const body = [];
    while (i < lines.length && lines[i].startsWith('|')) body.push(cells(lines[i++]));
    out.push(`<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    continue;
  }
  if (/^[-*]\s+/.test(line)) {
    const buf = [];
    while (i < lines.length && /^[-*]\s+/.test(lines[i])) buf.push(lines[i++].replace(/^[-*]\s+/, ''));
    out.push(`<ul>${buf.map((b) => `<li>${inline(b)}</li>`).join('')}</ul>`);
    continue;
  }
  if (/^\d+\.\s+/.test(line)) {
    const buf = [];
    while (i < lines.length && /^\d+\.\s+/.test(lines[i])) buf.push(lines[i++].replace(/^\d+\.\s+/, ''));
    out.push(`<ol>${buf.map((b) => `<li>${inline(b)}</li>`).join('')}</ol>`);
    continue;
  }
  const buf = [line];
  i++;
  while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\||```|[-*]\s|\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
  out.push(`<p>${inline(buf.join(' '))}</p>`);
}

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Full family index — PerryLink DSH family</title><link rel="stylesheet" href="assets/style.css"></head>
<body><header class="top"><a href="index.html">PerryLink DSH 领域插件</a><span class="badge">full family · 2026-11-04</span><a class="badge" href="taxonomy.html">分类视图 →</a><a class="badge" href="https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md">源文件</a></header>
<main class="wrap">
${out.join('\n')}
</main>
<footer class="foot"><p>Mirrored from <a href="https://github.com/PerryLink/PerryLink/blob/main/FAMILY.md">PerryLink/PerryLink/FAMILY.md</a>; runtime/domain rows come from <a href="../family.json">family.json</a>. Apache-2.0.</p><p><a href="index.html">索引</a> · <a href="market.html">按任务浏览</a> · <a href="taxonomy.html">分类视图</a> · <a href="https://github.com/PerryLink/dsh-plugins">GitHub</a></p></footer>
</body></html>
`;
fs.writeFileSync(target, html);
console.log(`build-family-page: wrote docs/family.html (${html.length} bytes) from docs/family.md`);
