import { TokenPayload } from './helpers/jwt'

export interface Timestamp {
  createdAt: Date
  updatedAt: Date
}

export interface CtxState {
  user: TokenPayload
}

export type Environment = 'development' | 'production'
