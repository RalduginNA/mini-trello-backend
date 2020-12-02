import Router from '@koa/router'
import { verifyDocumentId } from '../../helpers/validators/document'
import CardModel, { Card } from '../../models/Card'
import ListModel from '../../models/List'
import { Ctx, ParamsId } from '../../types'

const router = new Router({ prefix: '/cards' })

interface CreateCardDto extends Card {}

router.post('/', async (ctx: Ctx<CreateCardDto>) => {
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user
  const card = new CardModel({ ...body, userId })
  await card.validate()

  const [savedCard] = await Promise.all([
    card.save(),
    ListModel.updateOne(
      { _id: card.listId },
      { $addToSet: { cards: card._id } },
    ),
  ])

  ctx.body = savedCard
})

interface UpdateCardDto {
  title?: string
  description?: string
}

router.put('/:id', async (ctx: Ctx<UpdateCardDto, ParamsId>) => {
  const card = await CardModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )

  ctx.body = card
})

interface ChangeCardListDto {
  newListId: string
  cardPosition?: number
}

router.put(
  '/:id/change-list',
  async (ctx: Ctx<ChangeCardListDto, ParamsId>) => {
    const { id } = ctx.params
    const { newListId, cardPosition = 0 } = ctx.request.body

    await verifyDocumentId(ListModel, newListId)
    const card = await CardModel.findById(id)

    await Promise.all([
      ListModel.updateOne({ _id: card.listId }, { $pull: { cards: id } }),
      ListModel.updateOne(
        { _id: newListId },
        { $push: { cards: { $each: [id], $position: cardPosition } } },
      ),
      card.updateOne({ $set: { listId: newListId } }),
    ])
    // TODO: Add request
    ctx.body = 'done'
  },
)

export default router
