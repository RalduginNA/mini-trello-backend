import { Ctx } from '../../types'
import userModel from './user.model'

const getMe = async (ctx: Ctx<{}>) => {
  const { _id } = ctx.state.user
  const user = await userModel.findById(_id)
  ctx.body = user
}

export default {
  getMe,
}
