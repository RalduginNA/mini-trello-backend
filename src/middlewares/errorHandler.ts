import { Middleware } from 'koa'
import { STATUS_CODES } from '../constants/api'

const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.debug(err)
    console.debug(err.statusCode)
    console.debug(err.code)
    ctx.status = err.status || STATUS_CODES.INTERNAL_SERVER_ERROR
    ctx.body = {
      statusCode: ctx.status,
      message: err.message,
    }
    ctx.app.emit('error', err, ctx)
  }
}

export default errorHandler
