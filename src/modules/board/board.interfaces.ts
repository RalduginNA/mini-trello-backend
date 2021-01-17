import { Types } from 'mongoose'
import { BOARD_PERMISSION_LEVEL } from '../../constants/general'

export interface Board {
  name: string
  users: Array<Types.ObjectId>
  viewedAt: Date
  settings: {
    backgroundImage: string
    permissionLevel: BOARD_PERMISSION_LEVEL
  }
}

export interface CreateBoardDto extends Pick<Board, 'name'> {}

export interface UpdateBoardDto {
  name?: string
}
