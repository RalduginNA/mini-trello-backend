import { Schema, model } from 'mongoose'
import validators from '../helpers/validators'
import RESPONSE_CODE from '../constants/api'
import HttpError from './HttpError'

const schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    taskColumns: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'TaskColumn',
          unique: true,
        },
      ],
      required: true,
      default: [],
    },
    // accessLevel: { type: String, enum: ['private', 'public'], required: true }, private or public
  },
  { timestamps: true },
)

// One example of validation
schema.post('validate', async (doc) => {
  const { user: UserValidator } = validators
  const isExistUser = await UserValidator.isExist.validator(doc.userId)
  if (!isExistUser) {
    throw new HttpError(
      RESPONSE_CODE.REJECT.INVALID_REQUEST.status,
      UserValidator.isExist.message,
    )
  }
})

export default model('Board', schema)
