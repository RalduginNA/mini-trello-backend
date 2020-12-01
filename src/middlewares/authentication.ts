import { Middleware } from 'koa'
import jwt from '../helpers/jwt'
import { STATUS_CODES } from '../constants/api'

const authentication: Middleware = async (ctx, next) => {
  // for testing fe
  //---------------------
  const {
    TEST_USER_ID,
    TEST_USER_NAME,
    TEST_USER_EMAIL,
    NODE_TEST_FE,
  } = process.env
  if (NODE_TEST_FE) {
    ctx.state.user = {
      _id: TEST_USER_ID,
      username: TEST_USER_NAME,
      email: TEST_USER_EMAIL,
    }
    await next()
    return
  }
  ////---------------------
  try {
    ctx.state.user = await jwt.verifyAuthentication(ctx.header.authorization)
  } catch (err) {
    ctx.throw(STATUS_CODES.UNAUTHORIZED, err)
  }
  await next()
}

export default authentication
