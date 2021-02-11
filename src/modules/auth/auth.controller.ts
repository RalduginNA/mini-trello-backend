import { RefreshDto, SignInDto, SignUpDto } from './auth.interfaces'
import RefreshSessionModel from '../refreshSession/refreshSession.model'
import UserModel from '../user/user.model'
import { STATUS_CODES } from '../../constants/api'
import hash from '../../utils/hash'
import jwt from '../../utils/jwt'
import { Ctx } from '../../types'
import { ErrorCodes } from '../../constants/error'

const signIn = async (ctx: Ctx<SignInDto>) => {
  const { email, password } = ctx.request.body
  const user = await UserModel.findOne({ email: email })

  ctx.assert(
    user,
    STATUS_CODES.UNAUTHORIZED,
    'User does not have an account yet',
  )

  const { _id, username, passwordHash, createdAt, updatedAt } = user
  const isValidPassword = await hash.verify(passwordHash, password)

  ctx.assert(isValidPassword, STATUS_CODES.UNAUTHORIZED, 'Incorrect password')

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
    user: {
      id: _id,
      username,
      email: user.email,
      createdAt,
      updatedAt,
    },
    accessToken,
    refreshToken: savedRefreshSession.refreshToken,
  }
}

const signUp = async (ctx: Ctx<SignUpDto>) => {
  const { username, email, password } = ctx.request.body
  const user = new UserModel({ username, email })
  await user.setPassword(password)
  const savedUser = await user.save()

  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAccessToken(savedUser.getTokenPayload()),
    jwt.signRefreshToken(savedUser.getTokenPayload()),
  ])

  const refreshSession = new RefreshSessionModel({
    userId: savedUser._id,
    refreshToken: refreshToken,
  })
  const savedRefreshSession = await refreshSession.save()

  ctx.body = {
    user: {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    },
    accessToken,
    refreshToken: savedRefreshSession.refreshToken,
  }
}

const refresh = async (ctx: Ctx<RefreshDto>) => {
  const oldRefreshSession = await RefreshSessionModel.findOne({
    refreshToken: ctx.request.body.refreshToken,
  })

  ctx.assert(
    oldRefreshSession,
    STATUS_CODES.UNAUTHORIZED,
    ErrorCodes.Invalid.RefreshToken,
  )

  const [user] = await Promise.all([
    await UserModel.findById(oldRefreshSession.userId),
    await RefreshSessionModel.deleteOne({ _id: oldRefreshSession._id }),
    await jwt.verifyToken(oldRefreshSession.refreshToken, true),
  ])

  const [accessToken, refreshToken] = await Promise.all([
    jwt.signAccessToken(user.getTokenPayload()),
    jwt.signRefreshToken(user.getTokenPayload()),
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
}

export default {
  signIn,
  signUp,
  refresh,
}
