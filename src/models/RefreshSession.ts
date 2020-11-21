import { Schema, Types, model, Document } from 'mongoose'

export interface RefreshSession {
  user: Types.ObjectId
  refreshToken: string
  created: Date
}

interface RefreshSessionDoc extends Document, RefreshSession {}

const schema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  created: { type: Date, default: Date.now, required: true },
})

export default model<RefreshSessionDoc>('RefreshSession', schema)
