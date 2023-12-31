import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import { IUserRegister } from '@src/types/user/UserInput'
import AppError from '@src/utils/appErrors'

import * as userService from '../user/user.service'

export const register = async (user: IUserRegister) => {
  const existingUser = await userService.getUserByEmail(user.email)

  if (existingUser) {
    throw new AppError('User already registered', HttpStatusCodes.CONFLICT)
  }

  const newUser = await userService.createUser(user)
}
