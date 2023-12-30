import { type Express, Request, Response } from 'express'

import HttpStatusCodes from '@src/constants/HTTPStatusCode'
import authRouter from '@src/modules/v1/auth/auth.routes'

const configureRoutes = (app: Express) => {
  /**
   * @openapi
   * /heartbeat:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Verifies if the server is operational and responsive.
   *     responses:
   *       200:
   *         description: Server is operational.
   *       500:
   *         description: Internal server error.
   */
  app.get('/api/v1/heartbeat', (req: Request, res: Response) => {
    try {
      res.status(HttpStatusCodes.OK).json({
        status: 'UP',
        message: 'Server is operational.',
      })
    } catch (error: any) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        status: 'DOWN',
        message: 'Internal loserver error occurred.',
        error: error.message,
      })
    }
  })

  app.use('/api/v1/auth', authRouter)
}

export default configureRoutes
