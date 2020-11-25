import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import UserModel from '../../models/User'
import RefreshSessionModel from '../../models/RefreshSession'
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
  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAccessToken(savedUser.toObject()),
    jwt.signRefreshToken(savedUser.toObject()),
  ])

  const refreshSession = new RefreshSessionModel({
    userId: savedUser.id,
    refreshToken: refreshToken,
  })
  const savedRefreshSession = await refreshSession.save()

  ctx.body = {
    id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    accessToken,
    refreshToken: savedRefreshSession.refreshToken,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  }
})

export default router
