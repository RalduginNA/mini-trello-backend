import { Schema, model, Types, Document } from 'mongoose'
import UserModel from './User'
import { STATUS_CODES } from '../constants/api'
import HttpError from './HttpError'
import { verifyDocumentId } from '../helpers/validators/document'

export interface Board {
  name: string
  userId: Types.ObjectId
  taskColumns: Array<Types.ObjectId>
}

interface BoardDoc extends Board, Document {}

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

schema.post('validate', async (doc: BoardDoc) => {
  try {
    await verifyDocumentId(UserModel, doc.userId)
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

export default model<BoardDoc>('Board', schema)
