import Router from '@koa/router'
import BoardModel from '../../models/Board'
import UserModel from '../../models/User'
import TaskColumnModel from '../../models/TaskColumn'

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx) => {
  const boards = await BoardModel.find({})
  ctx.body = boards
})

router.get('/:id', async (ctx) => {
  const board = await BoardModel.findById(ctx.params.id)
  const taskColumns = await TaskColumnModel.find({ boardId: board._id })

  const populatedTaskColumns = await Promise.all(
    taskColumns.map(({ _id }) =>
      TaskColumnModel.findById(_id).populate('tasks'),
    ),
  )

  ctx.body = { ...board.toObject(), taskColumns: populatedTaskColumns }
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
