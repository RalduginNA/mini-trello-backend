import Router from '@koa/router'

import jwt from '../../helpers/jwt'
import UserModel from '../../models/User'

const router = new Router({ prefix: '/signUp' })

router.post('/', async (ctx) => {
  const { username, email, password } = ctx.request.body
  const user = new UserModel({ username, email })
  await user.setPassword(password)
  const savedUser = await user.save()
  const accessToken = await jwt.getToken(savedUser)
  ctx.body = {
    _id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    accessToken,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  }
})

export default router
