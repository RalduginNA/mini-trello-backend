import Joi from 'joi'
import { CreateBoardDto, UpdatedBoardDto } from './board.interfaces'

const create = Joi.object<CreateBoardDto>({
  name: Joi.string().required(),
})

const update = Joi.object<UpdatedBoardDto>({
  name: Joi.string(),
})

export default { create, update }
