import Router from '@koa/router'
import { Types } from 'mongoose'
import { MOVE_STEP } from '../../constants/general'
import CardModel, { Card } from '../../models/Card'
import { Ctx, ParamsId } from '../../types'

const router = new Router({ prefix: '/cards' })

interface CreateCardDto extends Card {}

router.post('/', async (ctx: Ctx<CreateCardDto>) => {
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user
  const card = new CardModel({ ...body, userId })
  const savedCard = await card.save()

  ctx.body = savedCard
})

interface UpdateCardDto {
  title?: string
  description?: string
  position?: number
  listId?: Types.ObjectId
}

router.put('/:id', async (ctx: Ctx<UpdateCardDto, ParamsId>) => {
  const { body } = ctx.request
  const { id } = ctx.params

  if (body.position) {
    const card = await CardModel.findById(id)
    const cardsOfList = await CardModel.find({
      listId: body.listId || card.listId,
      position: { $gte: body.position },
    }).sort({ position: 1 })

    await Promise.all(
      cardsOfList.map((list, i, arr) => {
        if (i === 0) {
          list.position += MOVE_STEP
          return list.save()
        }
        if (arr[i - 1].position === arr[i].position) {
          list.position += MOVE_STEP
          return list.save()
        }
      }),
    )
  }

  const card = await CardModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...body } },
    { new: true },
  )

  ctx.body = card
})

export default router
