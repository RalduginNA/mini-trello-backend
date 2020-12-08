import { Schema, model, Document, Types } from 'mongoose'
import { User } from './user.interfaces'
import { TokenPayload } from '../../helpers/jwt'
import { Timestamp } from '../../types'
import hash from '../../helpers/hash'
import { generalOptionsPlugin } from '../../helpers/schemaPlugin'

interface UserDoc extends User, Timestamp, Document {
  setPassword: (password: string) => Promise<void>
  validPassword: (password: string) => Promise<boolean>
  getTokenPayload: () => TokenPayload
}

const schema = new Schema({
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
  boards: {
    type: [{ type: Types.ObjectId, ref: 'Board' }],
    required: true,
    default: [],
  },
  passwordHash: { type: String, required: true },
})

schema.methods.setPassword = async function (password: string) {
  this.passwordHash = await hash.get(password)
}

schema.methods.validPassword = async function (password: string) {
  return await hash.verify(this.passwordHash, password)
}

schema.methods.getTokenPayload = function (): TokenPayload {
  return {
    _id: this._id,
    username: this.username,
  }
}

schema.plugin(generalOptionsPlugin)

export default model<UserDoc>('User', schema)
