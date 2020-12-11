import { Middleware } from 'koa'
import { ObjectSchema, ValidationOptions } from 'joi'
import { STATUS_CODES } from '../constants/api'
import HttpError from '../helpers/HttpError'

const defaultValidationOptions = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
}

const validateRequest = (
  schema: ObjectSchema,
  options: ValidationOptions = defaultValidationOptions,
): Middleware => async (ctx, next) => {
  const { error, value } = schema.validate(ctx.request.body, options)
  if (error) {
    throw new HttpError(
      STATUS_CODES.BAD_REQUEST,
      `Validation error: ${error.details.map((x) => x.message).join(', ')}`,
    )
  }
  ctx.request.body = value
  await next()
}

export default validateRequest
