import { Schema, model, Document } from 'mongoose'
import hash from '../helpers/hash'
import { generalOptionsPlugin } from '../helpers/schemaPlugin'
import { Timestamp } from '../types'

export interface User extends Timestamp {
  username: string
  email: string
  passwordHash: string
  setPassword: (password: string) => void
  validPassword: (password: string) => Promise<boolean>
}

interface UserDoc extends User, Document {}

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
  passwordHash: { type: String, required: true },
})

schema.methods.setPassword = async function (password: string) {
  this.passwordHash = await hash.get(password)
}

schema.methods.validPassword = async function (password: string) {
  return await hash.verify(this.passwordHash, password)
}

schema.plugin(generalOptionsPlugin)

export default model<UserDoc>('User', schema)
