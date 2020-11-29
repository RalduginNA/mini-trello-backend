import Router from '@koa/router'
import boardRouter from './board'
import cardRouter from './card'
import listRouter from './list'
import userRouter from './user'
import combineRouters from '../../helpers/combineRouters'
import authentication from '../../middlewares/authentication'

const secureRouter = new Router({ prefix: '/secure' })

const routers = [boardRouter, cardRouter, listRouter, userRouter]

const combinedRouters = combineRouters(routers)

secureRouter.use(authentication)

secureRouter.use(...combinedRouters)

export default secureRouter
