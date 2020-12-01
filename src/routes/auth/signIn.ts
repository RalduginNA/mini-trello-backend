import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import User from '../../models/User'
import hash from '../../helpers/hash'
import { STATUS_CODES } from '../../constants/api'
import { Ctx } from '../../types'
import RefreshSessionModel from '../../models/RefreshSession'

const router = new Router({ prefix: '/signIn' })

interface SignInDto {
  email: string
  password: string
}

router.post('/', async (ctx: Ctx<SignInDto>) => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email: email })
  if (!user) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, 'User does not have an account yet')
  }

  const { _id, username, passwordHash, createdAt, updatedAt } = user

  const isValidPassword = await hash.verify(passwordHash, password)
  if (!isValidPassword) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, 'Incorrect password or email')
  }
  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAccessToken(user.getTokenPayload()),
    jwt.signRefreshToken(user.getTokenPayload()),
  ])

  const refreshSession = new RefreshSessionModel({
    userId: _id,
    refreshToken: refreshToken,
  })
  const savedRefreshSession = await refreshSession.save()

  ctx.body = {
    id: _id,
    username,
    email: user.email,
    accessToken,
    refreshToken: savedRefreshSession.refreshToken,
    createdAt,
    updatedAt,
  }
})

export default router
