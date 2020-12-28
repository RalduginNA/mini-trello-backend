import Router from '@koa/router'
import UserController from './user.controller'

const router = new Router({ prefix: `/users` })

router.get('/me', UserController.getMe)
