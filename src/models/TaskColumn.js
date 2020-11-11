import { Schema, model } from 'mongoose'
import BoardModel from './Board'
import HttpError from './HttpError'
import RESPONSE_CODE from '../constants/api'
import { verifyDocumentId } from '../helpers/validators/document'

const schema = new Schema(
  {
    name: { type: String, required: true },
    tasks: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Task',
        },
      ],
      required: true,
      default: [],
    },
    boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
  },
  { timestamps: true },
)

schema.post('validate', async (doc) => {
  try {
    await verifyDocumentId(BoardModel, doc.boardId)
  } catch (err) {
    throw new HttpError(
      RESPONSE_CODE.REJECT.INVALID_REQUEST.status,
      err.message,
    )
  }
})

export default model('TaskColumn', schema)
