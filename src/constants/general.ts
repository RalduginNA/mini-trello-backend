export const MOVE_STEP = 1

export enum BOARD_PERMISSION_LEVEL {
  PRIVATE = 'private',
  GROUP = 'group',
}

export enum MEMBERSHIP_ROLES {
  ADMIN = 'admin',
  USER = 'user',
}

export const PASSWORD_REGEX = /^[\x20-\x7E]+$/
