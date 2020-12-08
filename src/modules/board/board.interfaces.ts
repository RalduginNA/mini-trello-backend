import { Types } from 'mongoose'
import { BOARD_PERMISSION_LEVEL } from '../../constants/general'

export interface Board {
  name: string
  users: Array<Types.ObjectId>
  settings: {
    backgroundImage: string
    permissionLevel: BOARD_PERMISSION_LEVEL
  }
}

export interface UpdatedBoardDto {
  name?: string
}

export interface CreateBoardDto extends Board {}
