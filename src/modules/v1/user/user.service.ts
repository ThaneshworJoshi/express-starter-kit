import UserModel from '@src/database/mongodb/models/user.model'
import { IUserRegister } from '@src/types/user/UserInput'
import { removeKeysFromObject } from '@src/utils/common'

/**
 * @description Create a new user record in the database.
 *
 * @param user - The user registration details.
 * @returns A new user object with sensitive keys removed.
 * @throws Throws an error if the user creation fails.
 */
const createUser = async (user: IUserRegister) => {
  const createdUser = await UserModel.create(user)
  return removeKeysFromObject(createdUser.toJSON(), ['password', '_id', '__v', 'otp'])
}

/**
 * @description Retrieve a user from the database using the email address.
 *
 * @param email - The email address of the user to retrieve.
 * @returns The user object associated with the specified email address.
 *           If no user is found, null value will be returned.
 */
const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email })
  return user
}

/**
 * @description Update the email confirmation status for a user in the database.
 *
 * @param email - The email address of the user to update.
 * @returns The updated user object if successful; otherwise, returns null.
 */
const updateEmailConfirmationStatus = async (email: string) => {
  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { isEmailConfirmed: true, $unset: { otp: 1 } },

    { new: true },
  )
  return updatedUser
}

/**
 * @description Remove the OTP for a user in the database .
 *
 * @param email - The email address of the user to update.
 * @returns The updated user object if successful; otherwise, returns null.
 */
const removeOtp = async (email: string) => {
  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { $unset: { otp: 1 } }, // Remove the OTP field from the user record
    { new: true }, // Return the updated document
  )
  return updatedUser
}

/**
 * @description Increment the otpTries field for a user in the database.
 *
 * @param email - The email address of the user to update.
 * @returns The updated user object if successful; otherwise, returns null.
 */
const incrementOtpTries = async (email: string) => {
  const updatedUser = await UserModel.findOneAndUpdate(
    { email },
    { $inc: { otpTries: 1 } }, // Increment the otpTries field by 1
    { new: true },
  )
  return updatedUser
}

// Maximum allowed OTP attempts for a user
const MAX_OTP_TRIES = 5

// Lockout duration in milliseconds (1 hour)
const LOCKOUT_DURATION = 60 * 60 * 1000

/**
 * @description Verify OTP for a user based on their email address.
 *
 * @param email - The email address of the user.
 * @param otp - The OTP code entered by the user.
 * @returns - Returns true if OTP is valid; otherwise, false.
 */
const verifyOtp = async (email: string, otp: string) => {
  // Retrieve user by email from the database
  const user = await UserModel.findOne({ email })

  // If user is not found, return false
  if (!user) {
    // Handle user not found
    return false
  }

  // Get current date and time
  const now = new Date() as any
  const lastOtpAttemptAt = user.lastOtpAttemptAt ? new Date() : (user.lastOtpAttemptAt as unknown as Date)
  // Check if user account is locked or within lockout duration
  if (
    user.isAccountSuspended ||
    (user.lastOtpAttemptAt &&
      now.getTime() - (lastOtpAttemptAt?.getTime ? lastOtpAttemptAt.getTime() : 0) < LOCKOUT_DURATION)
  ) {
    // Handle locked account or within lockout duration
    return false
  }

  // If OTP does not match
  if (user.otp !== otp) {
    // Update last OTP attempt timestamp and increment OTP tries
    user.lastOtpAttemptAt = now
    await user.save()

    // Increment OTP tries count
    if (!user.otpTries) {
      user.otpTries = 1
    } else {
      user.otpTries += 1
    }

    // If OTP tries exceed maximum allowed attempts, lock the account
    if (user.otpTries >= MAX_OTP_TRIES) {
      // user.isLocked = true
      // user.lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION)
    }

    // Save user changes
    await user.save()

    // Return false indicating OTP verification failed
    return false
  }

  // If OTP matches, reset OTP tries count and last attempt timestamp
  user.otpTries = 0
  // user.lastOtpAttemptAt = null
  await user.save()

  // Return true indicating OTP verification succeeded
  return true
}

export { createUser, getUserByEmail, incrementOtpTries, removeOtp, updateEmailConfirmationStatus, verifyOtp }
