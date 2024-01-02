import { Date } from 'mongoose'

export interface IUserType {
  username: string
  email: string
  password: string
  googleId: string
  googleAccessToken: string
  otp: string
  otpTries: number
  lastOtpAttemptAt: Date
  isAccountSuspended: boolean
  isEmailConfirmed: boolean
}
