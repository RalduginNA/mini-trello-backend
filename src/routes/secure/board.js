const Router = require('@koa/router')
const BoardModel = require('../../models/Board')

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx) => {
  const boards = await BoardModel.find({})
  ctx.body = boards
})

router.get('/:id', async (ctx) => {
  const board = await BoardModel.findById(ctx.params.id)
  ctx.body = board
})

router.post('/', async (ctx) => {
  const { name } = ctx.request.body
  const board = new BoardModel({ name })
  const savedBoard = await board.save()
  ctx.body = savedBoard
})

router.put('/:id', async (ctx) => {
  const board = await BoardModel.updateOne(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
  )
  ctx.body = board
})

module.exports = router
