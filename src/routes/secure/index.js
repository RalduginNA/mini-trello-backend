const Router = require('@koa/router')
const boardRouter = require('./board')
const taskRouter = require('./task')
const taskColumnRouter = require('./taskColumn')
const userRouter = require('./user')

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

module.exports = secureRouter
