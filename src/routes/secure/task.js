import Router from '@koa/router'
import TaskModel from '../../models/Task'
import TaskColumnModel from '../../models/TaskColumn'

const router = new Router({ prefix: '/tasks' })

router.get('/', async (ctx) => {
  const tasks = await TaskModel.find({})
  ctx.response.body = tasks
})

router.get('/:id', async (ctx) => {
  const task = await TaskModel.findById(ctx.params.id)
  ctx.response.body = task
})

router.post('/', async (ctx) => {
  // NEED TO ADD { boardId, taskColumnId } VALIDATION
  const { body } = ctx.request
  const { _id: userId } = ctx.state.user
  const task = new TaskModel({ ...body, userId })

  const taskColumn = await TaskColumnModel.findById(body.taskColumnId)
  taskColumn.taskIds.push(task._id)
  await taskColumn.save()

  const savedTask = await task.save()
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
