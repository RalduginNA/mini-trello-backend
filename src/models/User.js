const { Schema, model } = require('mongoose')
const hash = require('../helpers/hash')

const schema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
)

schema.methods.setPassword = async function (password) {
  this.passwordHash = await hash.get(password)
}

schema.methods.validPassword = async function (password) {
  return await hash.verify(this.passwordHash, password)
}

module.exports = model('User', schema)
