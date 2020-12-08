import Router from '@koa/router'
import authRouter from './modules/auth/auth.router'
import boardRouter from './modules/board/board.router'
import listRouter from './modules/list/list.router'
import cardRouter from './modules/card/card.router'
import authentication from './middlewares/authentication'
import combineRouters from './helpers/combineRouters'

const configureRoutes = () => {
  const rootRouter = new Router({ prefix: '/api' })

  const secureRoutes = [boardRouter, cardRouter, listRouter]
  const combinedSecureRouters = combineRouters(secureRoutes)

  rootRouter.use('/secure', authentication, ...combinedSecureRouters)
  rootRouter.use(authRouter.routes(), authRouter.allowedMethods())

  return rootRouter
}

export default configureRoutes
