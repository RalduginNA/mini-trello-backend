import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import User from '../../models/User'
import hash from '../../helpers/hash'
import RESPONSE_CODE from '../../constants/api'

const router = new Router({ prefix: '/signIn' })

router.post('/', async (ctx) => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email: email })
  // validation
  if (!user) {
    ctx.throw(401, 'User does not have an account yet')
  }
  const { _id, username, passwordHash, createdAt, updatedAt } = user

  const isValidPassword = await hash.verify(passwordHash, password)
  if (!isValidPassword) {
    ctx.throw(
      RESPONSE_CODE.REJECT.UNAUTHORIZED.status,
      'Incorrect password or email',
    )
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
