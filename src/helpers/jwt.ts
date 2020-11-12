import jwt from 'jsonwebtoken'
import config from '../config'
import HttpError from '../models/HttpError'
import { STATUS_CODES } from '../constants/api'

interface TokenPayload {
  _id: any
  username: string
  email: string
}

const getToken = async ({ _id, username, email }: TokenPayload) => {
  const {
    JWT_SECRET,
    JWT_SIGN_OPTIONS: { algorithm, expiresIn },
  } = config.auth.jwt
  const token = await jwt.sign({ _id, username, email }, JWT_SECRET, {
    algorithm: algorithm,
    expiresIn,
  })
  return token
}

const verifyToken = async (token: string) => {
  const {
    JWT_SECRET,
    JWT_SIGN_OPTIONS: { algorithm },
  } = config.auth.jwt

  const decoded = (await jwt.verify(token, JWT_SECRET, {
    algorithms: [algorithm],
  })) as TokenPayload

  if (!decoded || typeof decoded !== 'object') {
    throw new HttpError(STATUS_CODES.UNAUTHORIZED, 'Invalid token payload')
  }

  const { _id, username, email } = decoded

  if (!_id || !username || !email) {
    throw new HttpError(STATUS_CODES.UNAUTHORIZED, 'Invalid token payload')
  }

  return decoded
}

const verifyAuthentication = async (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    throw new HttpError(STATUS_CODES.UNAUTHORIZED, 'Invalid authorization')
  }
  const parts = authorizationHeader.split(' ')
  const scheme = parts[0]
  const credentials = parts[1]

  if (!/^Bearer$/i.test(scheme)) {
    throw new HttpError(
      STATUS_CODES.UNAUTHORIZED,
      'Invalid authorization scheme',
    )
  }
  return await verifyToken(credentials)
}

export default { getToken, verifyToken, verifyAuthentication }
