import Router from '@koa/router'
import boardRouter from './board'
import taskRouter from './task'
import taskColumnRouter from './taskColumn'
import userRouter from './user'
import combineRouters from '../../helpers/combineRouters'
import authentication from '../../middlewares/authentication'

const secureRouter = new Router({ prefix: '/secure' })

const routers = [boardRouter, taskRouter, taskColumnRouter, userRouter]

const combinedRouters = combineRouters(routers)

secureRouter.use(authentication)

secureRouter.use(...combinedRouters)

export default secureRouter
