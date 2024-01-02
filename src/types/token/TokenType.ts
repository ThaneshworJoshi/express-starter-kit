import mongoose from 'mongoose'

export enum TokenType {
  RESET_PASSWORD = 'reset_password',
  AUTHENTICATION = 'authentication',
  EMAIL_VERIFICATION = 'email_verification',
  // Add more token types as needed
}

export interface IToken extends Document {
  userId: mongoose.Types.ObjectId
  token: string
  type: TokenType
  expires: Date
}
