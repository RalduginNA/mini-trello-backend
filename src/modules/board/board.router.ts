import Router from '@koa/router'
import BoardController from './board.controller'
import BoardScheme from './board.schema'
import validateRequest from '../../middlewares/validateRequest'

const router = new Router({ prefix: `/boards` })

router.get('/', BoardController.getAll)
router.get('/:id', BoardController.get)
router.post('/', validateRequest(BoardScheme.create), BoardController.create)
router.put('/:id', validateRequest(BoardScheme.update), BoardController.update)
router.delete('/:id', BoardController.delete)

export default router
