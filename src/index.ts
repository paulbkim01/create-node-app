#!/usr/bin/env node
import path from 'node:path'
import { Spinner } from 'ora'
import chalk from 'chalk'

import { runCli } from './cli.js'
import { logger } from './utils/index.js'

try {
  await main()
} catch (e) {
  throw e
}

async function main() {
  const { appName, project, addons, installPackage } = await runCli()

  logger.info(
    chalk.bgBlue(chalk.whiteBright('Hello world')),
    JSON.stringify({
      appName,
      project,
      addons,
      installPackage,
    })
  )
}
