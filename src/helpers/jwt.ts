import jwt from 'jsonwebtoken'
import config from '../config'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import { Types } from 'mongoose'
import { ErrorCodes } from '../constants/error'

export interface TokenPayload {
  _id: Types.ObjectId
  username: string
}

export interface SignTokenParams extends TokenPayload {
  opt: { secret: string; expiresIn?: string }
}

const signToken = async ({ _id, username, opt }: SignTokenParams) => {
  const { secret, expiresIn } = opt
  const { JWT_ALGORITHM } = config.auth.jwt
  const token = await jwt.sign({ _id, username }, secret, {
    algorithm: JWT_ALGORITHM,
    expiresIn,
  })
  return token
}

const signAccessToken = async (payload: TokenPayload) => {
  const { JWT_SECRET, JWT_TOKEN_EXPIRES_IN } = config.auth.jwt
  const accessToken = await signToken({
    ...payload,
    opt: {
      secret: JWT_SECRET,
      expiresIn: JWT_TOKEN_EXPIRES_IN,
    },
  })
  return accessToken
}

const signRefreshToken = async (payload: TokenPayload) => {
  const { JWT_REFRESH_SECRET, JWT_REFRESH_TOKEN_EXPIRES_IN } = config.auth.jwt
  const refreshToken = await signToken({
    ...payload,
    opt: {
      secret: JWT_REFRESH_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
  })
  return refreshToken
}

const verifyToken = async (token: string, refresh?: boolean) => {
  const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_ALGORITHM } = config.auth.jwt
  const secret = !refresh ? JWT_SECRET : JWT_REFRESH_SECRET
  let decoded

  try {
    decoded = (await jwt.verify(token, secret, {
      algorithms: [JWT_ALGORITHM],
    })) as TokenPayload
  } catch (err) {
    throw new HttpError(STATUS_CODES.UNAUTHORIZED, err?.message)
  }

  if (!decoded || typeof decoded !== 'object') {
    throw new HttpError(
      STATUS_CODES.UNAUTHORIZED,
      ErrorCodes.Invalid.TokenPayload,
    )
  }

  const { _id, username } = decoded

  if (!_id || !username) {
    throw new HttpError(
      STATUS_CODES.UNAUTHORIZED,
      ErrorCodes.Invalid.TokenPayload,
    )
  }

  return decoded
}

const verifyAuthentication = async (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    throw new HttpError(
      STATUS_CODES.UNAUTHORIZED,
      ErrorCodes.Invalid.Authorization,
    )
  }
  const parts = authorizationHeader.split(' ')
  const scheme = parts[0]
  const credentials = parts[1]

  if (!/^Bearer$/i.test(scheme)) {
    throw new HttpError(
      STATUS_CODES.UNAUTHORIZED,
      ErrorCodes.Invalid.AuthorizationScheme,
    )
  }
  return await verifyToken(credentials)
}

export default {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  verifyAuthentication,
}
