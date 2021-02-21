import { STATUS_CODES } from '../../constants/api'
import { MEMBERSHIP_ROLES } from '../../constants/general'
import { verifyMembership } from '../../utils/permissions'
import { Ctx } from '../../types'
import BoardModel from '../board/board.model'
import BoardViewedModel from './boardViewed/boardViewed.model'
import BoardFavoriteModel from './boardViewed/boardViewed.model'
import MembershipModel from '../membership/membership.model'
import UserModel from '../user/user.model'
import {
  BoardRelationBase,
  CreateBoardDto,
  UpdateBoardDto,
} from './board.interfaces'

const getAll = async (ctx: Ctx) => {
  const { user } = ctx.state

  const [boards, viewedBoards, staredBoards] = await Promise.all([
    BoardModel.find({ users: { $in: [user._id] } }),
    BoardViewedModel.find({ userId: user._id }),
    BoardFavoriteModel.find({ userId: user._id }),
  ])

  const populatedBoards = boards.map((board) => {
    const predicate = ({ boardId }: BoardRelationBase) =>
      String(boardId) === board.id
    const viewedBoard = viewedBoards.find(predicate)
    const staredBoard = staredBoards.find(predicate)

    return {
      ...board.toObject(),
      lastView: viewedBoard?.createdAt,
      stared: !!staredBoard,
    }
  })

  ctx.body = populatedBoards
}

const get = async (ctx: Ctx) => {
  const boardId = ctx.params.id
  const userId = ctx.state.user._id

  await verifyMembership(userId, boardId)

  await new BoardViewedModel({ userId, boardId }).save()

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
