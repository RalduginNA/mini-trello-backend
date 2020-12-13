import BoardModel from '../board/board.model'
import { CreateBoardDto, UpdatedBoardDto } from './board.interfaces'
import UserModel from '../user/user.model'
import { Ctx, ParamsId } from '../../types'
import { STATUS_CODES } from '../../constants/api'
import MembershipModel from '../membership/membership.model'
import { MEMBERSHIP_ROLES } from '../../constants/general'

const getAll = async (ctx: Ctx<{}>) => {
  const boards = await UserModel.findById(ctx.state.user._id).populate({
    path: 'boards',
  })
  ctx.body = boards
}

const get = async (ctx: Ctx<{}, ParamsId>) => {
  const boardId = ctx.params.id
  const board = await BoardModel.findById(boardId)
    .populate('lists')
    .populate('cards')
    .populate('memberships')

  if (!board) {
    ctx.throw(STATUS_CODES.BAD_REQUEST, 'Board not found')
  }
  ctx.body = board
}

const create = async (ctx: Ctx<CreateBoardDto>) => {
  const userId = ctx.state.user._id
  const { name } = ctx.request.body

  const board = new BoardModel({
    name,
    users: [userId],
    // TODO: remove default image
    settings: {
      backgroundImage:
        'https://wallpapertag.com/wallpaper/full/d/b/6/255909-vertical-minimalistic-wallpaper-3840x2160-images.jpg',
    },
  })

  const [savedBoard] = await Promise.all([
    board.save(),
    UserModel.updateOne({ _id: userId }, { $push: { boards: board._id } }),
    MembershipModel.create({
      boardId: board._id,
      userId: userId,
      role: MEMBERSHIP_ROLES.ADMIN,
    }),
  ])

  ctx.body = savedBoard
}

const update = async (ctx: Ctx<UpdatedBoardDto, ParamsId>) => {
  const board = await BoardModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.body = board
}

export default {
  getAll,
  get,
  create,
  update,
}
