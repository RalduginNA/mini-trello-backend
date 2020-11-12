import { Schema, model, Types, Document } from 'mongoose'
import BoardModel from './Board'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import { verifyDocumentId } from '../helpers/validators/document'

export interface TaskColum {
  name: string
  tasks: Array<Types.ObjectId>
  boardId: Types.ObjectId
}

interface TaskColumnDoc extends TaskColum, Document {}

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

schema.post('validate', async (doc: TaskColumnDoc) => {
  try {
    await verifyDocumentId(BoardModel, doc.boardId)
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

export default model<TaskColumnDoc>('TaskColumn', schema)
