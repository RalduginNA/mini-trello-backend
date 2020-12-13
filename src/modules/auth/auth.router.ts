import Router from '@koa/router'
import AuthScheme from './auth.scheme'
import AuthController from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'

const authRouter = new Router({ prefix: `/auth` })

authRouter.post(
  '/signIn',
  validateRequest(AuthScheme.signIn),
  AuthController.signIn,
)
authRouter.post(
  '/signUp',
  validateRequest(AuthScheme.signUp),
  AuthController.signUp,
)
authRouter.post(
  '/refresh',
  validateRequest(AuthScheme.refresh),
  AuthController.refresh,
)

export default authRouter
