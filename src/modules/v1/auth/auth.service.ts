import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import * as mailService from '@src/lib/mail'
import * as tokenService from '@src/lib/token'
import { IUserRegister } from '@src/types/user/UserInput'
import AppError from '@src/utils/appErrors'
import { generateSecureOTP } from '@src/utils/common'

import * as userService from '../user/user.service'

/**
 * Register a new user with the provided user details.
 * @param user - The user details to register.
 * @returns A sanitized user object with sensitive fields removed.
 * @throws AppError if the user with the provided email already exists.
 */
const register = async (user: IUserRegister) => {
  const existingUser = await userService.getUserByEmail(user.email)

  if (existingUser) {
    throw new AppError('User already registered', HttpStatusCodes.CONFLICT)
  }
  const otp = generateSecureOTP()
  const newUser = await userService.createUser({ ...user, otp })

  await mailService.sendEmailVerificationOTP(user.email, otp)
  return newUser
}

/**
 * Authenticate and login the user with the provided email and password.
 * @param email - The email address of the user to authenticate.
 * @param password - The password of the user to authenticate.
 * @returns An object containing the generated access and refresh tokens.
 * @throws AppError if the credentials are invalid or the user does not exist.
 */
const login = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email)
  const isPasswordValid = await user?.verifyPassword(password)

  if (!user || !isPasswordValid) {
    throw new AppError('Invalid credentials', HttpStatusCodes.UNAUTHORIZED)
  }

  if (!user.isEmailConfirmed) {
    throw new AppError('Email not confirmed. Please verify your email to proceed.', HttpStatusCodes.BAD_REQUEST)
  }

  // Generate JWT tokens (access token and refresh token)
  const { accessToken, refreshToken } = await tokenService.generateAuthTokens({ userId: user._id })
  return {
    accessToken,
    refreshToken,
  }
}

/**
 * @description Verify the email of a user by comparing the provided OTP code.
 *
 * @param email - The email address of the user.
 * @param code - The OTP code to verify against the user's OTP.
 * @returns True if the email is successfully verified; otherwise, returns false.
 */
const verifyEmail = async (email: string, code: string) => {
  const user = await userService.getUserByEmail(email)

  if (user?.otp === code) {
    const updatedUser = await userService.updateEmailConfirmationStatus(email)
    return updatedUser?.isEmailConfirmed
  }

  return false
}

export { login, register, verifyEmail }
