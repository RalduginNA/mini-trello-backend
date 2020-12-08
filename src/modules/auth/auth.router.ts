import Router from '@koa/router'
import AuthController from '../auth/auth.controller'

const authRouter = new Router({ prefix: `/auth` })

authRouter.post('/signIn', AuthController.signIn)
authRouter.post('/signUp', AuthController.signUp)
authRouter.post('/refresh', AuthController.refresh)

export default authRouter
