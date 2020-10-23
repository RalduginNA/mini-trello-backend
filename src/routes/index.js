import Router from '@koa/router'
import secureRouter from './secure'

const rootRouter = new Router({ prefix: '/api' })

rootRouter.use(secureRouter.routes(), secureRouter.allowedMethods())

export default rootRouter
