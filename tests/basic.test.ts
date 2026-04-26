import * as assert from 'assert'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Basic structural tests for Phase 1 — Fundamentos.
 * These tests verify that the module structure is correctly set up
 * before any implementation is added in subsequent phases.
 */
suite('Phase 1 — Fundamentos: Structure Tests', () => {
  const srcRoot = path.resolve(__dirname, '../../src')

  test('src/main.ts exports activate function', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const main = require(path.join(srcRoot, 'main'))
    assert.strictEqual(typeof main.activate, 'function', 'main.ts must export activate()')
    assert.strictEqual(typeof main.deactivate, 'function', 'main.ts must export deactivate()')
  })

  test('src/parser module is reachable', () => {
    const parserPath = path.join(srcRoot, 'parser', 'index.ts')
    assert.ok(
      fs.existsSync(parserPath),
      `parser module not found at ${parserPath}`
    )
  })

  test('src/renderer module is reachable', () => {
    const rendererPath = path.join(srcRoot, 'renderer', 'index.ts')
    assert.ok(
      fs.existsSync(rendererPath),
      `renderer module not found at ${rendererPath}`
    )
  })

  test('src/vscode module is reachable', () => {
    const vscodePath = path.join(srcRoot, 'vscode', 'index.ts')
    assert.ok(
      fs.existsSync(vscodePath),
      `vscode module not found at ${vscodePath}`
    )
  })

  test('opensui.helloWorld command is declared in package.json', () => {
    const pkgPath = path.resolve(__dirname, '../../package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as {
      contributes?: { commands?: Array<{ command: string }> }
    }
    const commands = pkg.contributes?.commands ?? []
    const found = commands.some((c) => c.command === 'opensui.helloWorld')
    assert.ok(found, 'opensui.helloWorld must be declared in package.json contributes.commands')
  })
})
