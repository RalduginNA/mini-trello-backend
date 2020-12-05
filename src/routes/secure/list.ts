import Router from '@koa/router'
import ListModel from '../../models/List'
import { Ctx, ParamsId } from '../../types'
import { Types } from 'mongoose'
import { STATUS_CODES } from '../../constants/api'

const router = new Router({ prefix: '/lists' })

interface CreateListDto {
  name: string
  boardId: Types.ObjectId
}

router.post('/', async (ctx: Ctx<CreateListDto>) => {
  const { body } = ctx.request
  const list = new ListModel({ ...body })

  const listWithMaxPosition = (
    await ListModel.find({ boardId: list.boardId })
      .sort({ position: -1 })
      .limit(1)
  )[0]

  list.position = listWithMaxPosition?.position + 1 || 1

  const savedList = await list.save()

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

interface ListMoveDto {
  position: number
}

router.put('/:id/move', async (ctx: Ctx<ListMoveDto, ParamsId>) => {
  const { id } = ctx.params
  const { position } = ctx.request.body
  const list = await ListModel.findOneAndUpdate(
    { _id: id },
    { $set: { position: position } },
  )
  const updatedList = await ListModel.findById(id)
  const { position: oldPosition, boardId } = list
  const difference = oldPosition - position
  const differenceIsPositive = difference > 0
  const listsInBoard = await ListModel.find({
    listId: boardId,
    _id: { $ne: id },
  })

  if (
    listsInBoard.length + 1 < position ||
    position < 1 ||
    oldPosition === position
  ) {
    ctx.throw(STATUS_CODES.BAD_REQUEST, 'Incorrect newPosition')
  }

  await Promise.all([
    listsInBoard.map((doc) => {
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

  listsInBoard.push(updatedList)

  ctx.body = listsInBoard
    .sort((a, b) => a.position - b.position)
    .map(
      ({ name, id, position }) => `Card ${name} | Pos ${position} | Id ${id}`,
    )
})

export default router
