import jwt from 'jsonwebtoken'
import config from '../config'
import HttpError from '../models/HttpError'
import RESPONSE_CODE from '../constants/api'

const getToken = async ({ _id, name, email }) => {
  const {
    JWT_ALGORITHM,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_SECRET,
  } = config.auth.jwt
  const token = await jwt.sign({ _id, name, email }, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN,
  })
  return token
}

const verifyToken = async (token) => {
  const { JWT_SECRET, JWT_ALGORITHM } = config.auth.jwt
  const decoded = await jwt.verify(token, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
  })
  return decoded
}

const verifyAuthentication = async (authorizationHeader) => {
  const UnAuthorizedCode = RESPONSE_CODE.REJECT.UNAUTHORIZED.code
  if (!authorizationHeader) {
    throw new HttpError(UnAuthorizedCode, 'Invalid authorization')
  }
  const parts = authorizationHeader.split(' ')
  const scheme = parts[0]
  const credentials = parts[1]

  if (!/^Bearer$/i.test(scheme)) {
    throw new HttpError(UnAuthorizedCode, 'Invalid authorization scheme')
  }
  return await verifyToken(credentials)
}

export default { getToken, verifyToken, verifyAuthentication }
