import fs from 'node:fs'
import inquirer from 'inquirer'
import { getUserPkgManager, logger, validateAppName } from './utils/index.js'
import type { CliResults } from './cli.js'
import { ROOT } from './constants.js'

export { promptAppName, promptProjectType, promptAddons, promptPackageInstall }

async function promptAppName(defaultAppName: string) {
  const { appName } = await inquirer.prompt<{ appName: CliResults['appName'] }>(
    {
      name: 'appName',
      type: 'input',
      message: 'Provide name for the project',
      default: defaultAppName,
      validate: validateAppName,
      transformer: (input: string) => {
        return input.trim()
      },
    },
  )
  return appName
}

async function promptProjectType() {
  const { project } = await inquirer.prompt<{ project: CliResults['project'] }>(
    {
      name: 'project',
      type: 'list',
      message: 'What project template would you like to generate?',
      choices: fs.readdirSync(`${ROOT}/template`),
    },
  )

  return project
}

interface AddonMap {
  cli: CliAddons
  'web-client': WebClientAddons
  'web-fullstack': WebServerAddons
  'web-server': WebFullstackAddons
  websocket: WebsocketAddons
}

async function promptAddons<T extends CliResults['project']>(
  project: T,
): Promise<Addons<AddonMap[T]>[]> {
  console.log(project)
  const subRoutines: Record<CliResults['project'], any> = {
    cli: promptCliAddons,
    'web-client': promptWebClientAddons,
    'web-fullstack': promptWebFullstackAddons,
    'web-server': promptWebServerAddons,
    websocket: promptWebsocketAddons,
  }

  const generalAddons = await promptGeneralAddons()
  const projectSpecificAddons = await subRoutines[project]()

  return [...generalAddons, ...projectSpecificAddons]
}

export type Addons<T> = GeneralAddons | T

type GeneralAddons = 'husky' | 'gha-ci' | 'gh-templates'
async function promptGeneralAddons(): Promise<GeneralAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: GeneralAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'General addons to add',
    choices: [
      {
        name: 'Husky(Githook) & Lint-Staged',
        value: 'husky',
        short: 'Husky',
      },
      {
        name: 'Github Action Workflow CI setup',
        value: 'github',
        short: 'Github Action CI',
      },
      {
        name: 'Github PR/Issue Templates',
        value: 'gh-templates',
        short: 'Github Templates',
      },
    ],
  })
  return addons
}

type CliAddons = 'inquirer' | 'ui-helpers'
async function promptCliAddons(): Promise<CliAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: CliAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'Cli addons to add',
    choices: [
      {
        name: 'Tool for building Prompts (inquirer.js)',
        value: 'inquirer',
        short: 'Husky',
      },
      {
        name: 'Set of tools to help build CLI UI (chalk, ora)',
        value: 'ui-helpers',
        short: 'UI Tool Kit',
      },
    ],
  })
  return addons
}

type WebClientAddons = 'redux'
async function promptWebClientAddons(): Promise<WebClientAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: WebClientAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'WebClient addons to add',
    choices: [
      {
        name: 'State Management Library (Redux)',
        value: 'redux',
        short: 'Redux',
      },
    ],
  })
  return addons
}

type WebServerAddons = 'telemtry' | 'graphql'
async function promptWebServerAddons(): Promise<WebServerAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: WebServerAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'WebServer addons to add',
    choices: [
      {
        name: 'Husky(Githook) & Lint-Staged',
        value: 'telemtry',
        short: 'Husky',
      },
      {
        name: 'Github Action Workflow CI setup',
        value: 'graphql',
        short: 'Github Action CI',
      },
    ],
  })
  return addons
}

type WebFullstackAddons = 'trpc' | 'mui'
async function promptWebFullstackAddons(): Promise<WebFullstackAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: WebFullstackAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'WebFullstack addons to add',
    choices: [
      {
        name: 'TRPC',
        value: 'trpc',
        short: 'TRPC',
      },
      {
        name: 'Default UI Library',
        value: 'mui',
        short: 'MUI',
      },
    ],
  })
  return addons
}

type WebsocketAddons = 'socket-io'
async function promptWebsocketAddons(): Promise<WebsocketAddons[]> {
  const { addons } = await inquirer.prompt<{ addons: WebsocketAddons[] }>({
    name: 'addons',
    type: 'checkbox',
    message: 'Websocket addons to add',
    choices: [
      {
        name: 'Socket.io',
        value: 'socket-io',
        short: 'Socket.io',
      },
    ],
  })
  return addons
}

async function promptPackageInstall(): Promise<boolean> {
  const pkgManager = getUserPkgManager()
  const { install } = await inquirer.prompt<{
    install: CliResults['installPackage']
  }>({
    name: 'install',
    type: 'confirm',
    message: `Would you like to run '${pkgManager} install'?`,
    default: true,
  })

  if (!install) {
    logger.info(
      `You can run '${pkgManager} install' later to install the dependencies.`,
    )
  }
  logger.success("Alright. We'll install the dependencies for you!")

  return install
}
