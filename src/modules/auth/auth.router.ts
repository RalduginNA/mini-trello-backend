import Router from '@koa/router'
import AuthSchema from './auth.schema'
import AuthController from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'

const authRouter = new Router({ prefix: `/auth` })

authRouter.post(
  '/sign-in',
  validateRequest(AuthSchema.signIn),
  AuthController.signIn,
)
authRouter.post(
  '/sign-up',
  validateRequest(AuthSchema.signUp),
  AuthController.signUp,
)
authRouter.post(
  '/refresh',
  validateRequest(AuthSchema.refresh),
  AuthController.refresh,
)

export default authRouter
