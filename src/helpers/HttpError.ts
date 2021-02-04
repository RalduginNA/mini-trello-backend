import { STATUS_CODES } from '../constants/api'

class HttpError extends Error {
  status: STATUS_CODES
  constructor(statusCode: number, message: string) {
    super(message)
    this.status = statusCode
  }
}

export default HttpError
