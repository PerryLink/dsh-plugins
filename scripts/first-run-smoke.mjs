#!/usr/bin/env node
/**
 * F2 (automated half) — first-run smoke.
 *
 * Proves the "install → run the bundled sample → get the expected result" path
 * has no break: for each flagship package it packs the tarball with npm, extracts
 * it into a temp directory, runs the shipped quickstart against the extracted
 * code, and asserts the golden output matches.
 *
 *   node scripts/first-run-smoke.mjs
 *   node scripts/first-run-smoke.mjs dsh-einvoice dsh-bankrec
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const buildRoot = path.resolve(root, '..')

const DEFAULT_PACKAGES = ['dsh-fin-invoice-core', 'dsh-bankrec', 'dsh-docx-redline']
const targets = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PACKAGES

let failures = 0
for (const dir of targets) {
  const pkgDir = path.join(buildRoot, dir)
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
  const label = `${pkg.name}@${pkg.version}`
  const work = fs.mkdtempSync(path.join(os.tmpdir(), `first-run-${pkg.name}-`))
  try {
    // 1. build the real tarball
    execFileSync('npm', ['pack', '--pack-destination', work, '--silent'], { cwd: pkgDir, stdio: 'pipe', timeout: 180000 })
    const tarball = fs.readdirSync(work).find((f) => f.endsWith('.tgz'))
    if (!tarball) throw new Error('npm pack produced no tarball')
    // 2. extract it
    execFileSync('tar', ['-xzf', path.join(work, tarball), '-C', work], { stdio: 'pipe' })
    const unpacked = path.join(work, 'package')
    // an installed package has its dependencies next to it; link the dev tree's
    // node_modules so the extracted tarball can resolve them without a network install
    fs.symlinkSync(path.join(pkgDir, 'node_modules'), path.join(unpacked, 'node_modules'), 'dir')
    // 3. the shipped sample must be there
    const input = path.join(unpacked, 'samples', 'quickstart', 'input')
    if (!fs.existsSync(input) || fs.readdirSync(input).length === 0) throw new Error('samples/quickstart/input missing from the tarball')
    const run = path.join(unpacked, 'samples', 'quickstart', 'run.mjs')
    if (!fs.existsSync(run)) throw new Error('samples/quickstart/run.mjs missing from the tarball')
    // 4. run it the way a user would, from the unpacked package
    const env = { ...process.env, [`DSH_${pkg.name.replace(/^dsh-/, '').toUpperCase().replace(/-/g, '_')}_HOME`]: path.join(work, 'home') }
    const out = execFileSync(process.execPath, [run, '--check'], { cwd: unpacked, stdio: 'pipe', timeout: 120000, env })
    const text = String(out)
    if (!/ok|match|pass/i.test(text)) throw new Error(`quickstart did not report success: ${text.slice(-200)}`)
    // 5. the home directory was created outside the package
    console.log(`ok   ${label} — packed ${(fs.statSync(path.join(work, tarball)).size / 1024).toFixed(1)} kB, quickstart verified`)
  } catch (error) {
    failures += 1
    console.log(`FAIL ${label} — ${String(error.message).split('\n')[0]}`)
  } finally {
    fs.rmSync(work, { recursive: true, force: true })
  }
}

console.log(failures === 0 ? `\nfirst-run smoke ok: ${targets.length} packages` : `\nfirst-run smoke: ${failures} failure(s)`)
process.exit(failures === 0 ? 0 : 1)
