import Router from '@koa/router'
import ListModel from '../../models/List'
import BoardModel from '../../models/Board'
import { Ctx, ParamsId } from '../../types'
import { Types } from 'mongoose'
import { arrayMove } from '../../helpers/functions'

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

  const { cards } = await ListModel.findById(id)

  const reorderedCards = arrayMove(cards, oldPosition, newPosition)

  const updatedList = await ListModel.findByIdAndUpdate(
    id,
    { $set: { cards: reorderedCards } },
    { new: true },
  )

  ctx.body = { cardIds: updatedList.cards }
})

export default router
