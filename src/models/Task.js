import { Schema, model } from 'mongoose'
import HttpError from './HttpError'
import RESPONSE_CODE from '../constants/api'
import UserModel from './User'
import BoardModel from './Board'
import TaskColumnModel from './TaskColumn'
import { verifyDocumentIds } from '../helpers/validators/document'

const schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
    taskColumnId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'TaskColumn',
    },
  },
  { timestamps: true },
)

schema.post('validate', async (doc) => {
  const { boardId, userId, taskColumnId } = doc
  try {
    await verifyDocumentIds([
      [BoardModel, boardId],
      [UserModel, userId],
      [TaskColumnModel, taskColumnId],
    ])
  } catch (err) {
    throw new HttpError(
      RESPONSE_CODE.REJECT.INVALID_REQUEST.status,
      err.message,
    )
  }
})

export default model('Task', schema)
