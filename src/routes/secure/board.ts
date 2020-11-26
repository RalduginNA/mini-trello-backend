import Router from '@koa/router'
import BoardModel, { Board } from '../../models/Board'
import HttpError from '../../models/HttpError'
import { STATUS_CODES } from '../../constants/api'
import { Ctx, ParamsId } from '../../types'

const router = new Router({ prefix: '/boards' })

router.get('/', async (ctx: Ctx<{}, ParamsId>) => {
  const { _id: userId } = ctx.state.user
  const boards = await BoardModel.find({ userId })
  ctx.body = boards
})

router.get('/:id', async (ctx: Ctx<{}, ParamsId>) => {
  const board = await BoardModel.findById(ctx.params.id).populate({
    path: 'taskColumns',
    populate: {
      path: 'tasks',
    },
  })

  ctx.body = board
})

interface CreateBoardDto extends Board {}

router.post('/', async (ctx: Ctx<CreateBoardDto>) => {
  const userId = ctx.state.user._id
  const { name } = ctx.request.body
  const board = new BoardModel({ name, userId })
  const savedBoard = await board.save()
  ctx.body = savedBoard
})

interface UpdatedBoardDto {
  name?: string
}

router.put('/:id', async (ctx: Ctx<UpdatedBoardDto, ParamsId>) => {
  const board = await BoardModel.findByIdAndUpdate(
    { _id: ctx.params.id },
    { $set: { ...ctx.request.body } },
    { new: true },
  )
  ctx.body = board
})

interface MoveTaskColumnDto {
  oldPosition: number
  newPosition: number
}

router.put(
  '/:id/task-column-move',
  async (ctx: Ctx<MoveTaskColumnDto, ParamsId>) => {
    const { id } = ctx.params
    const { oldPosition, newPosition } = ctx.request.body

    const board = await BoardModel.findById(id)
    const { taskColumns } = board

    if (
      newPosition >= taskColumns.length ||
      oldPosition >= taskColumns.length
    ) {
      throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
    }

    taskColumns.splice(newPosition, 0, taskColumns.splice(oldPosition, 1)[0])

    const updatedBoard = await BoardModel.findByIdAndUpdate(
      id,
      { $set: { taskColumns: taskColumns } },
      { new: true },
    )

    ctx.body = { taskColumnIds: updatedBoard.taskColumns }
  },
)

export default router
