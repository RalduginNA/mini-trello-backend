import { Schema, model } from 'mongoose'
import UserModel from './User'
import RESPONSE_CODE from '../constants/api'
import HttpError from './HttpError'
import { verifyDocumentId } from '../helpers/validators/document'

const schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    taskColumns: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'TaskColumn',
        },
      ],
      required: true,
      default: [],
    },
    // accessLevel: { type: String, enum: ['private', 'public'], required: true }, private or public
  },
  { timestamps: true },
)

schema.post('validate', async (doc) => {
  try {
    await verifyDocumentId(UserModel, doc.userId)
  } catch (err) {
    throw new HttpError(
      RESPONSE_CODE.REJECT.INVALID_REQUEST.status,
      err.message,
    )
  }
})

export default model('Board', schema)
