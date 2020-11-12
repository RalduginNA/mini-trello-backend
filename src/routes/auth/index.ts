import Router from '@koa/router'
import signInRouter from './signIn'
import signUpRouter from './signUp'
import combineRouters from '../../helpers/combineRouters'

const secureRouter = new Router({ prefix: '/auth' })

const routers = [signInRouter, signUpRouter]

const combinedRouters = combineRouters(routers)

secureRouter.use(...combinedRouters)

export default secureRouter
