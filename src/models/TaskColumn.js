import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: { type: String, required: true },
    taskIds: { type: [String], required: true, default: [] },
    boardId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

export default model('TaskColumn', schema)
