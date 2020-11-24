import Router from '@koa/router'
import { verifyDocumentId } from '../../helpers/validators/document'
import TaskModel, { Task } from '../../models/Task'
import TaskColumnModel from '../../models/TaskColumn'
import { Ctx, ParamsId } from '../../types'

const router = new Router({ prefix: '/tasks' })

interface CreateTaskRequest extends Task {}

router.post('/', async (ctx: Ctx<CreateTaskRequest>) => {
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user
  const task = new TaskModel({ ...body, userId })
  await task.validate()

  const [savedTask] = await Promise.all([
    task.save(),
    TaskColumnModel.updateOne(
      { _id: task.taskColumnId },
      { $addToSet: { tasks: task._id } },
    ),
  ])

  ctx.response.body = savedTask
})

interface UpdateTaskRequest {
  title?: string
  description?: string
}

router.put('/:id', async (ctx: Ctx<UpdateTaskRequest, ParamsId>) => {
  const task = await TaskModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )

  ctx.response.body = task
})

interface ChangeTaskColumn {
  newTaskColumnId: string
  taskPosition?: number
}

router.put(
  '/:id/change-column',
  async (ctx: Ctx<ChangeTaskColumn, ParamsId>) => {
    const { id } = ctx.params
    const { newTaskColumnId, taskPosition = 0 } = ctx.request.body

    await verifyDocumentId(TaskColumnModel, newTaskColumnId)
    const task = await TaskModel.findById(id)

    await Promise.all([
      TaskColumnModel.updateOne(
        { _id: task.taskColumnId },
        { $pull: { tasks: id } },
        { safe: true, multi: true },
      ),
      TaskColumnModel.updateOne(
        { _id: newTaskColumnId },
        { $push: { tasks: { $each: [id], $position: taskPosition } } },
        { safe: true, multi: true },
      ),
      task.updateOne({ $set: { taskColumnId: newTaskColumnId } }),
    ])

    ctx.response.body = 'done'
  },
)

export default router
