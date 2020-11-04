const RESPONSE_CODE = {
  SUCCESS: {
    DEFAULT: {
      status: 'SUCCESS',
      code: 200,
    },
  },
  REJECT: {
    INVALID_REQUEST: {
      status: 'INVALID_REQUEST',
      code: 400,
    },
    UNAUTHORIZED: {
      status: 'UNAUTHORIZED',
      code: 401,
    },
    INTERNAL_SERVER_ERROR: {
      status: 'INTERNAL_SERVER_ERROR',
      code: 500,
    },
  },
}

export default RESPONSE_CODE
