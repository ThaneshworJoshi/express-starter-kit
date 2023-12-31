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
  return removeKeysFromObject(createdUser.toJSON(), ['password', '_id', '__v'])
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

export { createUser, getUserByEmail }
