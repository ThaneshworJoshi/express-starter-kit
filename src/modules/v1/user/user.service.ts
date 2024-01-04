import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

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
 * @description Update a user's password in the database using the user ID.
 *
 * @param userId - The user ID of the user whose password needs to be updated.
 * @param newPassword - The new password to set for the user.
 * @returns Promise<void> - Returns a Promise that resolves once the password is updated successfully.
 */
const updateUserPassword = async (userId: mongoose.Types.ObjectId, newPassword: string): Promise<void> => {
  try {
    const password = await bcrypt.hash(newPassword, 10)
    // Update the user's password in the database using the user ID
    await UserModel.findByIdAndUpdate(userId, { password }).exec()
  } catch (error) {
    console.error('Error updating user password:', error)
    throw new Error('Failed to update user password.')
  }
}

export { createUser, getUserByEmail, removeOtp, updateEmailConfirmationStatus, updateUserPassword }
