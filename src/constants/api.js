export const RESPONSE_CODE = {
  SUCCESS: {
    DEFAULT: {
      status: 200,
      code: 'SUCCESS',
    },
  },
  REJECT: {
    INVALID_REQUEST: {
      status: 400,
      code: 'INVALID_REQUEST',
    },
    UNAUTHORIZED: {
      status: 401,
      code: 'UNAUTHORIZED',
    },
    INTERNAL_SERVER_ERROR: {
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    },
  },
}

export default RESPONSE_CODE
