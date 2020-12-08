import { Types } from 'mongoose'

export interface User {
  username: string
  email: string
  passwordHash: string
  boards: Array<Types.ObjectId>
}
