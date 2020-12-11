import Router from '@koa/router'
import CardController from './card.controller'
import CardScheme from './card.scheme'
import validateRequest from '../../middlewares/validationRequest'

const router = new Router({ prefix: `/cards` })

router.post('/', validateRequest(CardScheme.create), CardController.create)
router.put('/:id', validateRequest(CardScheme.update), CardController.update)
router.delete('/:id', CardController.delete)

export default router
