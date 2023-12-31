export interface IUserType {
  username: string
  email: string
  password: string
  googleId: string
  googleAccessToken: string
  otp: string
  otpTries: number
  isAccountSuspended: boolean
  isEmailConfirmed: boolean
}
