import { type Express } from 'express'
import v1Routes from '../routes/v1'

const configureRoutes = (app: Express) => {
  app.use('/v1', v1Routes)
}

export default configureRoutes
