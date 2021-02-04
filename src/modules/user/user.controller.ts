import { STATUS_CODES } from '../../constants/api'
import { Ctx } from '../../types'
import userModel from './user.model'

const getMe = async (ctx: Ctx) => {
  const { _id } = ctx.state.user
  const user = await userModel.findById(_id)

  ctx.assert(user, STATUS_CODES.BAD_REQUEST, "User doesn't exist")

  ctx.body = user
}

export default {
  getMe,
}
