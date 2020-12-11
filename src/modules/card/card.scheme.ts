import Joi from 'joi'

const create = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  boardId: Joi.string().required(),
  position: Joi.number().positive().required(),
  listId: Joi.string().required(),
})

const update = Joi.object({
  title: Joi.string(),
  description: Joi.string().allow(''),
  position: Joi.number().positive(),
  listId: Joi.string(),
})

export default { create, update }
