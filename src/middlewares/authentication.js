import jwt from '../helpers/jwt'
import RESPONSE_CODE from '../constants/api'

const authentication = async (ctx, next) => {
  try {
    const { _id, username, email } = await jwt.verifyAuthentication(
      ctx.header.authorization,
    )
    ctx.state.user = { _id, username, email }
  } catch (err) {
    ctx.throw(RESPONSE_CODE.REJECT.UNAUTHORIZED.code, err)
  }
  await next()
}

export default authentication
