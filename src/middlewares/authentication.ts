import { Middleware } from 'koa'
import jwt from '../helpers/jwt'
import { STATUS_CODES } from '../constants/api'

// TODO: remove
// !for testing fe (temporary)
import UserModel from '../modules/user/user.model'

const authentication: Middleware = async (ctx, next) => {
  // !for testing fe
  //!---------------------
  const { TEST_USER_NAME, NODE_TEST_FE } = process.env
  if (NODE_TEST_FE) {
    const user = await UserModel.findOne({ username: TEST_USER_NAME })
    ctx.state.user = {
      _id: user._id,
      username: user.username,
    }
    await next()
    return
  }
  //!----------------------
  try {
    ctx.state.user = await jwt.verifyAuthentication(ctx.header.authorization)
  } catch (err) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, err)
  }
  await next()
}

export default authentication
