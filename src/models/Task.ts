import { Schema, model, Document, Types } from 'mongoose'
import HttpError from './HttpError'
import { STATUS_CODES } from '../constants/api'
import UserModel from './User'
import BoardModel from './Board'
import TaskColumnModel from './TaskColumn'
import { verifyDocumentIds } from '../helpers/validators/document'

export interface Task {
  title: string
  description?: string
  userId: Types.ObjectId
  boardId: Types.ObjectId
  taskColumnId: Types.ObjectId
}

interface TaskDoc extends Task, Document {}

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

schema.post('validate', async (doc: TaskDoc) => {
  const { boardId, userId, taskColumnId } = doc
  try {
    await verifyDocumentIds([
      [BoardModel, boardId],
      [UserModel, userId],
      [TaskColumnModel, taskColumnId],
    ])
  } catch (err) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, err.message)
  }
})

export default model<TaskDoc>('Task', schema)
