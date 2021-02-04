import Joi from 'joi'
import { SignInDto, SignUpDto, RefreshDto } from './auth.interfaces'
import { PASSWORD_REGEX } from '../../constants/general'
import { ExtendsKeys } from '../../types'

const signIn: ExtendsKeys<SignInDto> = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(PASSWORD_REGEX).min(5).max(72).required(),
}

const signUp: ExtendsKeys<SignUpDto> = {
  ...signIn,
  username: Joi.string().required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
}

const refresh: ExtendsKeys<RefreshDto> = {
  refreshToken: Joi.string().required(),
}

export default {
  signIn: Joi.object(signIn),
  signUp: Joi.object(signUp),
  refresh: Joi.object(refresh),
}
