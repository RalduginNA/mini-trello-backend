import { Types } from 'mongoose'
import { MEMBERSHIP_ROLES } from '../../constants/general'

export interface Membership {
  boardId: Types.ObjectId
  userId: Types.ObjectId
  role: MEMBERSHIP_ROLES
}
