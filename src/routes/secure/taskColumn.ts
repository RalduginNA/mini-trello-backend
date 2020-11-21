import Router from '@koa/router'
import TaskColumnModel, { TaskColum } from '../../models/TaskColumn'
import BoardModel from '../../models/Board'
import HttpError from '../../models/HttpError'
import { STATUS_CODES } from '../../constants/api'
import { Ctx, ParamsId } from '../../types'
import { Types } from 'mongoose'

const router = new Router({ prefix: '/taskColumns' })

interface CreateTaskColumn extends TaskColum {}

router.post('/', async (ctx: Ctx<CreateTaskColumn>) => {
  const { body } = ctx.request
  const taskColumn = new TaskColumnModel({ ...body })
  await taskColumn.validate()

  const [savedTaskColumn] = await Promise.all([
    await taskColumn.save(),
    await BoardModel.update(
      { _id: body.boardId },
      { $addToSet: { taskColumns: taskColumn._id } },
    ),
  ])

  ctx.response.body = savedTaskColumn
})

interface UpdateTaskOrderRequest {
  name: string
  boardId: Types.ObjectId
}

router.put('/:id', async (ctx: Ctx<UpdateTaskOrderRequest, ParamsId>) => {
  const taskColumn = await TaskColumnModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.response.body = taskColumn
})

interface TaskOrderRequest {
  oldPosition: number
  newPosition: number
}

router.put('/:id/task-order', async (ctx: Ctx<TaskOrderRequest, ParamsId>) => {
  const { id } = ctx.params
  const { oldPosition, newPosition } = ctx.request.body

  const board = await TaskColumnModel.findById(id)
  const { tasks } = board

  if (newPosition >= tasks.length && oldPosition >= tasks.length) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
  }

  tasks.splice(newPosition, 0, tasks.splice(oldPosition, 1)[0])

  const updatedTaskColumn = await TaskColumnModel.findByIdAndUpdate(
    id,
    { $set: { tasks: tasks } },
    { new: true },
  )

  ctx.body = { taskIds: updatedTaskColumn.tasks }
})

export default router
