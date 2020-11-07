import Router from '@koa/router'
import jwt from '../../helpers/jwt'
import User from '../../models/User'
import hash from '../../helpers/hash'

const router = new Router({ prefix: '/signIn' })

router.post('/', async (ctx) => {
  const { email, password } = ctx.request.body
  const user = await User.findOne({ email: email })
  // validation
  if (!user) {
    ctx.throw(401, 'User does not have an account yet')
  }
  const isValidPassword = await hash.verify(user.passwordHash, password)
  if (!isValidPassword) {
    ctx.throw(401, 'Incorrect password or email')
  }
  const accessToken = await jwt.getToken(user)
  ctx.body = {
    _id: user._id,
    username: user.username,
    email: user.email,
    accessToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
})

export default router
