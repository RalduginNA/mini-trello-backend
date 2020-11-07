import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: { type: String, required: true },
    taskIds: { type: [String], required: true, default: [], ref: 'Task' },
    boardId: { type: Schema.Types.ObjectId, required: true, ref: 'Board' },
  },
  { timestamps: true },
)

export default model('TaskColumn', schema)
