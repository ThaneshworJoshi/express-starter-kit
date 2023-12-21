import express, { type Router, type Request, type Response } from 'express'

const authRouter: Router = express.Router()

//* User
authRouter.post('/register', (req: Request, res: Response) => {
  res.send('User Auth Route')
})

authRouter.post('/login', (req: Request, res: Response) => {
  res.send('User Login Route')
})

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
