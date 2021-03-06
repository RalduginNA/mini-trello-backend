import { STATUS_CODES } from '../../constants/api'
import { MEMBERSHIP_ROLES } from '../../constants/general'
import { verifyMembership } from '../../helpers/permissions'
import { Ctx } from '../../types'
import BoardModel from '../board/board.model'
import BoardViewModel from '../boardView/boardView.model'
import MembershipModel from '../membership/membership.model'
import UserModel from '../user/user.model'
import { CreateBoardDto, UpdateBoardDto } from './board.interfaces'

const getAll = async (ctx: Ctx) => {
  const { user } = ctx.state

  const [boards, lastViews] = await Promise.all([
    BoardModel.find({ users: { $in: [user._id] } }),
    BoardViewModel.find({ userId: user._id }),
  ])

  const populatedBoards = boards.map((board) => {
    const lastView = lastViews.find(
      ({ boardId }) => String(boardId) === board.id,
    )
    return { ...board.toObject(), lastView: lastView?.createdAt }
  })

  ctx.body = populatedBoards
}

const get = async (ctx: Ctx) => {
  const boardId = ctx.params.id
  const userId = ctx.state.user._id

  await verifyMembership(userId, boardId)

  await new BoardViewModel({ userId, boardId }).save()

  const board = await BoardModel.findById(boardId)
    .populate('lists')
    .populate('cards')
    .populate('memberships')

  ctx.assert(board, STATUS_CODES.BAD_REQUEST, 'Board not found')

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

const update = async (ctx: Ctx<UpdateBoardDto>) => {
  const { id } = ctx.params
  const { user } = ctx.state

  await verifyMembership(user._id, id)

  const board = await BoardModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.assert(board, STATUS_CODES.BAD_REQUEST, 'Board not found')

  ctx.body = board
}

const deleteBoard = async (ctx: Ctx<UpdateBoardDto>) => {
  const { id } = ctx.params
  const { user } = ctx.state

  await verifyMembership(user._id, id, MEMBERSHIP_ROLES.ADMIN)

  await BoardModel.deleteOne({ _id: id })

  ctx.status = STATUS_CODES.OK
}

export default {
  getAll,
  get,
  create,
  update,
  delete: deleteBoard,
}
