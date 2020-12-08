import { Types } from 'mongoose'

export interface List {
  name: string
  boardId: Types.ObjectId
  position: number
}

export interface CreateListDto {
  name: string
  boardId: Types.ObjectId
  position: number
}

export interface UpdateListDto {
  name?: string
  position?: number
}
