import nodemailer from 'nodemailer'

import configKeys from '@src/config'
import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import AppError from '@src/utils/appErrors'

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: configKeys.EMAIL,
    pass: configKeys.EMAIL_PASS,
  },
})

/**
 * Send an email using Nodemailer.
 * @param to - The recipient email address.
 * @param subject - The email subject.
 * @param text - The plain text content of the email.
 */
const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    // Define email options
    const mailOptions = {
      from: 'noreply@starter.com', // Sender email address
      to, // Recipient email address
      subject, // Email subject
      text, // Email content (plain text)
    }

    // Send email using Nodemailer transporter
    const info = await transporter.sendMail(mailOptions)

    console.log('Email sent:', info.response)
  } catch (error) {
    console.error('Error sending email:', error)
    throw new AppError('Failed to send email', HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}

/**
 * Send an OTP to the specified email address for email verification.
 *
 * @param to - The recipient email address where OTP should be sent for verification.
 * @param otp - The One-Time Password (OTP) for verification.
 */
const sendEmailVerificationOTP = async (to: string, otp: string) => {
  const subject = 'Email Verification OTP'
  const message = `Hello,\n\nYour OTP for email verification is: ${otp}\n\nPlease use this OTP to verify your email address.`

  try {
    // Sending the OTP verification email
    await sendEmail(to, subject, message)
  } catch (error) {
    // Handling errors if the email fails to send
    throw new AppError('Failed to send email verification OTP', HttpStatusCodes.INTERNAL_SERVER_ERROR)
  }
}
export { sendEmail, sendEmailVerificationOTP }
