import Router from '@koa/router'
import combineRouters from './helpers/combineRouters'
import authentication from './middlewares/authentication'
import authRouter from './modules/auth/auth.router'
import boardRouter from './modules/board/board.router'
import cardRouter from './modules/card/card.router'
import listRouter from './modules/list/list.router'
import userRouter from './modules/user/user.router'

const configureRoutes = () => {
  const rootRouter = new Router({ prefix: '/api' })

  const secureRoutes = [boardRouter, cardRouter, listRouter, userRouter]
  const combinedSecureRouters = combineRouters(secureRoutes)

  rootRouter.use('/secure', authentication, ...combinedSecureRouters)
  rootRouter.use(authRouter.routes(), authRouter.allowedMethods())

  return rootRouter
}

export default configureRoutes
