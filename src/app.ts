import express, { type Express, NextFunction, Request, Response } from 'express'
import http from 'http'
import dotenv from 'dotenv'
import colors = require('colors.ts')
import serverSetup from './server/server'
import configureExpressApp from './server/express'
// import connectToDatabase from "./database/mongodb/connection";
import configureRoutes from './server/route'
import AppError from './utils/appErrors'
import { genericErrorHandler, notFoundErrorHandler } from './middlewares/errorMiddleware'
import { gracefulShutdown } from './utils/shutdown'

dotenv.config()
colors.enable()

const app: Express = express()
const server = http.createServer(app)

// Call the connectToDatabase function
// connectToDatabase();

// Configure middlewares
configureExpressApp(app)

// Configure routes
configureRoutes(app)

app.use([notFoundErrorHandler, genericErrorHandler])

//* starting the server with server config
serverSetup(server).startServer()

// Handle Ctrl+C to gracefully shut down the server and close the database connection
process.on('SIGINT', async () => await gracefulShutdown(server))
