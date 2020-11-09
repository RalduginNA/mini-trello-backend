import { Schema, model } from 'mongoose'

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

export default model('TaskColumn', schema)
