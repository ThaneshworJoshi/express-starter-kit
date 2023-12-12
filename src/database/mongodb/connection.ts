import mongoose from 'mongoose'
import configKeys from '../../config'

const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(configKeys.MONGO_DB_URL, {
      dbName: configKeys.DB_NAME,
    })
    console.log('Connected to MongoDB'.bg_green)
  } catch (error) {
    console.error('Error connecting to MongoDB:'.bg_red, error)
    process.exit(1) // Exit the process if unable to connect
  }
}

export default connectToDatabase
