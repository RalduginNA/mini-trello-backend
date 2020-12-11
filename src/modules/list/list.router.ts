import Router from '@koa/router'
import ListController from '../list/list.controller'

const router = new Router({ prefix: `/lists` })

router.post('/', ListController.create)
router.put('/:id', ListController.update)
router.delete('/:id', ListController.delete)

export default router
