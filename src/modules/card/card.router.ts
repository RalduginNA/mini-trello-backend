import Router from '@koa/router'
import CardController from './card.controller'

const router = new Router({ prefix: `/cards` })

router.post('/', CardController.create)
router.put('/:id', CardController.update)
router.delete('/:id', CardController.delete)

export default router
