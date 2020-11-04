import { Schema, model } from 'mongoose'

const schema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    // accessLevel: { type: String, enum: ['private', 'public'], required: true }, private or public
  },
  { timestamps: true },
)

export default model('Board', schema)
