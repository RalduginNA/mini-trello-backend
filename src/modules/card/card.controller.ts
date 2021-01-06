import CardModel from './card.model'
import { CreateCardDto, UpdateCardDto } from './card.interfaces'
import { MOVE_STEP } from '../../constants/general'
import { Ctx, ParamsId } from '../../types'
import { verifyDocumentId } from '../../helpers/document'
import { STATUS_CODES } from '../../constants/api'
import { verifyMembership } from '../../helpers/permissions'

const create = async (ctx: Ctx<CreateCardDto>) => {
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user

  await verifyMembership(userId, body.boardId)

  const card = new CardModel({ ...body, userId })
  const savedCard = await card.save()

  ctx.body = savedCard
}

const update = async (ctx: Ctx<UpdateCardDto, ParamsId>) => {
  const { body } = ctx.request
  const { id } = ctx.params
  const { user } = ctx.state

  const card = await verifyDocumentId(CardModel, id)
  await verifyMembership(user._id, card.boardId)

  if (body.position || body.listId) {
    const position = body.position || card.position
    const listId = body.listId || card.listId

    const cardsOfList = await CardModel.find({
      _id: { $ne: id },
      listId: listId,
      position: { $gte: position },
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

  const updatedCard = await CardModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...body } },
    { new: true },
  )

  ctx.body = updatedCard
}

const deleteCard = async (ctx: Ctx<{}, ParamsId>) => {
  const { id } = ctx.params
  const { user } = ctx.state

  const card = await verifyDocumentId(CardModel, id)
  await verifyMembership(user._id, card.boardId)

  await CardModel.deleteOne({ _id: id })

  ctx.status = STATUS_CODES.OK
}

export default {
  create,
  update,
  delete: deleteCard,
}
