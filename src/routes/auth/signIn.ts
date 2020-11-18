import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import User from '../../models/User'
import hash from '../../helpers/hash'
import { STATUS_CODES } from '../../constants/api'
import { Ctx } from '../../types'

const router = new Router({ prefix: '/signIn' })

interface SignInRequest {
  email: string
  password: string
}

router.post('/', async (ctx: Ctx<SignInRequest>) => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email: email })
  // validation
  if (!user) {
    ctx.throw(401, 'User does not have an account yet')
  }
  const { _id, username, passwordHash, createdAt, updatedAt } = user

  const isValidPassword = await hash.verify(passwordHash, password)
  if (!isValidPassword) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, 'Incorrect password or email')
  }
  const accessToken = await jwt.getToken(user)
  ctx.body = {
    _id,
    username,
    email: user.email,
    accessToken,
    createdAt,
    updatedAt,
  }
})

export default router
