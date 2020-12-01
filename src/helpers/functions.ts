import HttpError from '../models/HttpError'
import { STATUS_CODES } from '../constants/api'

export function arrayMove<T>(
  [...arr]: Array<T>,
  oldPos: number,
  newPos: number,
) {
  if (
    newPos < 0 ||
    oldPos < 0 ||
    oldPos == newPos ||
    oldPos >= arr.length ||
    oldPos >= arr.length
  ) {
    throw new HttpError(STATUS_CODES.BAD_REQUEST, 'Incorrect position')
  }

  arr.splice(newPos, 0, arr.splice(oldPos, 1)[0])

  return arr
}
