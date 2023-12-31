import * as Joi from 'joi'

const email = Joi.string().email().min(8).max(240).lowercase().trim().required()

const password = Joi.string()
  .min(8)
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?[\d]).*$/u)
  .message('{{#label}} must contain one uppercase one lowercase letter, and one digit')
  .required()

const confirmPassword = Joi.any()
  .equal(Joi.ref('password'))
  .required()
  .label('confirm password')
  .messages({ 'any.only': '{{#label}} does not match' })

const refreshToken = Joi.string().required()

/* ==========================================================================
  -- User Login Schema
========================================================================== */
export const loginSchema = Joi.object({
  email,
  password,
})

/* ==========================================================================
  -- User Register Schema
========================================================================== */
export const registerSchema = Joi.object({
  email,
  password,
  confirmPassword,
})
