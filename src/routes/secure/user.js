const Router = require('@koa/router')
const UserModel = require('../../models/User')

const router = new Router({ prefix: '/users' })

router.post('/', async (ctx) => {
  const { username, email, password } = ctx.request.body
  const user = new UserModel({ username, email })
  await user.setPassword(password)
  const savedUser = await user.save()
  ctx.body = {
    _id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    createdAt: savedUser.createdAt,
    updatedAt: savedUser.updatedAt,
  }
})

module.exports = router
