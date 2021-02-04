import { Types } from 'mongoose'
import { STATUS_CODES } from '../constants/api'
import { ErrorCodes } from '../constants/error'
import { MEMBERSHIP_ROLES } from '../constants/general'
import membershipModel from '../modules/membership/membership.model'
import HttpError from './HttpError'

export const verifyMembership = async (
  userId: Types.ObjectId,
  boardId: Types.ObjectId | string,
  role?: MEMBERSHIP_ROLES,
) => {
  const membership = await membershipModel.findOne({
    userId: userId,
    boardId: boardId,
  })

  if (!membership) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, ErrorCodes.Permission)
  }

  if (role && role !== membership.role) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, ErrorCodes.Permission)
  }
}
