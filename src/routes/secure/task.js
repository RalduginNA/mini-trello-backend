const Router = require('@koa/router')
const TaskModel = require('../../models/Task')

const router = new Router({ prefix: '/tasks' })

router.get('/', async (ctx) => {
  const tasks = await TaskModel.find({})
  ctx.response.body = tasks
})

router.get('/:id', async (ctx) => {
  console.log('Task')
  const task = await TaskModel.findById(ctx.params.id)
  ctx.response.body = task
})

router.post('/', async (ctx) => {
  // NEED TO ADD { boardId, taskColumnId } VALIDATION
  const task = new TaskModel({ ...ctx.request.body })
  const savedTask = await task.save()
  ctx.response.body = savedTask
})

router.put('/:id', async (ctx) => {
  const task = await TaskModel.updateOne(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
  )
  ctx.response.body = task
})

module.exports = router
