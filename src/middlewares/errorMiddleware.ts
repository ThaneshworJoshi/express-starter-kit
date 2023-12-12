import { type Request, type Response, type NextFunction } from 'express'
import AppError from '../utils/appErrors'
import HttpStatusCodes from '../constants/HTTPStatusCode'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400)
}

const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value.`
  return new AppError(message, 400)
}

const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`
  return new AppError(message, 400)
}

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401)

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev = (err: AppError, res: Response): any => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

const sendErrorProd = (err: AppError, res: Response): any => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    // TODO: log error

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  }
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err)

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

export const genericErrorHandler = (error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  error.statusCode = error.statusCode || HttpStatusCodes.INTERNAL_SERVER_ERROR
  error.status = error.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res)
  } else if (process.env.NODE_ENV === 'production') {
    if (error instanceof mongoose.Error.CastError) error = handleCastErrorDB(error)
    // @ts-expect-error ---
    if (error instanceof mongoose.Error && error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(error)
    if (error instanceof jwt.JsonWebTokenError) error = handleJWTError()
    if (error instanceof jwt.TokenExpiredError) error = handleJWTExpiredError()

    sendErrorProd(error, res)
  }
}

export const notFoundErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found')
  // @ts-expect-error ---
  err.status = HttpStatusCodes.NOT_FOUND
  next(new AppError('Not Found', HttpStatusCodes.NOT_FOUND))
}
