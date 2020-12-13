import Joi from 'joi'
import { SignInDto, SignUpDto, RefreshDto } from './auth.interfaces'
import { PASSWORD_REGEX } from '../../constants/general'

const signIn = Joi.object<SignInDto>({
  email: Joi.string().email().required(),
  password: Joi.string().regex(PASSWORD_REGEX).min(8).max(72).required(),
})

const signUp = Joi.object<SignUpDto>({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().regex(PASSWORD_REGEX).min(8).max(72).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
})

const refresh = Joi.object<RefreshDto>({
  refreshToken: Joi.string().required(),
})

export default { signIn, signUp, refresh }
