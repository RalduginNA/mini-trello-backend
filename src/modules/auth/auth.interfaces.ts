export interface SignInDto {
  email: string
  password: string
}

export interface SignUpDto extends SignInDto {
  username: string
  confirmPassword: string
}

export interface RefreshDto {
  refreshToken: string
}
