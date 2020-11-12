class HttpError extends Error {
  status: string
  constructor(statusCode: string, message: string) {
    super(message)
    this.status = statusCode
  }
}

export default HttpError
