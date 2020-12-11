import { Types } from 'mongoose'

export interface Card {
  title: string
  description?: string
  userId: Types.ObjectId
  boardId: Types.ObjectId
  listId: Types.ObjectId
  position: number
}

export interface CreateCardDto extends Omit<Card, 'userId'> {}

export interface UpdateCardDto
  extends Partial<Omit<Card, 'userId' | 'boardId'>> {}
