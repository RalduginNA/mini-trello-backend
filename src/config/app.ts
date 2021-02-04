import { Environment } from '../types'

const { PORT = '8080' } = process.env
const NODE_ENV: Environment =
  (process.env.NODE_ENV as Environment) || 'development'

export default { PORT, NODE_ENV }
