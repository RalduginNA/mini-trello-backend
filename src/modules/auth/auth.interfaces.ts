export interface SignInDto {
  email: string
  password: string
}

export interface SignUpDto {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface RefreshDto {
  refreshToken: string
}
