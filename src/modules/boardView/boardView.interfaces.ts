import { Types } from 'mongoose'

export interface BoardView {
  userId: Types.ObjectId
  boardId: Types.ObjectId
  date: Date
}
