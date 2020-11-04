import Router from '@koa/router'
import TaskColumnModel from '../../models/TaskColumn'

const router = new Router({ prefix: '/taskColumns' })

router.get('/', async (ctx) => {
  const taskColumns = await TaskColumnModel.find({})
  ctx.response.body = taskColumns
})

router.get('/:id', async (ctx) => {
  const taskColumn = await TaskColumnModel.findById(ctx.params.id)
  ctx.response.body = taskColumn
})

router.post('/', async (ctx) => {
  const taskColumn = new TaskColumnModel({ ...ctx.request.body })
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
