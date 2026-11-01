#!/usr/bin/env node
/**
 * Release driver for one domain package.
 *
 * Usage: node scripts/release-package.mjs <pkg-dir> <repo-name> [--dry-run]
 *
 * Steps: clean worktree from origin/main -> copy the changed code/docs -> bump the version in
 * package.json and scripts/lint.mjs -> retitle CHANGELOG -> build/typecheck/lint/test/gate ->
 * commit, push main, tag, push tag. The tag triggers publish.yml (npm provenance + pre-release).
 *
 * It never publishes locally; provenance would be lost.
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const [pkgDirArg, repoArg, ...rest] = process.argv.slice(2)
if (!pkgDirArg || !repoArg) {
  console.error('usage: release-package.mjs <pkg-dir> <repo-name> [--dry-run]')
  process.exit(2)
}
const dryRun = rest.includes('--dry-run')
const pkgDir = path.resolve(pkgDirArg)
const repoName = repoArg
const workRoot = `/tmp/rel-${path.basename(pkgDir)}`
const sh = (cmd, cwd = pkgDir, quiet = true) =>
  execSync(cmd, { cwd, stdio: quiet ? 'pipe' : 'inherit', encoding: 'utf8' }).toString().trim()

const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
const bump = (v) => {
  const m = /^(\d+\.\d+\.\d+-alpha\.)(\d+)$/.exec(v)
  if (!m) throw new Error(`unexpected version ${v}`)
  return `${m[1]}${Number(m[2]) + 1}`
}
console.log(`[${pkg.name}] local ${pkg.version}`)
if (dryRun) process.exit(0)

// 1. clean worktree from origin/main
sh('git fetch origin --quiet')
try { execSync(`git worktree remove --force ${workRoot}`, { cwd: pkgDir, stdio: 'pipe' }) } catch { /* not present */ }
fs.rmSync(workRoot, { recursive: true, force: true })
sh('git worktree prune')
sh(`git worktree add -q ${workRoot} origin/main -b release/${Date.now()}`)
const workVersion = JSON.parse(fs.readFileSync(path.join(workRoot, 'package.json'), 'utf8')).version
const nextVersion = bump(workVersion)
console.log(`  main ${workVersion} -> ${nextVersion}`)
sh(`ln -sfn ${path.join(pkgDir, 'node_modules')} ${path.join(workRoot, 'node_modules')}`)

// 2. copy the changed source/test/docs files (READMEs stay as they are on main)
const copy = ['ACKNOWLEDGEMENTS.md', 'CHANGELOG.md', 'ACCEPTANCE.csv', 'screenshots.json']
const walk = (dir) => {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'lib', 'dist', 'evidence', '.tmp'].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}
for (const dir of ['src', 'test', 'scripts', 'docs']) {
  const base = path.join(pkgDir, dir)
  if (!fs.existsSync(base)) continue
  for (const file of walk(base)) {
    const rel = path.relative(pkgDir, file)
    if (rel.endsWith('scripts/lint.mjs')) continue
    if (rel.startsWith('docs/assets/') && !/\.(png|svg|gif)$/i.test(rel)) continue
    const dest = path.join(workRoot, rel)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(file, dest)
  }
}
for (const file of copy) {
  const src = path.join(pkgDir, file)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(workRoot, file))
}

// 3. bump both version carriers
const workPkgPath = path.join(workRoot, 'package.json')
const workPkg = JSON.parse(fs.readFileSync(workPkgPath, 'utf8'))
workPkg.version = nextVersion
fs.writeFileSync(workPkgPath, JSON.stringify(workPkg, null, 2) + '\n')
const lintPath = path.join(workRoot, 'scripts', 'lint.mjs')
if (fs.existsSync(lintPath)) {
  const before = fs.readFileSync(lintPath, 'utf8')
  const after = before.split(workVersion).join(nextVersion)
  if (after === before) console.log(`  warn: ${pkg.name} lint script did not contain ${workVersion}`)
  fs.writeFileSync(lintPath, after)
}
// git can consider a same-size, same-second rewrite unchanged (racy stat cache on 9p mounts);
// bumping the mtime forces a content re-hash before the commit
const future = new Date(Date.now() + 5000)
for (const f of [workPkgPath, lintPath, path.join(workRoot, 'CHANGELOG.md')]) {
  if (fs.existsSync(f)) fs.utimesSync(f, future, future)
}
const logPath = path.join(workRoot, 'CHANGELOG.md')
if (fs.existsSync(logPath)) {
  const log = fs.readFileSync(logPath, 'utf8').replace('## [Unreleased]', `## [${nextVersion}] — 2026-11-01`)
  fs.writeFileSync(logPath, log)
}

// 4. gates
const run = (cmd) => {
  try { execSync(cmd, { cwd: workRoot, stdio: 'pipe' }) } catch (error) {
    console.error(`[${pkg.name}] gate failed: ${cmd}\n${error.stdout || ''}${error.stderr || ''}`)
    process.exit(1)
  }
  console.log(`  ok: ${cmd}`)
}
run('node_modules/.bin/tsc -p tsconfig.json')
run('node_modules/.bin/tsc -p tsconfig.json --noEmit')
run('node scripts/lint.mjs')
run('node --test test/*.test.mjs')
const gateKey = Object.keys(pkg.scripts).find((k) => k === 'gate' || k.startsWith('gate:'))
if (gateKey) run(pkg.scripts[gateKey])
else console.log('  note: no gate script in package.json')

// 5. commit, push, tag
const git = (cmd) => execSync(cmd, {
  cwd: workRoot,
  stdio: 'pipe',
  encoding: 'utf8',
  env: { ...process.env, GIT_AUTHOR_NAME: 'PerryLink', GIT_AUTHOR_EMAIL: 'novelnexusai@outlook.com', GIT_COMMITTER_NAME: 'PerryLink', GIT_COMMITTER_EMAIL: 'novelnexusai@outlook.com' },
})
git('git add -A')
// .gitignore only lists "node_modules/" (directory form), so a symlink slips through git add -A
git('git rm --cached -r --ignore-unmatch node_modules || true')
git('git status --short | grep -q node_modules && git rm --cached -r node_modules || true')
git(`git commit -q -m "feat: capability hardening and release ${nextVersion}"`)
git(`git -c http.proxy= -c commit.gpgsign=false -c credential.helper='!f() { echo username=x-access-token; echo password=$GH_TOKEN; }; f' push origin HEAD:refs/heads/main`)
git(`git tag -a v${nextVersion} -m "${pkg.name} ${nextVersion}"`)
git(`git -c http.proxy= -c credential.helper='!f() { echo username=x-access-token; echo password=$GH_TOKEN; }; f' push origin refs/tags/v${nextVersion}`)
console.log(`[${pkg.name}] pushed main + tag v${nextVersion}`)
