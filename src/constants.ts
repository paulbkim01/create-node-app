import path from 'path'
import { fileURLToPath } from 'url'
import packageJson from '../package.json' assert { type: 'json' }
// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url)
const distPath = path.dirname(__filename)
export const ROOT = path.join(distPath, '../')
export const VERSION = packageJson.version
export const BASE_PROJECT_TEMPLATES = [
  'cli',
  'web-client',
  'web-fullstack',
  'web-server',
  'websocket',
].sort()
