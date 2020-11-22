import { Schema, Types, model, Document } from 'mongoose'

export interface RefreshSession {
  userId: Types.ObjectId
  refreshToken: string
  createdAt: Date
}

interface RefreshSessionDoc extends Document, RefreshSession {}

const schema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
})

export default model<RefreshSessionDoc>('RefreshSession', schema)
