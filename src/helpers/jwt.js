import jwt from 'jsonwebtoken'

const getToken = async ({ _id: id, name, email }) => {
  const { PRIVATE_KEY } = process.env
  const token = await jwt.sign({ id, name, email }, PRIVATE_KEY, {
    algorithm: 'HS256',
  })
  return token
}

const verifyToken = async (token) => {
  const { PRIVATE_KEY } = process.env
  const decoded = await jwt.verify(token, PRIVATE_KEY, { algorithm: 'HS256' })
  return decoded
}

const isAuthenticated = async (authorizationHeader) => {
  try {
    if (!authorizationHeader) {
      throw new Error('Invalid authorization')
    }
    const parts = authorizationHeader.split(' ')
    const scheme = parts[0]
    const credentials = parts[1]

    if (!/^Bearer$/i.test(scheme)) {
      throw new Error('Invalid schema')
    }
    await verifyToken(credentials)
  } catch (e) {
    throw new Error(e.message)
  }
}

export default { getToken, verifyToken, isAuthenticated }
