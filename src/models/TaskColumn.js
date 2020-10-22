const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    name: { type: String, required: true },
    taskIds: { type: [String], required: true, default: [] },
    boardId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

module.exports = model('TaskColumn', schema)
