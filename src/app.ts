import colors = require('colors.ts')
import dotenv from 'dotenv'
import express, { type Express } from 'express'
import http from 'http'

import connectToDatabase from '@src/database/mongodb/connection'
import { genericErrorHandler, notFoundErrorHandler } from '@src/middlewares/errorMiddleware'
import configureExpressApp from '@src/server/express'
import configureRoutes from '@src/server/route'
import serverSetup from '@src/server/server'
import { gracefulShutdown } from '@src/utils/shutdown'

dotenv.config()
colors.enable()

const app: Express = express()
const server = http.createServer(app)

// Call the connectToDatabase function
connectToDatabase()

// Configure middlewares
configureExpressApp(app)

// Configure routes
configureRoutes(app)

// Central Error Handler
// The middleware functions notFoundErrorHandler and genericErrorHandler are registered to handle errors in the application.
app.use([notFoundErrorHandler, genericErrorHandler])

//* starting the server with server config
serverSetup(server).startServer()

// Handle Ctrl+C to gracefully shut down the server and close the database connection
process.on('SIGINT', async () => await gracefulShutdown(server))
