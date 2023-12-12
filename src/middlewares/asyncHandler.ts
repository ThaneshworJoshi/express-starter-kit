import { type Request, type Response, type NextFunction, type RequestHandler } from 'express'

/**
 * Middleware function to handle asynchronous operations in Express.js controllers.
 * @param {RequestHandler} handler - The original Express.js request handler function.
 * @returns {RequestHandler} - A new middleware function that handles asynchronous operations.
 */
export const asyncHandler = (handler: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
  await Promise.resolve(handler(req, res, next)).catch(next)
}
