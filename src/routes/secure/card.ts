import Router from '@koa/router'
import { Types } from 'mongoose'
import { STATUS_CODES } from '../../constants/api'
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

  const cardWithMaxPosition = (
    await CardModel.find({ listId: card.listId })
      .sort({ position: -1 })
      .limit(1)
  )[0]

  card.position = cardWithMaxPosition?.position + 1 || 1

  const savedCard = await card.save()

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

interface CardMoveDto {
  position: number
  listId: Types.ObjectId
}

router.put('/:id/move', async (ctx: Ctx<CardMoveDto, ParamsId>) => {
  const { id } = ctx.params
  const { position } = ctx.request.body
  const card = await CardModel.findOneAndUpdate(
    { _id: id },
    { $set: { position: position } },
  )
  const updatedCard = await CardModel.findById(id)
  const { position: oldPosition, listId } = card
  const difference = oldPosition - position
  const differenceIsPositive = difference > 0
  const cardsInList = await CardModel.find({
    listId: listId,
    _id: { $ne: id },
  })

  if (
    cardsInList.length + 1 < position ||
    position < 1 ||
    oldPosition === position
  ) {
    ctx.throw(STATUS_CODES.BAD_REQUEST, 'Incorrect newPosition')
  }

  await Promise.all([
    cardsInList.map((doc) => {
      if (
        differenceIsPositive
          ? doc.position < oldPosition && doc.position >= position
          : doc.position > oldPosition && doc.position <= position
      ) {
        doc.position = doc.position + (differenceIsPositive ? 1 : -1)
        return doc.save()
      }
    }),
  ])

  cardsInList.push(updatedCard)

  ctx.body = cardsInList
    .sort((a, b) => a.position - b.position)
    .map(
      ({ title, id, position }) => `Card ${title} | Pos ${position} | Id ${id}`,
    )
})

interface MoveBetweenListDto {
  listId: Types.ObjectId
  position: number
}

router.put(
  '/:id/move-between-list',
  async (ctx: Ctx<MoveBetweenListDto, ParamsId>) => {
    const { id } = ctx.params
    const { listId, position } = ctx.request.body

    await verifyDocumentId(ListModel, listId)
    const card = await CardModel.findById(id)
    const cardsInList = await CardModel.find({ listId: card.listId })

    await Promise.all([
      cardsInList.map((doc) => {
        if (
          doc.position <= cardsInList.length &&
          doc.position > card.position
        ) {
          doc.position = doc.position - 1
          return doc.save()
        }
      }),
    ])

    const cardsInNextList = await CardModel.find({ listId: listId })

    await Promise.all([
      cardsInNextList.map((doc) => {
        if (
          doc.position <= cardsInNextList.length &&
          doc.position >= position
        ) {
          doc.position = doc.position + 1
          return doc.save()
        }
      }),
    ])
    // //
    // card.position = newPosition
    // cardsInNextList.push(card)
    // const cardsInListFiltered = cardsInList.filter(
    //   (card) => card.id !== String(id),
    // )

    await CardModel.updateOne(
      { _id: id },
      { $set: { listId: listId, position: position } },
    )

    console.debug(`listId ${card.listId}`)
    console.debug(`newListId ${listId}`)

    const list1 = await CardModel.find({ listId: card.listId })
    const list2 = await CardModel.find({ listId: listId })

    ctx.body = {
      firstList: list1
        .sort((a, b) => a.position - b.position)
        .map(
          ({ title, id, position }) =>
            `Card ${title} | Pos ${position} | Id ${id}`,
        ),
      secondList: list2
        .sort((a, b) => a.position - b.position)
        .map(
          ({ title, id, position }) =>
            `Card ${title} | Pos ${position} | Id ${id}`,
        ),
    }
  },
)

export default router
