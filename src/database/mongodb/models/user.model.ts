import bcrypt from 'bcryptjs'
import mongoose, { Document, Model, Schema } from 'mongoose'

import { IUserType } from '@src/types/user/UserType'

interface IUser extends IUserType, Document {
  verifyPassword(candidatePassword: string): Promise<boolean>
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: function () {
      return !this?.googleId
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  googleAccessToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  otp: {
    type: String,
  },
  otpTries: {
    type: Number,
    default: 0,
  },
  isAccountSuspended: {
    type: Boolean,
    default: false,
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
})

/**
 * Middleware function executed before saving a user document to the database.
 * It checks if the 'password' field of the user document has been modified.
 * If modified, it hashes the password using bcrypt before saving.
 * @param next - Callback function to continue with the next middleware or operation.
 */
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

/**
 * Method to verify a candidate password against the hashed password stored in the user document.
 * @param candidatePassword - The plain-text password provided by the user for verification.
 * @returns A Promise that resolves to a boolean indicating whether the provided password matches the stored hashed password.
 */
userSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default UserModel
