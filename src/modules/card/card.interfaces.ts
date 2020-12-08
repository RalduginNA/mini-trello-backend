import { Types } from 'mongoose'

export interface Card {
  title: string
  description?: string
  userId: Types.ObjectId
  boardId: Types.ObjectId
  listId: Types.ObjectId
  position: number
}

export interface UpdateCardDto {
  title?: string
  description?: string
  position?: number
  listId?: Types.ObjectId
}
