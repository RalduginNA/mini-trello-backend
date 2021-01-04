import Router from '@koa/router'
import ListScheme from './list.schema'
import ListController from './list.controller'
import validateRequest from '../../middlewares/validateRequest'

const router = new Router({ prefix: `/lists` })

router.post('/', validateRequest(ListScheme.create), ListController.create)
router.put('/:id', validateRequest(ListScheme.update), ListController.update)
router.delete('/:id', ListController.delete)

export default router
