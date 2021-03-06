import chalk from 'chalk'

export const error = chalk.bold.red
export const warning = chalk.keyword('orange')
export const info = chalk.green
export const debug = chalk.blue

export default {
  error,
  warning,
  info,
  debug,
}
