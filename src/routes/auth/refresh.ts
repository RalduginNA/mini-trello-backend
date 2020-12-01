import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import UserModel from '../../models/User'
import RefreshSessionModel from '../../models/RefreshSession'
import { Ctx } from '../../types'
import { STATUS_CODES } from '../../constants/api'

const router = new Router({ prefix: '/refresh' })

interface RefreshDto {
  refreshToken: string
}

router.post('/', async (ctx: Ctx<RefreshDto>) => {
  const oldRefreshSession = await RefreshSessionModel.findOne({
    refreshToken: ctx.request.body.refreshToken,
  })

  if (!oldRefreshSession) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, 'Invalid refresh token')
  }

  const [user] = await Promise.all([
    await UserModel.findById(oldRefreshSession.userId),
    await RefreshSessionModel.deleteOne({ _id: oldRefreshSession._id }),
    await jwt.verifyToken(oldRefreshSession.refreshToken, true),
  ])

  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAccessToken(user.toObject()),
    jwt.signRefreshToken(user),
  ])

  const refreshSession = new RefreshSessionModel({
    userId: user._id,
    refreshToken,
  })

  const savedRefreshSession = await refreshSession.save()

  ctx.body = {
    accessToken,
    refreshToken: savedRefreshSession.refreshToken,
  }
})

export default router
