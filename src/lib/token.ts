import jwt from 'jsonwebtoken'

import configKeys from '@src/config'
import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import AppError from '@src/utils/appErrors'

/**
 * Generate JWT token with specified payload and options.
 *
 * @param payload - The payload to include in the JWT token (e.g., userId, username).
 * @param expiresIn - The expiration time for the JWT token (e.g., '1h' for 1 hour).
 * @param secret - The secret key used to sign the JWT token.
 * @returns The generated JWT token based on the provided payload and options.
 */
const generateJwtToken = (payload: any, expiresIn: string, secret: string): string => {
  try {
    // Generate JWT token with specified payload, expiration, and secret key.
    const token = jwt.sign(payload, secret, { expiresIn })

    return token
  } catch (error: any) {
    // Handle any errors during token generation (e.g., invalid payload, secret, options).
    console.error('Error generating JWT token:', error.message)
    throw new Error('Failed to generate JWT token.')
  }
}

/**
 * Generate authentication tokens (access and refresh) for the user session.
 *
 * @param user - The user object containing relevant user details.
 * @param sessionId - The session ID associated with the user session.
 * @returns An object containing the generated access and refresh tokens.
 */

const generateAuthTokens = async (user: object): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    // Generate access token with a 1-hour expiration
    const accessToken = generateJwtToken(user, '1h', configKeys.JWT_SECRET)

    // Generate refresh token with a 7-hour expiration
    const refreshToken = generateJwtToken(user, '7h', configKeys.JWT_REFRESH_SECRET)

    return {
      accessToken,
      refreshToken,
    }
  } catch (error) {
    throw new AppError('Failed to generate auth tokens', HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}

export { generateAuthTokens, generateJwtToken }
