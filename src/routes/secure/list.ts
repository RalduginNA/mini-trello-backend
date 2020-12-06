import Router from '@koa/router'
import ListModel from '../../models/List'
import { Ctx, ParamsId } from '../../types'
import { Types } from 'mongoose'
import { MOVE_STEP } from '../../constants/general'

const router = new Router({ prefix: '/lists' })

interface CreateListDto {
  name: string
  boardId: Types.ObjectId
  position: number
}

router.post('/', async (ctx: Ctx<CreateListDto>) => {
  const { body } = ctx.request
  const list = new ListModel({ ...body })
  const savedList = await list.save()

  ctx.body = { ...savedList.toJSON(), cards: [] }
})

interface UpdateListDto {
  name?: string
  position?: number
}

router.put('/:id', async (ctx: Ctx<UpdateListDto, ParamsId>) => {
  const { body } = ctx.request
  const { id } = ctx.params

  if (body.position) {
    const list = await ListModel.findById(id)
    const listsOfBoard = await ListModel.find({
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
})

export default router
