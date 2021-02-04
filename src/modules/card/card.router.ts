import Router from '@koa/router'
import CardController from './card.controller'
import CardSchema from './card.schema'
import validateRequest from '../../middlewares/validateRequest'

const router = new Router({ prefix: `/cards` })

router.post('/', validateRequest(CardSchema.create), CardController.create)
router.get('/:id', CardController.get)
router.put('/:id', validateRequest(CardSchema.update), CardController.update)
router.delete('/:id', CardController.delete)

export default router
