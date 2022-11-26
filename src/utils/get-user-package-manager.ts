export type PackageManager = 'npm' | 'pnpm'

export function getUserPkgManager() {
  const packageManager = process.env['npm_config_user_agent']
  if (packageManager && packageManager.startsWith('pnpm')) {
    return 'pnpm'
  }
  return 'npm'
}
