import axios from 'axios'
import { Request, Response } from 'express'

import configKeys from '@src/config'
import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import { asyncHandler } from '@src/middlewares/asyncHandler'

import * as authService from './auth.service'

/**
 * @description Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */

export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  //Create a new user
  const newUser = await authService.register(req.body)

  res.status(HttpStatusCodes.CREATED).send({ success: true, message: 'User Registered Successfully', user: newUser })
})

/**
 * @description Authenticate a user
 * @route POST /api/v1/auth/login
 * @access Public
 */

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const { accessToken, refreshToken } = await authService.login(email, password)

  res.status(HttpStatusCodes.OK).send({
    success: true,
    message: 'User Logged In Successfully',
    accessToken,
    refreshToken,
  })
})

/**
 * @description Authenticate user with Google
 * @router GET /api/v1/auth/google
 * @access Public
 */

export const googleLogin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // TODO: We would typically redirect users to Google's OAuth 2.0 authentication URL

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${configKeys.GOOGLE_CLIENT_ID}&response_type=code&scope=openid%20email%20profile&redirect_uri=YOUR_REDIRECT_URI`

  res
    .status(HttpStatusCodes.OK)
    .json({ success: true, message: 'Redirect to Google for Authentication', authUrl: googleAuthUrl })
})

/**
 * @description Callback route after Google authentication
 * @route GET api/v1/auth/google/callback
 * @access Public
 */

export const googleLoginCallback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // After the user successfully authenticates via Google and grants permission,
  // Google will redirect the user back to this callback URL with an authorization code.

  const authCode = req.query.code // Extract the authorization code from the query parameters

  // Exchange the authorization code with Google's servers to get access and refresh tokens.
  // Once you have the tokens, you can use them to fetch user details or perform other actions.

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post(`https://oauth2.googleapis.com/token`, {
      client_id: configKeys.GOOGLE_CLIENT_ID,
      client_secret: configKeys.GOOGLE_CLIENT_SECRET,
      code: authCode,
      redirect_uri: configKeys.GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
    })

    const { access_token, id_token } = data

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    // Code to handle user authentication and retrieval using the profile data
    //TODO
    res.redirect('/')
  } catch (error: any) {
    console.error('Error:', error?.response?.data?.error)
    res.redirect('/login')
  }

  res
    .status(HttpStatusCodes.OK)
    .json({ success: true, message: 'Google authentication callback received', code: authCode })
})

/**
 * @description Logout user
 * @route GET /api/v1/auth/logout
 * @access Private (assuming user is authenticated)
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // TODO : JWT implementation
  // 1. You might blacklist the token on the server-side to ensure it's no longer valid for future requests.
  // 2. Optionally, you could also remove the token from the client-side (e.g., by removing it from cookies or local storage).

  res.status(HttpStatusCodes.NO_CONTENT).json({ success: true, message: 'User logged out successfully' })
})

/**
 * @description Reset password
 * @route GET /api/v1/auth/reset-password
 * @access Public
 */
export const resetPasswordController = (req: Request, res: Response): void => {
  //TODO:  Implement logic to handle the reset password request.
  // For this example, let's assume the user sends an email to reset their password.

  const userEmail = req.body.email // Assuming the email is sent in the request body

  res.status(HttpStatusCodes.OK).json({ message: `Password reset email sent to ${userEmail}` })
}

/**
 * @description Endpoint to send a verification code to the user's email.
 * @route POST /api/v1/auth/send-verification-code
 * @access Public
 */
export const sendVerificationCode = (req: Request, res: Response): void => {
  // TODO: Logic to send a verification code to the user's email.
  // This could involve generating a code, associating it with the user's email,
  // and sending it via an email service or SMS gateway.

  res.status(HttpStatusCodes.OK).json({
    success: true,
    message: 'Verification code sent successfully',
  })
}

/**
 * @description Endpoint to verify the user's email using the provided verification code.
 * @route POST /api/v1/auth/verify-email
 * @access Public
 */
export const verifyEmail = (req: Request, res: Response): void => {
  const verificationCode = req.body.code
  // TODO: Logic to verify the user's email using the provided verification code.
  // This could involve checking if the provided code matches the one associated with the user's email.

  if (verificationCode === 'expectedCode') {
    // Replace 'expectedCode' with the actual logic to validate the code
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: 'Email verified successfully',
    })
  } else {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid verification code',
    })
  }
}
