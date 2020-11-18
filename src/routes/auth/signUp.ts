import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import UserModel from '../../models/User'
import { Ctx } from '../../types'

const router = new Router({ prefix: '/signUp' })

interface SignUpRequest {
  username: string
  email: string
  password: string
}

router.post('/', async (ctx: Ctx<SignUpRequest>) => {
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
