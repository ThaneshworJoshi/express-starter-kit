import * as Joi from 'joi'

const title = Joi.string().min(2).max(240).required()
const subtitle = Joi.string()

export const testSchema = Joi.object({
  title,
  subtitle,
})
