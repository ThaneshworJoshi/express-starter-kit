import mongoose from 'mongoose'

import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import TokenModel from '@src/database/mongodb/models/token.model'
import { IToken, TokenType } from '@src/types/token/TokenType'
import AppError from '@src/utils/appErrors'
import { generateRandomToken } from '@src/utils/common'

/**
 * @description Save the token details in the database.
 *
 * @param userId - The user ID associated with the token.
 * @param type - The type of the token (e.g., RESET_PASSWORD, AUTHENTICATION).
 * @returns Promise<IToken> - Returns a Promise resolving to the saved token document.
 */
const saveToken = async (userId: mongoose.Types.ObjectId, type: TokenType): Promise<IToken> => {
  try {
    const tokenExpiry = new Date(Date.now() + 3600000) // 1 hour in milliseconds
    const token = generateRandomToken()

    // Create a new token document using the Token model
    const tokenData = new TokenModel({
      userId, // Convert userId to ObjectId if needed
      token,
      type,
      expires: tokenExpiry,
    })

    const savedToken: IToken = await tokenData.save()

    return savedToken
  } catch (error) {
    throw new Error('Failed to save token.')
  }
}

/**
 * @description Validate the token against the database and return token details if valid.
 *
 * @param token - The token string to validate.
 * @param type - The type of the token (e.g., RESET_PASSWORD, AUTHENTICATION).
 * @returns Promise<IToken | null> - Returns a Promise resolving to the token document if valid; otherwise, returns null.
 */
const validateToken = async (token: string, type: TokenType): Promise<IToken | null> => {
  try {
    const tokenData: IToken | null = await TokenModel.findOne({
      token,
      type,
      expires: { $gt: new Date() }, // Check if the token has not expired
    }).exec()

    if (!tokenData) {
      return null
    }

    return tokenData
  } catch (error) {
    console.error('Error validating token:', error)
    throw new AppError('Invalid Token', HttpStatusCodes.BAD_REQUEST)
  }
}

/**
 * @description Remove the specified token from the database.
 *
 * @param token - The token string to remove.
 * @param type - The type of the token (e.g., RESET_PASSWORD, AUTHENTICATION).
 * @returns Promise<boolean> - Returns a Promise resolving to true if the token is removed successfully; otherwise, returns false.
 */
const invalidateToken = async (token: string, type: TokenType): Promise<boolean> => {
  try {
    // Find and remove the token from the database based on the provided token string and type
    const deleteResult = await TokenModel.findOneAndDelete({
      token,
      type,
    }).exec()

    if (deleteResult) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error removing token:', error)
    throw new AppError('Invalid Token', HttpStatusCodes.BAD_REQUEST)
  }
}

export { invalidateToken, saveToken, validateToken }
