import Router from '@koa/router'
import TaskModel from '../../models/Task'
import TaskColumnModel from '../../models/TaskColumn'

const router = new Router({ prefix: '/tasks' })

router.post('/', async (ctx) => {
  // NEED TO ADD { boardId, taskColumnId } VALIDATION
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

export default router
