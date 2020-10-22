const { Schema, model } = require('mongoose')

const schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    // accessLevel: { type: String, required: true }, private or public
  },
  { timestamps: true },
)

module.exports = model('Board', schema)
