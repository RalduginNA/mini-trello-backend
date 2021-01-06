import { MOVE_STEP } from '../../constants/general'
import { Ctx, ParamsId } from '../../types'
import { CreateListDto, UpdateListDto } from './list.interfaces'
import ListModel from './list.model'
import CardModel from '../card/card.model'
import { STATUS_CODES } from '../../constants/api'
import { verifyDocumentId } from '../../helpers/document'
import verifyMembership from '../../helpers/verifyMembership'

const create = async (ctx: Ctx<CreateListDto>) => {
  const { body } = ctx.request
  const { user } = ctx.state

  await verifyMembership(user._id, body.boardId)

  const list = new ListModel({ ...body })
  const savedList = await list.save()

  ctx.body = { ...savedList.toJSON(), cards: [] }
}

const update = async (ctx: Ctx<UpdateListDto, ParamsId>) => {
  const { body } = ctx.request
  const { id } = ctx.params
  const { user } = ctx.state

  const list = await verifyDocumentId(ListModel, id)
  await verifyMembership(user._id, list.boardId)

  if (body.position) {
    const list = await ListModel.findById(id)
    const listsOfBoard = await ListModel.find({
      _id: { $ne: id },
      boardId: list.boardId,
      position: { $gte: body.position },
    }).sort({ position: 1 })

    await Promise.all(
      listsOfBoard.map((list, i, arr) => {
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

  const updatedList = await ListModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...body } },
    { new: true },
  )

  ctx.body = updatedList
}

const deleteList = async (ctx: Ctx<{}, ParamsId>) => {
  const { id } = ctx.params
  const { user } = ctx.state

  const list = await verifyDocumentId(ListModel, id)
  await verifyMembership(user._id, list.boardId)

  await Promise.all([
    ListModel.deleteOne({ _id: id }),
    CardModel.deleteMany({ listId: id }),
  ])

  ctx.status = STATUS_CODES.OK
}

export default {
  create,
  update,
  delete: deleteList,
}
