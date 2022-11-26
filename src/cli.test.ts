import { expect, test } from 'vitest'
import fs from 'node:fs'

import { BASE_PROJECT_TEMPLATES } from './constants.js'
// import { runCli } from './cli.js'
// import { execa } from 'execa'

test('Items in template base dir should match the source of truth', () => {
  const expected = BASE_PROJECT_TEMPLATES
  const actual = fs.readdirSync(`${process.cwd()}/template/base`)

  expect(expected).toMatchObject(actual)
})

test('Running cli should return appropriate values that match CliResults', async () => {
  //   function initCli(argv = '') {
  //     return new Promise((resolve, reject) => {
  //       const subprocess = execa(`node ./cli.js ${argv}`)
  //       subprocess.stdout?.pipe(process.stdout)
  //       subprocess.stderr?.pipe(process.stderr)
  //       Promise.resolve(subprocess).then(resolve)
  //       subprocess.on('error', (e) => {
  //         reject(e)
  //       })
  //     })
  //   }
  //   await initCli()
  //   console.log(initCli)
})

test('Running cli shall projecss argument as its default name', () => {})

test('Running cli on invalid terminal should log error', () => {})
