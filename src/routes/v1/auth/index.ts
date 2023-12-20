import express, { type Router, type Request, type Response } from 'express'

const authRouter: Router = express.Router()

//* User
authRouter.post('/register', (req: Request, res: Response) => {
  res.send('User Auth Route')
})

authRouter.post('/login', (req: Request, res: Response) => {
  res.send('User Login Route')
})

authRouter.post('/login-with-google', (req: Request, res: Response) => {
  res.send('Login with google Route')
})

//* Admin
authRouter.post('/admin/login', (req: Request, res: Response) => {
  res.send('Admin Auth Route')
})

export default authRouter
