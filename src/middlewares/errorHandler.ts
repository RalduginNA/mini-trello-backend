import { Middleware } from 'koa'
import { STATUS_CODES } from '../constants/api'

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR
    ctx.body = err.message
    ctx.app.emit('error', err, ctx)
  }
}

export default errorHandler
