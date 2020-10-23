import Router from '@koa/router'
import boardRouter from './board'
import taskRouter from './task'
import taskColumnRouter from './taskColumn'
import userRouter from './user'

const secureRouter = new Router({ prefix: '/secure' })

const routers = [boardRouter, taskRouter, taskColumnRouter, userRouter]

const combinedRouter = routers.flatMap((router) => [
  router.routes(),
  router.allowedMethods(),
])

// Need add isAuthenticated func
secureRouter.use(async (ctx, next) => {
  console.log('secure router')
  if (!ctx.header.authorization) {
    ctx.throw(401)
  }
  await next()
})

secureRouter.use(...combinedRouter)

export default secureRouter
