import dotenv from 'dotenv'

dotenv.config()

export const configKeys = {
  PORT: process.env.PORT ?? '',

  MONGO_DB_URL: process.env.DATABASE! ?? '',

  DB_NAME: process.env.DB_NAME ?? '',

  JWT_SECRET: process.env.JWT_SECRET ?? '',

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET! ?? '',

  NODE_ENV: process.env.NODE_ENV ?? '',
}

export default configKeys
