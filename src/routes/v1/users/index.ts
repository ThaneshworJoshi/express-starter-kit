import express, { type Router, type Request, type Response } from 'express'

const userRouter: Router = express.Router()

userRouter.get('/', (req: Request, res: Response) => {
  res.send('User Route')
})

export default userRouter
