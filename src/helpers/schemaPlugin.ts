import { Document, Schema } from 'mongoose'

export function generalOptionsPlugin<T extends Document = Document>(
  schema: Schema,
) {
  schema.set('timestamps', true)

  schema.set('toObject', {
    transform: function (doc: T, ret: T) {
      delete ret._id
      delete ret.__v
      ret.id = doc._id
    },
  })

  schema.set('toJSON', {
    transform: function (doc: T, ret: T) {
      delete ret._id
      delete ret.__v
      ret.id = doc._id
    },
  })
}
