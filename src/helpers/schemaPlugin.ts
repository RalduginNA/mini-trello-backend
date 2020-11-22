import { Schema } from 'mongoose'

export const generalOptionsPlugin = (schema: Schema) => {
  schema.set('timestamps', true)

  schema.set('toObject', {
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
      ret.id = doc._id
    },
  })

  schema.set('toJSON', {
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
      ret.id = doc._id
    },
  })
}
