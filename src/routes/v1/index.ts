import express, { Application, type Router } from 'express'
import userRoutes from './users'
import adminRoutes from './admins'

const v1Router: Router = express.Router()

v1Router.use('/users', userRoutes)
v1Router.use('/admins', adminRoutes)

export default v1Router
