import { Document, Schema } from 'mongoose'

function transformForResponse<T extends Document = Document>(doc: T, ret: T) {
  delete ret._id
  delete ret.__v
  ret.id = doc._id
}

export function generalOptionsPlugin(schema: Schema) {
  schema.set('timestamps', true)

  schema.set('toObject', {
    transform: transformForResponse,
  })

  schema.set('toJSON', {
    transform: transformForResponse,
  })
}
