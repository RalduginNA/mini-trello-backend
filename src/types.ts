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

export interface Ctx<BodyT = {}, ParamsT = undefined, StateT = CtxState>
  extends ParameterizedContext<StateT, RouterParamContext<StateT, {}>> {
  request: CtxRequest<BodyT>
  params: ParamsT
}

export interface ParamsId {
  id: Types.ObjectId
}
