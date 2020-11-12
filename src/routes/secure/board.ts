import Router from '@koa/router'
import BoardModel from '../../models/Board'
import HttpError from '../../models/HttpError'
import { STATUS_CODES } from '../../constants/api'

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx) => {
  const { _id: userId } = ctx.state.user
  const boards = await BoardModel.find({ userId })
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
  const { id } = ctx.params
  const { oldPosition, newPosition } = ctx.request.body

  const board = await BoardModel.findById(id)
  const { taskColumns } = board

  if (newPosition >= taskColumns.length && oldPosition >= taskColumns.length) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
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