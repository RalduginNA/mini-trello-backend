import { Types } from 'mongoose'

export interface List {
  name: string
  boardId: Types.ObjectId
  position: number
}

export interface CreateListDto extends List {}

export interface UpdateListDto extends Partial<Omit<List, 'boardId'>> {}
