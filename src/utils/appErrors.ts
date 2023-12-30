import type HttpStatusCodes from 'src/constants/HTTPStatusCode'

class AppError extends Error {
  statusCode: number
  status: string
  isOperational: boolean
  keyValue: any

  constructor(message: string, statusCode: HttpStatusCodes, details?: any) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error'
    this.isOperational = true
    this.keyValue = details

    // Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
