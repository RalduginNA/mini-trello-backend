import Router from '@koa/router'
import ListModel from '../../models/List'
import BoardModel from '../../models/Board'
import HttpError from '../../models/HttpError'
import { STATUS_CODES } from '../../constants/api'
import { Ctx, ParamsId } from '../../types'
import { Types } from 'mongoose'

const router = new Router({ prefix: '/lists' })

interface CreateListDto {
  name: string
  boardId: Types.ObjectId
}

router.post('/', async (ctx: Ctx<CreateListDto>) => {
  const { body } = ctx.request
  const list = new ListModel({ ...body })
  await list.validate()

  const [savedList] = await Promise.all([
    await list.save(),
    await BoardModel.updateOne(
      { _id: body.boardId },
      { $addToSet: { lists: list._id } },
    ),
  ])

  ctx.body = savedList
})

interface UpdateListDto {
  name: string
  boardId: Types.ObjectId
}

router.put('/:id', async (ctx: Ctx<UpdateListDto, ParamsId>) => {
  const list = await ListModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.body = list
})

interface CardOrderDto {
  oldPosition: number
  newPosition: number
}

router.put('/:id/card-order', async (ctx: Ctx<CardOrderDto, ParamsId>) => {
  const { id } = ctx.params
  const { oldPosition, newPosition } = ctx.request.body

  const board = await ListModel.findById(id)
  const { cards } = board

  if (
    newPosition < 0 ||
    oldPosition < 0 ||
    oldPosition == newPosition ||
    newPosition >= cards.length ||
    oldPosition >= cards.length
  ) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
  }

  cards.splice(newPosition, 0, cards.splice(oldPosition, 1)[0])

  const updatedList = await ListModel.findByIdAndUpdate(
    id,
    { $set: { cards: cards } },
    { new: true },
  )

  ctx.body = { cardIds: updatedList.cards }
})

export default router
