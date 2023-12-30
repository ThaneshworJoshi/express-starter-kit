import { type NextFunction, type Request, type Response } from 'express'
import Joi, { type ValidationErrorItem } from 'joi'

import AppError from '@src/utils/appErrors'

interface Options {
  queryString?: boolean
  params?: boolean
}

// TODO: Refactor

/**
 * Validates a given payload against a predefined schema
 * @param {object} payload
 * @param {Joi.ObjectSchema} schema
 * @returns {Promise<object>}
 */
export const validate =
  (schema: Joi.Schema, options?: Options) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any

      // Parse based on options
      if (options?.queryString) {
        dataToValidate = req.query
      } else if (options?.params) {
        dataToValidate = req.params
      } else {
        dataToValidate = req.body
      }

      const value = await schema.validateAsync(dataToValidate, { abortEarly: false, stripUnknown: true })

      // Update request data with validated value
      if (options?.queryString) {
        req.query = value
      } else if (options?.params) {
        req.params = value
      } else {
        req.body = value
      }

      return next()
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error // Re-throw custom validation error
      }
      const validationError = new AppError(
        'Validation failed',
        400,
        error.details.map((detail: ValidationErrorItem) => detail.message),
      )
      next(validationError)
    }
  }

export default validate
