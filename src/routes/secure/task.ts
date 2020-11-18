import Router from '@koa/router'
import TaskModel from '../../models/Task'
import TaskColumnModel from '../../models/TaskColumn'

const router = new Router({ prefix: '/tasks' })

router.post('/', async (ctx) => {
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user
  const task = new TaskModel({ ...body, userId })
  await task.validate()

  const [savedTask] = await Promise.all([
    task.save(),
    TaskColumnModel.update(
      { _id: body.taskColumnId },
      { $addToSet: { tasks: task._id } },
    ),
  ])

  ctx.response.body = savedTask
})

router.put('/:id', async (ctx) => {
  const task = await TaskModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.response.body = task
})

router.put('/:id/change-task-column', async (ctx) => {
  const { id } = ctx.params
  const { newTaskColumnId, taskPosition = 0 } = ctx.request.body

  const task = await TaskModel.findById(id)

  await TaskColumnModel.update(
    { _id: task.taskColumnId },
    { $pull: { tasks: id } },
    { safe: true, multi: true },
  )

  await TaskColumnModel.update(
    { _id: newTaskColumnId },
    { $push: { tasks: { $each: [id], $position: taskPosition } } },
    { safe: true, multi: true },
  )

  await task.updateOne({ $set: { taskColumnId: newTaskColumnId } })

  ctx.response.body = 'done'
})

export default router
