import Router from '@koa/router'
import TaskColumnModel from '../../models/TaskColumn'
import BoardModel from '../../models/Board'

const router = new Router({ prefix: '/taskColumns' })

router.post('/', async (ctx) => {
  const { body } = ctx.request
  const taskColumn = new TaskColumnModel({ ...body })
  await taskColumn.validate()

  const [savedTaskColumn] = await Promise.all([
    await taskColumn.save(),
    // need validation
    await BoardModel.update(
      { _id: body.boardId },
      { $addToSet: { taskColumns: taskColumn._id } },
    ),
  ])

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
