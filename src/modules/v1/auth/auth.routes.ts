import express, { type Request, type Response, type Router } from 'express'

import validate from '@src/middlewares/validateApiSchema'

import { loginSchema, registerSchema } from './auth.api.schema'
import { loginUser, registerUser } from './auth.controller'

const authRouter: Router = express.Router()

//* User
authRouter.post('/register', validate(registerSchema), registerUser)

authRouter.post('/login', validate(loginSchema), loginUser)

authRouter.get('/google', (req: Request, res: Response) => {
  res.send('Login with google Route')
})

authRouter.get('/google/callback', (req: Request, res: Response) => {
  res.send('Login with google Route')
})

authRouter.post('/logout', (req: Request, res: Response) => {
  res.send('User Logout Route')
})

authRouter.post('/reset-password', (req: Request, res: Response) => {
  res.send('User Reset Password Route')
})

authRouter.post('/send-verification-code', (req: Request, res: Response) => {
  res.send('User Send verification code Route')
})

authRouter.post('/verify-email', (req: Request, res: Response) => {
  res.send('User email verify Route')
})

authRouter.post('/logout', (req: Request, res: Response) => {
  res.send('User Logout Route')
})

//* Admin
authRouter.post('/admin/login', (req: Request, res: Response) => {
  res.send('Admin Auth Route')
})

export default authRouter
