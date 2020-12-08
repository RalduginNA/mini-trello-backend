import Router from '@koa/router'
import BoardController from '../board/board.controller'

const router = new Router({ prefix: `/boards` })

router.get('/', BoardController.getAll)
router.get('/:id', BoardController.get)
router.post('/', BoardController.create)
router.put('/:id', BoardController.update)

export default router
