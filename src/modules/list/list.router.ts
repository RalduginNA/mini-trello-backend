import Router from '@koa/router'
import ListSchema from './list.schema'
import ListController from './list.controller'
import validateRequest from '../../middlewares/validateRequest'

const router = new Router({ prefix: `/lists` })

router.post('/', validateRequest(ListSchema.create), ListController.create)

router.put('/:id', validateRequest(ListSchema.update), ListController.update)

router.delete('/:id', ListController.delete)

export default router
