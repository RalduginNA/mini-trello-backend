class HttpError extends Error {
  status: number
  constructor(statusCode: number, message: string) {
    super(message)
    this.status = statusCode
  }
}

export default HttpError
