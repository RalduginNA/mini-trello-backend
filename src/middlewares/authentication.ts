import { Middleware } from 'koa'
import jwt from '../helpers/jwt'
import { STATUS_CODES } from '../constants/api'

const authentication: Middleware = async (ctx, next) => {
  try {
    const { _id, username, email } = await jwt.verifyAuthentication(
      ctx.header.authorization,
    )
    ctx.state.user = { _id, username, email }
  } catch (err) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, err)
  }
  await next()
}

export default authentication
