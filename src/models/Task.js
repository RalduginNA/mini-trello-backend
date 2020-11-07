import { Schema, model } from 'mongoose'

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

export default model('Task', schema)
