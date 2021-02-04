import Joi from 'joi'
import { CreateCardDto, UpdateCardDto } from './card.interfaces'
import { ExtendsKeys } from '../../types'

const create: ExtendsKeys<CreateCardDto> = {
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  boardId: Joi.string().required(),
  position: Joi.number().positive().required(),
  listId: Joi.string().required(),
}

const update: ExtendsKeys<UpdateCardDto> = {
  title: Joi.string(),
  description: Joi.string().allow(''),
  position: Joi.number().positive(),
  listId: Joi.string(),
}

export default { create: Joi.object(create), update: Joi.object(update) }
