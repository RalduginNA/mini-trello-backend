const {
  JWT_SECRET = 'mini-trello-jwt-secret-1',
  JWT_ACCESS_TOKEN_EXPIRES_IN = '24 hours',
  JWT_REFRESH_SECRET = 'refresh-mini-trello-jwt-secret',
  JWT_REFRESH_TOKEN_EXPIRES_IN = '7 days',
  JWT_ALGORITHM = 'HS256',
} = process.env

export default {
  jwt: {
    JWT_SECRET,
    JWT_ACCESS_TOKEN_EXPIRES_IN,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_TOKEN_EXPIRES_IN,
    JWT_ALGORITHM,
  },
}
