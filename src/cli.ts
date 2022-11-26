import { Command } from 'commander'

import {
  Addons,
  promptAddons,
  promptAppName,
  promptPackageInstall,
  promptProjectType,
} from './prompts.js'
import { logger } from './utils/index.js'
import { VERSION } from './constants.js'

export interface CliOptions {
  appName: string
}

export interface CliResults {
  appName: string
  project: 'cli' | 'web-client' | 'web-server' | 'web-fullstack' | 'websocket'
  addons: Addons<any>[]
  installPackage: boolean
}

const defaultOptions: CliResults = {
  appName: 'create-node-app',
  project: 'web-server',
  addons: [],
  installPackage: false,
}

export async function runCli(): Promise<CliResults> {
  const program = new Command()
    .name('CREATE-NODE-APP')
    .description('A CLI for')
    .argument(
      '[dir]',
      'The name of the application, as well as the name of the directory to create',
    )
    .version(VERSION, '-v, --version', 'Display the version of create-node-app')
    .parse(process.argv)

  const initialAppName = program.args[0] ?? defaultOptions.appName

  try {
    const appName = await promptAppName(initialAppName)
    const project = await promptProjectType()
    console.log(project)
    const addons = await promptAddons(project)
    const installPackage = await promptPackageInstall()

    return {
      appName,
      project,
      addons,
      installPackage,
    }
  } catch (err) {
    if (
      err instanceof Error &&
      (err as Error & { isTTYError: boolean }).isTTYError
    ) {
      logger.warn(`Interactive terminal required`)
      logger.info(`Bootstrapping a default app in ./${initialAppName}`)
      process.exit(0)
    } else {
      throw err
    }
  }
}
