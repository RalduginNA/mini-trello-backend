class HttpError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.status = statusCode
  }
}

export default HttpError
