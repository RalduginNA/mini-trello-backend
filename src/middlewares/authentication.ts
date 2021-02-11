import { Middleware } from 'koa'
import jwt from '../utils/jwt'
import { STATUS_CODES } from '../constants/api'

const authentication: Middleware = async (ctx, next) => {
  try {
    ctx.state.user = await jwt.verifyAuthentication(ctx.header.authorization)
  } catch (err) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, err)
  }
  await next()
}

export default authentication
