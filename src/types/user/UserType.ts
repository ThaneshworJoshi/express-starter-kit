export interface IUserType {
  username: string
  email: string
  password: string
  googleId: string
  googleAccessToken: string
  otpTries: number
  isAccountSuspended: boolean
  isEmailConfirmed: boolean
}
