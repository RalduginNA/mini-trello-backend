import Router from '@koa/router'
import BoardModel from '../../models/Board'
import UserModel from '../../models/User'

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx) => {
  const boards = await BoardModel.find({})
  ctx.body = boards
})

router.get('/:id', async (ctx) => {
  const board = await BoardModel.findById(ctx.params.id).populate({
    path: 'taskColumns',
    populate: {
      path: 'tasks',
    },
  })

  ctx.body = board
})

router.post('/', async (ctx) => {
  const { name, userId } = ctx.request.body
  const isUserExist = await UserModel.exists({ _id: userId })
  // Example of validation
  if (!isUserExist) {
    ctx.throw(400, `User doesn't exist`) // try to validate ids in mongoose model
  }

  const board = new BoardModel({ name, userId })
  const savedBoard = await board.save()
  ctx.body = savedBoard
})

router.put('/:id', async (ctx) => {
  const board = await BoardModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.body = board
})

export default router
