import { Types } from 'mongoose'

export interface RefreshSession {
  userId: Types.ObjectId
  refreshToken: string
  createdAt?: Date
}
