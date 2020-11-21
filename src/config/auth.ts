import { Algorithm } from 'jsonwebtoken'
const {
  JWT_SECRET = 'mini-trello-jwt-secret-1',
  JWT_TOKEN_EXPIRES_IN = '30 s',
  JWT_REFRESH_SECRET = 'refresh-mini-trello-jwt-secret',
  JWT_REFRESH_TOKEN_EXPIRES_IN = '7 days',
} = process.env

const JWT_ALGORITHM = (process.env.JWT_ALGORITHM as Algorithm) || 'HS256'

export default {
  jwt: {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_TOKEN_EXPIRES_IN,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_ALGORITHM,
  },
}
