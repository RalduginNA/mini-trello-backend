import { ExtendsKeys } from './../../types'
import Joi from 'joi'
import { CreateBoardDto, UpdateBoardDto } from './board.interfaces'

const create: ExtendsKeys<CreateBoardDto> = {
  name: Joi.string().required(),
}

const update: ExtendsKeys<UpdateBoardDto> = {
  name: Joi.string(),
}

export default { create: Joi.object(create), update: Joi.object(update) }
