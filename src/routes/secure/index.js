import Router from '@koa/router'
import boardRouter from './board'
import taskRouter from './task'
import taskColumnRouter from './taskColumn'
import userRouter from './user'
import jwt from '../../helpers/jwt'
import combineRouters from '../../helpers/combineRouters'
import RESPONSE_CODE from '../../constants/api'

const secureRouter = new Router({ prefix: '/secure' })

const routers = [boardRouter, taskRouter, taskColumnRouter, userRouter]

const combinedRouters = combineRouters(routers)

// Middleware Authentication
secureRouter.use(async (ctx, next) => {
  try {
    await jwt.isAuthenticated(ctx.header.authorization)
  } catch (err) {
    ctx.throw(RESPONSE_CODE.REJECT.UNAUTHORIZED.code, err)
  }
  await next()
})

secureRouter.use(...combinedRouters)

export default secureRouter
