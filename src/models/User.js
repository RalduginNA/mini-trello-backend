import { Schema, model } from 'mongoose'
import hash from '../helpers/hash'

const schema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

schema.methods.setPassword = async function (password) {
  this.passwordHash = await hash.get(password)
}

schema.methods.validPassword = async function (password) {
  return await hash.verify(this.passwordHash, password)
}

export default model('User', schema)
