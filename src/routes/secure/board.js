import Router from '@koa/router'
import BoardModel from '../../models/Board'
import HttpError from '../../models/HttpError'
import UserModel from '../../models/User'
import RESPONSE_CODE from '../../constants/api'

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
  const userId = ctx.state.user._id
  const { name } = ctx.request.body
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

router.put('/:id/task-column-move', async (ctx) => {
  const { id } = ctx.request.params
  const { oldPosition, newPosition } = ctx.request.body

  const board = await BoardModel.findById(id)
  const { taskColumns } = board

  if (newPosition >= taskColumns.length && oldPosition >= 0) {
    throw HttpError(
      RESPONSE_CODE.REJECT.INVALID_REQUEST.status,
      'Incorrect position',
    )
  }

  taskColumns.splice(newPosition, 0, taskColumns.splice(oldPosition, 1)[0])

  const updatedBoard = await BoardModel.findByIdAndUpdate(
    id,
    { $set: { taskColumns: taskColumns } },
    { new: true },
  )

  ctx.body = { taskColumnIds: updatedBoard.taskColumns }
})

export default router
