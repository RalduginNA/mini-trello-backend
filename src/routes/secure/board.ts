import Router from '@koa/router'
import BoardModel, { Board } from '../../models/Board'
import UserModel from '../../models/User'
import MembershipModel from '../../models/Membership'
import CardModel from '../../models/Card'
import HttpError from '../../models/HttpError'
import { STATUS_CODES } from '../../constants/api'
import { Ctx, ParamsId } from '../../types'
import { MEMBERSHIP_ROLES } from '../../constants/general'

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx: Ctx<{}, ParamsId>) => {
  const boards = await UserModel.findById(ctx.state.user._id).populate({
    path: 'boards',
  })
  ctx.body = boards
})

router.get('/:id', async (ctx: Ctx<{}, ParamsId>) => {
  const boardId = ctx.params.id
  const board = await BoardModel.findById(boardId).populate({
    path: 'lists',
  })
  if (!board) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Board not found')
  }
  const cards = await CardModel.find({ boardId: boardId })

  ctx.body = { ...board.toJSON(), cards }
})

interface CreateBoardDto extends Board {}

router.post('/', async (ctx: Ctx<CreateBoardDto>) => {
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
})

interface UpdatedBoardDto {
  name?: string
}

router.put('/:id', async (ctx: Ctx<UpdatedBoardDto, ParamsId>) => {
  const board = await BoardModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.body = board
})

interface MoveListDto {
  oldPosition: number
  newPosition: number
}

router.put('/:id/list-move', async (ctx: Ctx<MoveListDto, ParamsId>) => {
  const { id } = ctx.params
  const { oldPosition, newPosition } = ctx.request.body

  const board = await BoardModel.findById(id)
  const { lists } = board

  if (newPosition >= lists.length || oldPosition >= lists.length) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
  }

  lists.splice(newPosition, 0, lists.splice(oldPosition, 1)[0])

  const updatedBoard = await BoardModel.findByIdAndUpdate(
    id,
    { $set: { lists: lists } },
    { new: true },
  )

  ctx.body = { listIds: updatedBoard.lists }
})

export default router
