import Router from '@koa/router'
import secureRouter from './secure'
import authRouter from './auth'
import combineRouters from '../helpers/combineRouters'

const rootRouter = new Router({ prefix: '/api' })

const routes = [authRouter, secureRouter]

const combinedRouters = combineRouters(routes)

rootRouter.use(...combinedRouters)

export default rootRouter
