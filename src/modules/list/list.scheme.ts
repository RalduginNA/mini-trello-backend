import Joi from 'joi'
import { CreateListDto, UpdateListDto } from './list.interfaces'

const create = Joi.object<CreateListDto>({
  name: Joi.string().required(),
  boardId: Joi.string().required(),
  position: Joi.number().required(),
})

const update = Joi.object<UpdateListDto>({
  name: Joi.string(),
  position: Joi.number(),
})

export default { create, update }
