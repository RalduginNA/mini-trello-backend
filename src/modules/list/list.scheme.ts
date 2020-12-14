import Joi from 'joi'
import { CreateListDto, UpdateListDto } from './list.interfaces'
import { ExtendsKeys } from './../../types'

const create: ExtendsKeys<CreateListDto> = {
  name: Joi.string().required(),
  boardId: Joi.string().required(),
  position: Joi.number().required(),
}

const update: ExtendsKeys<UpdateListDto> = {
  name: Joi.string(),
  position: Joi.number(),
}

export default { create: Joi.object(create), update: Joi.object(update) }
