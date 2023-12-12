import { type ObjectSchema, type ValidationErrorItem } from 'joi'
import AppError from '../appErrors'

/**
 * Validates a given payload against a predefined schema
 * @param {object} payload
 * @param {Joi.ObjectSchema} schema
 * @returns {Promise<object>}
 */
export const validate = async (payload: object, schema: ObjectSchema): Promise<object> => {
  const options = { abortEarly: false, stripUnknown: true }

  try {
    const value = await schema.validateAsync(payload, options)
    return value
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error // Re-throw custom validation error
    }

    const validationError = new AppError(
      'Validation failed',
      400,
      error.details.map((detail: ValidationErrorItem) => detail.message),
    )
    throw validationError
  }
}
