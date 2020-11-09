import Router from '@koa/router'
import TaskColumnModel from '../../models/TaskColumn'
import BoardModel from '../../models/Board'

const router = new Router({ prefix: '/taskColumns' })

router.get('/', async (ctx) => {
  const taskColumns = await TaskColumnModel.find({})
  ctx.response.body = taskColumns
})

router.get('/:id', async (ctx) => {
  const taskColumn = await TaskColumnModel.findById(ctx.params.id).populate(
    'tasks',
  )

  ctx.response.body = taskColumn
})

router.post('/', async (ctx) => {
  const { body } = ctx.request
  const taskColumn = new TaskColumnModel({ ...body })

  // need validation
  const board = await BoardModel.findById(body.boardId)
  board.taskColumns.push(taskColumn._id)
  await board.save()

  const savedTaskColumn = await taskColumn.save()
  ctx.response.body = savedTaskColumn
})

router.put('/:id', async (ctx) => {
  const taskColumn = await TaskColumnModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.response.body = taskColumn
})

export default router
