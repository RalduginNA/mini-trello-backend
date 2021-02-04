import { Request, ParameterizedContext } from 'koa'
import { RouterParamContext } from '@koa/router'
import { Types } from 'mongoose'
import { TokenPayload } from './helpers/jwt'

export interface Timestamp {
  createdAt: Date
  updatedAt: Date
}

export interface CtxState {
  user: TokenPayload
}

export type Environment = 'development' | 'debug' | 'production'

interface CtxRequest<T> extends Request {
  body?: T
}

export interface Ctx<BodyT = {}, StateT = CtxState>
  extends ParameterizedContext<StateT, RouterParamContext<StateT, {}>> {
  request: CtxRequest<BodyT>
  //? body
}

export interface ParamsId {
  id: Types.ObjectId
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtendsKeys<T> = Record<keyof T, any>
