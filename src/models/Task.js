const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, required: true },
    boardId: { type: Schema.Types.ObjectId, required: true },
    taskColumnId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

module.exports = model('Task', schema)
