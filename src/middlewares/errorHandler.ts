import { Middleware } from 'koa'
import RESPONSE_CODE from '../constants/api'

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || RESPONSE_CODE.REJECT.INTERNAL_SERVER_ERROR.status
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
}

export default errorHandler
