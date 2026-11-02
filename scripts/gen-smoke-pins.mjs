#!/usr/bin/env node
/**
 * Generate the install-smoke pins from packages.json.
 *
 * The smoke workflow must install the versions this repository publishes, so the
 * list lives in packages.json ("packages" plus "suites") instead of the workflow.
 *
 * Usage:
 *   node scripts/gen-smoke-pins.mjs          # one name@version per line
 *   node scripts/gen-smoke-pins.mjs --json   # JSON array, for a GitHub Actions matrix
 */
import { readFileSync } from 'node:fs'

const manifest = JSON.parse(readFileSync(new URL('../packages.json', import.meta.url), 'utf8'))
const entries = [...(manifest.packages ?? []), ...(manifest.suites ?? [])]
const specs = []
const seen = new Set()

for (const entry of entries) {
  const name = entry?.name
  const version = entry?.version
  if (typeof name !== 'string' || name === '') {
    throw new Error(`packages.json entry has no name: ${JSON.stringify(entry)}`)
  }
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error(`packages.json entry has no valid version: ${name} ${JSON.stringify(version)}`)
  }
  if (seen.has(name)) throw new Error(`duplicate package name in packages.json: ${name}`)
  seen.add(name)
  specs.push(`${name}@${version}`)
}

if (specs.length === 0) throw new Error('no packages found in packages.json')

specs.sort()
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(specs))
} else {
  console.log(specs.join('\n'))
}
