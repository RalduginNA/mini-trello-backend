import { SignOptions, Algorithm, VerifyOptions } from 'jsonwebtoken'
const {
  JWT_SECRET = 'mini-trello-jwt-secret-1',
  JWT_REFRESH_SECRET = 'refresh-mini-trello-jwt-secret',
  JWT_REFRESH_TOKEN_EXPIRES_IN = '7 days',
} = process.env

const JWT_SIGN_OPTIONS: SignOptions = {
  expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '24 hours',
  algorithm: (process.env.JWT_ALGORITHM as Algorithm) || 'HS256',
}

export default {
  jwt: {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_SIGN_OPTIONS,
  },
}
