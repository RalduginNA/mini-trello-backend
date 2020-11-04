import jwt from '../helpers/jwt'
import UserModel from '../models/User'
import RESPONSE_CODE from '../constants/api'

const authentication = async (ctx, next) => {
  try {
    const { _id } = await jwt.verifyAuthentication(ctx.header.authorization)
    ctx.state.user = await UserModel.findById(_id)
  } catch (err) {
    ctx.throw(RESPONSE_CODE.REJECT.UNAUTHORIZED.code, err)
  }
  await next()
}

export default authentication
