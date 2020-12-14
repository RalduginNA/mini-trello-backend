import { MOVE_STEP } from '../../constants/general'
import { Ctx, ParamsId } from '../../types'
import { CreateListDto, UpdateListDto } from './list.interfaces'
import ListModel from './list.model'
import CardModel from '../card/card.model'
import { STATUS_CODES } from '../../constants/api'

const create = async (ctx: Ctx<CreateListDto>) => {
  const { body } = ctx.request
  const list = new ListModel({ ...body })
  const savedList = await list.save()

  ctx.body = { ...savedList.toJSON(), cards: [] }
}

const update = async (ctx: Ctx<UpdateListDto, ParamsId>) => {
  const { body } = ctx.request
  const { id } = ctx.params

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

  const list = await ListModel.findByIdAndUpdate(
    { _id: id },
    { $set: { ...body } },
    { new: true },
  )

  ctx.body = list
}

const deleteList = async (ctx: Ctx<{}, ParamsId>) => {
  const { id } = ctx.params
  const list = await ListModel.findById(id)
  ctx.assert(list, STATUS_CODES.BAD_REQUEST, 'List not found')

  await Promise.all([
    ListModel.deleteOne({ _id: id }),
    CardModel.deleteMany({ listId: id }),
  ])
}

export default {
  create,
  update,
  delete: deleteList,
}
