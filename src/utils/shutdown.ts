import { type Server } from 'http'
import mongoose from 'mongoose'

export const gracefulShutdown = async (server: Server) => {
  console.log('\nShutting down gracefully...'.bg_yellow)

  // Close the server
  await closeServer(server)

  // Close the database connection
  await closeDatabaseConnection()

  console.log('Server and database connection closed. Exiting process.')

  process.exit(0)
}

const closeServer = async (server: Server) => {
  await new Promise<void>((resolve) => {
    server.close(() => {
      console.log('Server Closed.'.bg_green)

      resolve()
    })
  })
}

const closeDatabaseConnection = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
      console.log('MongoDB connection closed.')
    } else {
      console.log('No active MongoDB connection to close.')
    }
  } catch (error) {
    console.log('Error closing MongoDB connection: ', error)
  }
}
