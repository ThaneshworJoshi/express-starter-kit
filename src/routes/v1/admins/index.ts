import express, { type Router, type Request, type Response } from 'express'

const adminRouter: Router = express.Router()

adminRouter.get('/', (req: Request, res: Response) => {
  res.send('Admin Route')
})

export default adminRouter
