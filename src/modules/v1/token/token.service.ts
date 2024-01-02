import mongoose from 'mongoose'

import TokenModel from '@src/database/mongodb/models/token.model'
import { IToken, TokenType } from '@src/types/token/TokenType'
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

export { saveToken }
